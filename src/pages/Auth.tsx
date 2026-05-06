import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/d8116b33-01fd-4dbd-8c71-ce91075767e5";

type Step = "phone" | "otp" | "profile";

interface AuthProps {
  onAuth: (token: string, user: { name: string; phone: string; username?: string }) => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState("");
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "phone") phoneRef.current?.focus();
    if (step === "otp") otpRefs[0].current?.focus();
  }, [step]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "";
    let result = "+7";
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length >= 5) result += ") " + digits.slice(4, 7);
    if (digits.length >= 8) result += "-" + digits.slice(7, 9);
    if (digits.length >= 10) result += "-" + digits.slice(9, 11);
    return result;
  };

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    const capped = (digits.startsWith("7") ? digits : "7" + digits).slice(0, 11);
    setPhone(formatPhone(capped));
  };

  const getRawPhone = () => "+" + phone.replace(/\D/g, "");

  const sendOtp = async () => {
    setError("");
    const raw = getRawPhone();
    if (raw.length < 12) { setError("Введите корректный номер"); return; }
    setLoading(true);
    const res = await fetch(`${AUTH_URL}?action=send_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: raw }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) { setError(data.error || "Ошибка"); return; }
    setDevOtp(data.otp || "");
    setStep("otp");
    setCountdown(60);
  };

  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 3) otpRefs[idx + 1].current?.focus();
    if (next.every(d => d !== "")) verifyOtp(next.join(""));
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const verifyOtp = async (code: string) => {
    setError("");
    setLoading(true);
    const res = await fetch(`${AUTH_URL}?action=verify_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: getRawPhone(), otp: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) {
      setError(data.error || "Неверный код");
      setOtp(["", "", "", ""]);
      otpRefs[0].current?.focus();
      return;
    }
    localStorage.setItem("pulse_token", data.token);
    localStorage.setItem("pulse_user", JSON.stringify(data.user));
    if (data.is_new) {
      setStep("profile");
    } else {
      onAuth(data.token, data.user);
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) { setError("Введите имя"); return; }
    setError("");
    setLoading(true);
    const token = localStorage.getItem("pulse_token") || "";
    const res = await fetch(`${AUTH_URL}?action=update_profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify({ name: name.trim(), username: username.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) { setError(data.error || "Ошибка"); return; }
    localStorage.setItem("pulse_user", JSON.stringify(data.user));
    onAuth(token, data.user);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#0a0a12] overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-16 pb-8 animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 rounded-3xl gradient-bg neon-glow-purple flex items-center justify-center mb-4 animate-float">
            <span className="text-white font-display font-black text-3xl">P</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white">Pulse</h1>
          <p className="text-white/40 text-sm mt-1">Мессенджер нового поколения</p>
        </div>

        {/* PHONE STEP */}
        {step === "phone" && (
          <div className="animate-fade-in">
            <h2 className="text-white font-display font-bold text-2xl mb-2">Войти</h2>
            <p className="text-white/40 text-sm mb-8">Введи номер телефона — пришлём код подтверждения</p>

            <div className="mb-4">
              <div className={`flex items-center gap-3 glass rounded-2xl px-4 py-4 border transition-colors ${error ? "border-red-500/50" : "border-white/8 focus-within:border-purple-500/50"}`}>
                <span className="text-2xl">🇷🇺</span>
                <input
                  ref={phoneRef}
                  type="tel"
                  value={phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendOtp()}
                  placeholder="+7 (999) 000-00-00"
                  className="flex-1 bg-transparent text-white text-lg placeholder:text-white/20 focus:outline-none font-medium tracking-wide"
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-2 px-1">{error}</p>}
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full gradient-bg rounded-2xl py-4 text-white font-display font-bold text-base neon-glow-purple active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Получить код
                  <Icon name="ArrowRight" size={20} className="text-white" />
                </>
              )}
            </button>

            <p className="text-white/20 text-xs text-center mt-6 leading-relaxed">
              Нажимая кнопку, ты соглашаешься с условиями использования сервиса
            </p>
          </div>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div className="animate-fade-in">
            <button onClick={() => { setStep("phone"); setOtp(["", "", "", ""]); setError(""); }} className="flex items-center gap-1 text-white/40 text-sm mb-8 active:text-white transition-colors">
              <Icon name="ArrowLeft" size={16} />
              Назад
            </button>

            <h2 className="text-white font-display font-bold text-2xl mb-2">Введи код</h2>
            <p className="text-white/40 text-sm mb-8">
              Отправили 4-значный код на<br />
              <span className="text-white font-medium">{phone}</span>
            </p>

            {/* Dev hint */}
            {devOtp && (
              <div className="glass border border-purple-500/30 rounded-xl px-4 py-2.5 mb-6 flex items-center gap-2">
                <Icon name="Info" size={14} className="text-purple-400 flex-shrink-0" />
                <span className="text-purple-300 text-sm">Демо-код: <strong>{devOtp}</strong></span>
              </div>
            )}

            <div className="flex gap-4 justify-center mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  className={`w-16 h-16 rounded-2xl text-center text-2xl font-display font-black text-white bg-white/5 border transition-all focus:outline-none ${
                    digit ? "border-purple-500 bg-purple-500/15" : "border-white/10 focus:border-purple-500/60"
                  } ${error ? "border-red-500/60" : ""}`}
                />
              ))}
            </div>

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            {loading && (
              <div className="flex justify-center mb-4">
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            )}

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-white/30 text-sm">Отправить повторно через {countdown} сек</p>
              ) : (
                <button onClick={sendOtp} className="text-purple-400 text-sm active:text-purple-300 transition-colors">
                  Отправить код повторно
                </button>
              )}
            </div>
          </div>
        )}

        {/* PROFILE STEP */}
        {step === "profile" && (
          <div className="animate-fade-in">
            <h2 className="text-white font-display font-bold text-2xl mb-2">Твой профиль</h2>
            <p className="text-white/40 text-sm mb-8">Расскажи как тебя зовут — это увидят другие пользователи</p>

            {/* Avatar placeholder */}
            <div className="flex flex-col items-center mb-8">
              <button className="relative w-24 h-24 rounded-3xl gradient-bg flex items-center justify-center group active:scale-95 transition-transform">
                {name ? (
                  <span className="text-white font-display font-black text-4xl">{name[0].toUpperCase()}</span>
                ) : (
                  <Icon name="Camera" size={32} className="text-white/70" />
                )}
                <div className="absolute inset-0 rounded-3xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Icon name="Camera" size={20} className="text-white" />
                </div>
              </button>
              <p className="text-white/30 text-xs mt-2">Нажми чтобы добавить фото</p>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-white/50 text-xs mb-1.5 block px-1">Имя *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Например: Алексей"
                  className={`w-full glass rounded-2xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none border transition-colors text-base ${
                    error && !name ? "border-red-500/50" : "border-white/8 focus:border-purple-500/50"
                  }`}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1.5 block px-1">Юзернейм (необязательно)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-base">@</span>
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase())}
                    placeholder="username"
                    className="w-full glass rounded-2xl pl-9 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none border border-white/8 focus:border-purple-500/50 transition-colors text-base"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4 px-1">{error}</p>}

            <button
              onClick={saveProfile}
              disabled={loading}
              className="w-full gradient-bg rounded-2xl py-4 text-white font-display font-bold text-base neon-glow-purple active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Начать общаться
                  <Icon name="Zap" size={20} className="text-white" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
