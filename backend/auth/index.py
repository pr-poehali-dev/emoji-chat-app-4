"""
Авторизация пользователей: отправка OTP, верификация кода, получение профиля.
Вход/регистрация по номеру телефона с OTP-кодом (4 цифры).
"""

import json
import os
import random
import string
import secrets
from datetime import datetime, timedelta
import psycopg2


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
    }


def response(status, body):
    return {
        "statusCode": status,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps(body, ensure_ascii=False, default=str),
    }


def handler(event: dict, context) -> dict:
    """Обрабатывает запросы авторизации: send_otp, verify_otp, get_me, update_profile."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    schema = get_schema()

    # ── POST /auth?action=send_otp ──────────────────────────────────────────
    if method == "POST" and action == "send_otp":
        phone = (body.get("phone") or "").strip()
        if not phone or len(phone) < 7:
            return response(400, {"error": "Укажите номер телефона"})

        otp = str(random.randint(1000, 9999))
        expires = datetime.now() + timedelta(minutes=5)

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"""
            INSERT INTO {schema}.users (phone, otp_code, otp_expires_at)
            VALUES (%s, %s, %s)
            ON CONFLICT (phone) DO UPDATE
              SET otp_code = EXCLUDED.otp_code,
                  otp_expires_at = EXCLUDED.otp_expires_at
            """,
            (phone, otp, expires),
        )
        conn.commit()
        cur.close()
        conn.close()

        # В реальном проекте здесь отправляется SMS через провайдера.
        # Для демо возвращаем код напрямую.
        return response(200, {"ok": True, "otp": otp, "message": "Код отправлен"})

    # ── POST /auth?action=verify_otp ────────────────────────────────────────
    if method == "POST" and action == "verify_otp":
        phone = (body.get("phone") or "").strip()
        otp = (body.get("otp") or "").strip()
        if not phone or not otp:
            return response(400, {"error": "Укажите телефон и код"})

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, otp_code, otp_expires_at, name, username FROM {schema}.users WHERE phone = %s",
            (phone,),
        )
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return response(404, {"error": "Пользователь не найден"})

        user_id, db_otp, expires_at, name, username = row
        if db_otp != otp:
            cur.close()
            conn.close()
            return response(400, {"error": "Неверный код"})
        if expires_at and datetime.now() > expires_at:
            cur.close()
            conn.close()
            return response(400, {"error": "Код устарел, запросите новый"})

        token = secrets.token_hex(32)
        cur.execute(
            f"UPDATE {schema}.users SET session_token = %s, otp_code = NULL, otp_expires_at = NULL WHERE id = %s",
            (token, user_id),
        )
        conn.commit()
        cur.close()
        conn.close()

        is_new = not name
        return response(200, {
            "ok": True,
            "token": token,
            "is_new": is_new,
            "user": {"id": user_id, "phone": phone, "name": name, "username": username},
        })

    # ── GET /auth?action=get_me ─────────────────────────────────────────────
    if method == "GET" and action == "get_me":
        token = (event.get("headers") or {}).get("X-Auth-Token", "")
        if not token:
            return response(401, {"error": "Не авторизован"})

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, phone, name, username, bio, avatar_url, created_at FROM {schema}.users WHERE session_token = %s",
            (token,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return response(401, {"error": "Сессия недействительна"})

        uid, phone, name, username, bio, avatar_url, created_at = row
        return response(200, {
            "ok": True,
            "user": {
                "id": uid, "phone": phone, "name": name,
                "username": username, "bio": bio,
                "avatar_url": avatar_url, "created_at": str(created_at),
            },
        })

    # ── POST /auth?action=update_profile ────────────────────────────────────
    if method == "POST" and action == "update_profile":
        token = (event.get("headers") or {}).get("X-Auth-Token", "")
        if not token:
            return response(401, {"error": "Не авторизован"})

        name = (body.get("name") or "").strip()
        username = (body.get("username") or "").strip()
        bio = (body.get("bio") or "").strip()

        if not name:
            return response(400, {"error": "Укажите имя"})

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"""
            UPDATE {schema}.users
            SET name = %s, username = %s, bio = %s, updated_at = NOW()
            WHERE session_token = %s
            RETURNING id, phone, name, username, bio
            """,
            (name, username or None, bio, token),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if not row:
            return response(401, {"error": "Сессия недействительна"})

        uid, phone, name, username, bio = row
        return response(200, {
            "ok": True,
            "user": {"id": uid, "phone": phone, "name": name, "username": username, "bio": bio},
        })

    return response(404, {"error": "Неизвестный action"})
