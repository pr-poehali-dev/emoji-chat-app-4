"""
Сообщения: список диалогов, история сообщений, отправка, поиск пользователей.
"""

import json
import os
import psycopg2


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
    }


def resp(status, body):
    return {
        "statusCode": status,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps(body, ensure_ascii=False, default=str),
    }


def get_user_by_token(cur, schema, token):
    cur.execute(
        f"SELECT id, name, username, phone FROM {schema}.users WHERE session_token = %s",
        (token,),
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    """Управление сообщениями: список диалогов, история, отправка, поиск пользователей."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    token = (event.get("headers") or {}).get("X-Auth-Token", "")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    schema = get_schema()

    if not token:
        return resp(401, {"error": "Не авторизован"})

    conn = get_db()
    cur = conn.cursor()

    user_row = get_user_by_token(cur, schema, token)
    if not user_row:
        cur.close()
        conn.close()
        return resp(401, {"error": "Сессия недействительна"})

    me_id, me_name, me_username, me_phone = user_row

    # ── GET ?action=dialogs — список диалогов ───────────────────────────────
    if method == "GET" and action == "dialogs":
        cur.execute(f"""
            SELECT
                d.id,
                CASE WHEN d.user1_id = %s THEN d.user2_id ELSE d.user1_id END AS partner_id,
                u.name, u.username, u.phone,
                m.text AS last_text,
                m.created_at AS last_time,
                m.sender_id AS last_sender,
                COUNT(unread.id) AS unread_count
            FROM {schema}.dialogs d
            JOIN {schema}.users u ON u.id = CASE WHEN d.user1_id = %s THEN d.user2_id ELSE d.user1_id END
            LEFT JOIN {schema}.messages m ON m.id = (
                SELECT id FROM {schema}.messages WHERE dialog_id = d.id ORDER BY created_at DESC LIMIT 1
            )
            LEFT JOIN {schema}.messages unread ON unread.dialog_id = d.id
                AND unread.is_read = FALSE AND unread.sender_id != %s
            WHERE d.user1_id = %s OR d.user2_id = %s
            GROUP BY d.id, partner_id, u.name, u.username, u.phone, m.text, m.created_at, m.sender_id
            ORDER BY d.last_message_at DESC
        """, (me_id, me_id, me_id, me_id, me_id))

        rows = cur.fetchall()
        cur.close()
        conn.close()

        dialogs = []
        for r in rows:
            d_id, p_id, p_name, p_username, p_phone, last_text, last_time, last_sender, unread = r
            dialogs.append({
                "dialog_id": d_id,
                "partner": {"id": p_id, "name": p_name, "username": p_username, "phone": p_phone},
                "last_message": {"text": last_text, "time": str(last_time) if last_time else None, "is_mine": last_sender == me_id},
                "unread_count": unread,
            })

        return resp(200, {"ok": True, "dialogs": dialogs})

    # ── GET ?action=messages&dialog_id=X — история сообщений ────────────────
    if method == "GET" and action == "messages":
        dialog_id = params.get("dialog_id")
        if not dialog_id:
            cur.close()
            conn.close()
            return resp(400, {"error": "Укажите dialog_id"})

        # Проверяем доступ
        cur.execute(
            f"SELECT id FROM {schema}.dialogs WHERE id = %s AND (user1_id = %s OR user2_id = %s)",
            (dialog_id, me_id, me_id),
        )
        if not cur.fetchone():
            cur.close()
            conn.close()
            return resp(403, {"error": "Нет доступа"})

        # Отмечаем прочитанными
        cur.execute(
            f"UPDATE {schema}.messages SET is_read = TRUE WHERE dialog_id = %s AND sender_id != %s",
            (dialog_id, me_id),
        )

        cur.execute(
            f"""
            SELECT m.id, m.sender_id, u.name, m.text, m.is_read, m.created_at
            FROM {schema}.messages m
            JOIN {schema}.users u ON u.id = m.sender_id
            WHERE m.dialog_id = %s
            ORDER BY m.created_at ASC
            LIMIT 100
            """,
            (dialog_id,),
        )
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()

        messages = []
        for r in rows:
            m_id, sender_id, sender_name, text, is_read, created_at = r
            messages.append({
                "id": m_id,
                "from": "me" if sender_id == me_id else "them",
                "sender_name": sender_name,
                "text": text,
                "is_read": is_read,
                "time": str(created_at),
            })

        return resp(200, {"ok": True, "messages": messages, "me_id": me_id})

    # ── POST ?action=send — отправить сообщение ──────────────────────────────
    if method == "POST" and action == "send":
        text = (body.get("text") or "").strip()
        partner_id = body.get("partner_id")
        dialog_id = body.get("dialog_id")

        if not text:
            cur.close()
            conn.close()
            return resp(400, {"error": "Сообщение не может быть пустым"})

        # Создаём или находим диалог
        if not dialog_id:
            if not partner_id:
                cur.close()
                conn.close()
                return resp(400, {"error": "Укажите partner_id или dialog_id"})

            u1, u2 = (min(me_id, int(partner_id)), max(me_id, int(partner_id)))
            cur.execute(
                f"""
                INSERT INTO {schema}.dialogs (user1_id, user2_id, last_message_at)
                VALUES (%s, %s, NOW())
                ON CONFLICT (user1_id, user2_id) DO UPDATE SET last_message_at = NOW()
                RETURNING id
                """,
                (u1, u2),
            )
            dialog_id = cur.fetchone()[0]
        else:
            # Проверяем доступ
            cur.execute(
                f"SELECT id FROM {schema}.dialogs WHERE id = %s AND (user1_id = %s OR user2_id = %s)",
                (dialog_id, me_id, me_id),
            )
            if not cur.fetchone():
                cur.close()
                conn.close()
                return resp(403, {"error": "Нет доступа"})
            cur.execute(
                f"UPDATE {schema}.dialogs SET last_message_at = NOW() WHERE id = %s",
                (dialog_id,),
            )

        cur.execute(
            f"""
            INSERT INTO {schema}.messages (dialog_id, sender_id, text)
            VALUES (%s, %s, %s)
            RETURNING id, created_at
            """,
            (dialog_id, me_id, text),
        )
        msg_id, created_at = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return resp(200, {
            "ok": True,
            "message": {
                "id": msg_id,
                "dialog_id": dialog_id,
                "from": "me",
                "text": text,
                "time": str(created_at),
            },
        })

    # ── GET ?action=search&q=... — поиск пользователей ───────────────────────
    if method == "GET" and action == "search":
        q = (params.get("q") or "").strip()
        if len(q) < 2:
            cur.close()
            conn.close()
            return resp(400, {"error": "Минимум 2 символа"})

        cur.execute(
            f"""
            SELECT id, name, username, phone
            FROM {schema}.users
            WHERE id != %s AND (
                name ILIKE %s OR username ILIKE %s OR phone LIKE %s
            )
            LIMIT 20
            """,
            (me_id, f"%{q}%", f"%{q}%", f"%{q}%"),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        users = [{"id": r[0], "name": r[1], "username": r[2], "phone": r[3]} for r in rows]
        return resp(200, {"ok": True, "users": users})

    cur.close()
    conn.close()
    return resp(404, {"error": "Неизвестный action"})
