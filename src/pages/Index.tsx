import { useState } from "react";
import Icon from "@/components/ui/icon";

type IconName = Parameters<typeof Icon>[0]["name"];
type Section = "home" | "chats" | "groups" | "channels" | "search" | "notifications" | "profile" | "settings";

const bottomNav = [
  { id: "home" as Section, icon: "Home", label: "Главная" },
  { id: "chats" as Section, icon: "MessageCircle", label: "Чаты" },
  { id: "groups" as Section, icon: "Users", label: "Группы" },
  { id: "search" as Section, icon: "Search", label: "Поиск" },
  { id: "profile" as Section, icon: "User", label: "Профиль" },
];

const chats = [
  { id: 1, name: "Алексей Смирнов", msg: "Завтра встреча в 10:00 🔥", time: "12:34", unread: 3, online: true, avatar: "А" },
  { id: 2, name: "Дизайн-команда", msg: "Макеты готовы, проверяй!", time: "11:20", unread: 12, online: false, avatar: "Д", group: true },
  { id: 3, name: "Мария Волкова", msg: "Голосовое 0:45", time: "10:05", unread: 0, online: true, avatar: "М", voice: true },
  { id: 4, name: "Tech News", msg: "🚀 Apple выпустила новую модель...", time: "09:30", unread: 1, online: false, avatar: "T", channel: true },
  { id: 5, name: "Иван Петров", msg: "Окей, договорились!", time: "Вчера", unread: 0, online: false, avatar: "И" },
  { id: 6, name: "Стартап-клуб", msg: "Сергей: Кто едет на конференцию?", time: "Вчера", unread: 5, online: false, avatar: "С", group: true },
];

const messages = [
  { id: 1, from: "them", text: "Привет! Как дела? Готов к звонку?", time: "12:20" },
  { id: 2, from: "me", text: "Да, всё готово! Через 5 минут буду онлайн 👍", time: "12:22" },
  { id: 3, from: "them", text: "Отлично! Кстати, посмотри макеты — я только что отправил", time: "12:23" },
  { id: 4, from: "me", text: "Уже смотрю, выглядит круто!", time: "12:25" },
  { id: 5, from: "them", text: "🎉 Спасибо! Над ним дольше всего работал", time: "12:26" },
  { id: 6, from: "me", text: "Созваниваемся в 12:30?", time: "12:28" },
  { id: 7, from: "them", text: "Да, принято!", time: "12:29" },
];

const channels = [
  { id: 1, name: "Tech Insider", desc: "Новости технологий", members: "128K", avatar: "🚀", color: "from-blue-500 to-cyan-400" },
  { id: 2, name: "Design Weekly", desc: "Лучшее в мире дизайна", members: "54K", avatar: "🎨", color: "from-purple-500 to-pink-400" },
  { id: 3, name: "Crypto Alert", desc: "Сигналы и аналитика", members: "89K", avatar: "₿", color: "from-orange-500 to-yellow-400" },
  { id: 4, name: "Startup Russia", desc: "Для предпринимателей", members: "32K", avatar: "💡", color: "from-green-500 to-emerald-400" },
];

const groups = [
  { id: 1, name: "Дизайн-команда", members: 12, online: 5, avatar: "Д", color: "from-purple-600 to-pink-500", lastActive: "сейчас" },
  { id: 2, name: "Разработка", members: 8, online: 3, avatar: "Р", color: "from-blue-600 to-cyan-500", lastActive: "5 мин" },
  { id: 3, name: "Маркетинг", members: 15, online: 2, avatar: "М", color: "from-orange-500 to-red-500", lastActive: "1 час" },
  { id: 4, name: "Стартап-клуб", members: 124, online: 18, avatar: "С", color: "from-green-500 to-teal-500", lastActive: "сейчас" },
];

const notifications = [
  { id: 1, user: "Алексей", text: "отправил сообщение", time: "2 мин", icon: "MessageCircle", color: "text-purple-400", bg: "bg-purple-500/15" },
  { id: 2, user: "Мария Волкова", text: "пропущенный звонок", time: "15 мин", icon: "PhoneMissed", color: "text-red-400", bg: "bg-red-500/15" },
  { id: 3, user: "Дизайн-команда", text: "новое в группе", time: "1 час", icon: "Users", color: "text-cyan-400", bg: "bg-cyan-500/15" },
  { id: 4, user: "Tech Insider", text: "новый пост", time: "2 часа", icon: "Radio", color: "text-pink-400", bg: "bg-pink-500/15" },
  { id: 5, user: "Иван", text: "упомянул тебя", time: "3 часа", icon: "AtSign", color: "text-green-400", bg: "bg-green-500/15" },
];

interface IndexProps {
  user: { name: string; phone: string; username?: string };
  onLogout: () => void;
}

export default function Index({ user, onLogout }: IndexProps) {
  const [active, setActive] = useState<Section>("home");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const selectedChat = chats.find((c) => c.id === activeChat);

  const navigate = (section: Section) => {
    setActive(section);
    setActiveChat(null);
    setShowMoreMenu(false);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#0a0a12] max-w-md mx-auto relative">

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
      </div>

      {/* CALL OVERLAY */}
      {isCallActive && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a12]/98 backdrop-blur-xl animate-fade-in">
          <div className="relative mb-10">
            <div className="w-32 h-32 rounded-full gradient-bg flex items-center justify-center text-white font-display font-black text-5xl z-10 relative">
              {selectedChat?.avatar}
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/40 animate-ping" />
          </div>
          <h2 className="text-white font-display font-bold text-3xl mb-2">{selectedChat?.name}</h2>
          <p className="text-white/40 mb-16 text-sm">Звоним...</p>
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-full flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${isMuted ? "bg-red-500/20 text-red-400" : "glass text-white/70"}`}
            >
              <Icon name={isMuted ? "MicOff" : "Mic"} size={24} />
            </button>
            <button
              onClick={() => setIsCallActive(false)}
              className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-red-500/40"
            >
              <Icon name="PhoneOff" size={28} className="text-white" />
            </button>
            <button className="w-16 h-16 rounded-full glass text-white/70 flex items-center justify-center transition-all active:scale-95">
              <Icon name="Volume2" size={24} />
            </button>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden flex flex-col">

        {/* ── HOME ── */}
        {active === "home" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {/* Header */}
            <div className="px-5 pt-14 pb-4 flex items-center justify-between">
              <div>
                <p className="text-white/40 text-xs mb-0.5">Добро пожаловать 👋</p>
                <h1 className="text-2xl font-display font-black text-white">
                  Привет, <span className="gradient-text">{user.name.split(" ")[0]}!</span>
                </h1>
              </div>
              <button onClick={() => navigate("notifications")} className="relative w-10 h-10 glass rounded-2xl flex items-center justify-center">
                <Icon name="Bell" size={18} className="text-white/70" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">3</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-3 px-5 mb-6">
              {[
                { label: "Сообщ.", value: "1.2K", icon: "MessageCircle", color: "from-purple-600 to-pink-500" },
                { label: "Контакты", value: "89", icon: "Users", color: "from-cyan-500 to-blue-500" },
                { label: "Группы", value: "12", icon: "Hash", color: "from-orange-500 to-pink-500" },
              ].map((stat, i) => (
                <div key={i} className="flex-1 glass rounded-2xl p-3 animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                    <Icon name={stat.icon as IconName} size={14} className="text-white" />
                  </div>
                  <div className="text-lg font-display font-black text-white">{stat.value}</div>
                  <div className="text-white/40 text-[10px]">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Online now */}
            <div className="mb-5">
              <div className="px-5 flex items-center justify-between mb-3">
                <h2 className="text-white font-display font-bold text-base">Онлайн сейчас</h2>
                <span className="text-white/30 text-xs">2 человека</span>
              </div>
              <div className="flex gap-4 px-5 overflow-x-auto scrollbar-hidden pb-1">
                {chats.filter(c => c.online).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => { setActive("chats"); setActiveChat(chat.id); }}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl">
                        {chat.avatar}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0a0a12]" />
                    </div>
                    <span className="text-white/60 text-xs">{chat.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent chats */}
            <div className="px-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-display font-bold text-base">Недавние</h2>
                <button onClick={() => navigate("chats")} className="text-purple-400 text-xs">Все чаты</button>
              </div>
              <div className="space-y-1.5">
                {chats.slice(0, 4).map((chat, i) => (
                  <button
                    key={chat.id}
                    onClick={() => { setActive("chats"); setActiveChat(chat.id); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 active:bg-white/8 transition-all animate-fade-in text-left"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                        {chat.avatar}
                      </div>
                      {chat.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a0a12]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-white font-medium text-sm truncate">{chat.name}</span>
                        <span className="text-white/30 text-xs ml-2 flex-shrink-0">{chat.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {chat.voice && <Icon name="Mic" size={11} className="text-purple-400" />}
                        <p className="text-white/40 text-xs truncate">{chat.msg}</p>
                      </div>
                    </div>
                    {chat.unread > 0 && (
                      <span className="min-w-[20px] h-5 px-1 gradient-bg rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CHATS LIST ── */}
        {active === "chats" && !activeChat && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 pt-14 pb-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-display font-bold text-2xl">Чаты</h2>
                <button className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center active:scale-95 transition-transform">
                  <Icon name="Plus" size={18} className="text-white" />
                </button>
              </div>
              <div className="relative">
                <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  placeholder="Поиск..."
                  className="w-full bg-white/5 border border-white/8 rounded-2xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hidden px-3">
              {chats.map((chat, i) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl active:bg-white/8 transition-all mb-1 animate-fade-in text-left"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-13 h-13 w-[52px] h-[52px] rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">
                      {chat.avatar}
                    </div>
                    {chat.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a0a12]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm truncate">{chat.name}</span>
                      <span className="text-white/30 text-xs flex-shrink-0 ml-2">{chat.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {chat.voice && <Icon name="Mic" size={11} className="text-purple-400 flex-shrink-0" />}
                      <p className="text-white/40 text-xs truncate">{chat.msg}</p>
                    </div>
                  </div>
                  {chat.unread > 0 && (
                    <span className="min-w-[20px] h-5 px-1 gradient-bg rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CHAT WINDOW ── */}
        {active === "chats" && activeChat && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-white/5 glass">
              <button onClick={() => setActiveChat(null)} className="w-9 h-9 flex items-center justify-center text-white/50 active:scale-90 transition-transform">
                <Icon name="ArrowLeft" size={22} />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                  {selectedChat?.avatar}
                </div>
                {selectedChat?.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a12]" />}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{selectedChat?.name}</div>
                <div className="text-green-400 text-xs">{selectedChat?.online ? "онлайн" : "был(а) недавно"}</div>
              </div>
              <button
                onClick={() => setIsCallActive(true)}
                className="w-10 h-10 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Icon name="Phone" size={18} />
              </button>
              <button
                onClick={() => setIsCallActive(true)}
                className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Icon name="Video" size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={msg.id} className={`flex animate-fade-in ${msg.from === "me" ? "justify-end" : "justify-start"}`} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className={`max-w-[78%] px-4 py-2.5 ${msg.from === "me" ? "message-bubble-out" : "message-bubble-in"}`}>
                    <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[11px] mt-1 ${msg.from === "me" ? "text-white/60 text-right" : "text-white/30"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              {/* Voice message */}
              <div className="flex justify-start animate-fade-in">
                <div className="message-bubble-in px-4 py-3 flex items-center gap-3" style={{ maxWidth: "72%" }}>
                  <button className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
                    <Icon name="Play" size={14} className="text-white" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-end gap-[2px] mb-1 h-5">
                      {Array.from({ length: 20 }).map((_, j) => (
                        <div key={j} className="w-[2px] rounded-full bg-purple-400/60" style={{ height: `${Math.sin(j * 0.8) * 8 + 10}px` }} />
                      ))}
                    </div>
                    <span className="text-white/30 text-[11px]">0:32</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="px-3 pb-6 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 glass rounded-2xl px-3 py-2">
                <button className="w-9 h-9 flex items-center justify-center text-white/30 active:text-purple-400 transition-colors">
                  <Icon name="Smile" size={22} />
                </button>
                <input
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Сообщение..."
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 focus:outline-none"
                />
                <button className="w-9 h-9 flex items-center justify-center text-white/30 active:text-purple-400 transition-colors">
                  <Icon name="Paperclip" size={20} />
                </button>
                {msgInput ? (
                  <button className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center active:scale-90 transition-transform">
                    <Icon name="Send" size={17} className="text-white" />
                  </button>
                ) : (
                  <button className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 active:scale-90 transition-transform">
                    <Icon name="Mic" size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── GROUPS ── */}
        {active === "groups" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            <div className="px-5 pt-14 pb-4 flex items-center justify-between">
              <h2 className="text-white font-display font-bold text-2xl">Группы</h2>
              <button className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center active:scale-95 transition-transform">
                <Icon name="Plus" size={18} className="text-white" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 mb-5">
              {groups.map((group, i) => (
                <div
                  key={group.id}
                  className="glass rounded-3xl p-4 active:scale-95 transition-all animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center text-white font-display font-black text-xl mb-3`}>
                    {group.avatar}
                  </div>
                  <h3 className="text-white font-display font-bold text-sm mb-0.5 truncate">{group.name}</h3>
                  <p className="text-white/40 text-[11px] mb-2">{group.members} участников</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-[11px]">{group.online} онлайн</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Channels teaser */}
            <div className="px-5 mb-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-display font-bold text-base">Каналы</h2>
                <button onClick={() => navigate("channels")} className="text-purple-400 text-xs">Все</button>
              </div>
              <div className="space-y-2">
                {channels.slice(0, 2).map((ch, i) => (
                  <div key={ch.id} className="glass rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] transition-all animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-xl flex-shrink-0`}>{ch.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">{ch.name}</div>
                      <div className="text-white/40 text-xs">{ch.members} подписчиков</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl gradient-bg text-white text-xs font-medium flex-shrink-0">
                      Читать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CHANNELS (full) ── */}
        {active === "channels" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            <div className="px-5 pt-14 pb-4">
              <h2 className="text-white font-display font-bold text-2xl mb-1">Каналы</h2>
              <p className="text-white/40 text-sm">Подпишись на интересное</p>
            </div>
            <div className="px-5 space-y-3">
              {channels.map((ch, i) => (
                <div
                  key={ch.id}
                  className="glass rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {ch.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-0.5">{ch.name}</h3>
                    <p className="text-white/40 text-xs mb-1.5">{ch.desc}</p>
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Icon name="Users" size={11} />
                      <span>{ch.members} подписчиков</span>
                    </div>
                  </div>
                  <button className="px-3 py-2 rounded-xl gradient-bg text-white text-xs font-medium flex-shrink-0">
                    Читать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SEARCH ── */}
        {active === "search" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            <div className="px-5 pt-14 pb-4">
              <h2 className="text-white font-display font-bold text-2xl mb-4">Поиск</h2>
              <div className="relative">
                <Icon name="Search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Люди, группы, каналы..."
                  className="w-full bg-white/5 border border-white/8 rounded-2xl pl-11 pr-10 py-3.5 text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 active:text-white transition-colors">
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
            </div>

            {!searchQuery ? (
              <div className="px-5">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Недавние</p>
                {["Алексей Смирнов", "Tech Insider", "Дизайн-команда"].map((name, i) => (
                  <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl active:bg-white/5 transition-colors animate-fade-in text-left mb-1" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Icon name="Clock" size={14} className="text-white/30" />
                    </div>
                    <span className="text-white/60 text-sm">{name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-5 animate-fade-in">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Результаты</p>
                {chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                  chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                    <button key={c.id} onClick={() => { setActive("chats"); setActiveChat(c.id); }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl active:bg-white/5 transition-colors text-left mb-1">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold">{c.avatar}</div>
                      <div>
                        <div className="text-white text-sm font-medium">{c.name}</div>
                        <div className="text-white/40 text-xs">{c.online ? "онлайн" : "был недавно"}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="text-white/30 text-sm">Ничего не найдено</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {active === "notifications" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            <div className="px-5 pt-14 pb-4 flex items-center justify-between">
              <h2 className="text-white font-display font-bold text-2xl">Уведомления</h2>
              <button className="text-purple-400 text-sm">Все прочитаны</button>
            </div>
            <div className="px-5 space-y-2.5">
              {notifications.map((n, i) => (
                <div
                  key={n.id}
                  className="glass rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-all animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`w-11 h-11 rounded-2xl ${n.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={n.icon as IconName} size={20} className={n.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm leading-snug">
                      <span className="font-semibold">{n.user}</span>{" "}
                      <span className="text-white/60">{n.text}</span>
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">{n.time} назад</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {active === "profile" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {/* Cover */}
            <div className="relative h-44 gradient-bg overflow-hidden">
              <div className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.6) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(236,72,153,0.6) 0%, transparent 60%)" }} />
              <div className="absolute top-12 right-4 flex gap-2">
                <button onClick={() => navigate("settings")} className="glass px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-1.5">
                  <Icon name="Settings" size={12} />
                  Настройки
                </button>
              </div>
              <div className="absolute -bottom-8 left-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-display font-black text-3xl border-4 border-[#0a0a12]">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              </div>
            </div>

            <div className="px-5 pt-12 pb-6">
              <h2 className="text-white font-display font-black text-2xl mb-0.5">{user.name}</h2>
              {user.username && <p className="text-white/40 text-sm mb-1">@{user.username}</p>}
              <p className="text-white/40 text-sm mb-1">{user.phone}</p>
              <p className="text-white/60 text-sm mb-5">Привет! Я пользуюсь Pulse 🚀</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[{ label: "Друзья", value: "0" }, { label: "Группы", value: "0" }, { label: "Каналы", value: "0" }].map((s, i) => (
                  <div key={i} className="glass rounded-2xl p-3 text-center">
                    <div className="text-white font-display font-black text-xl gradient-text">{s.value}</div>
                    <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3.5 glass rounded-2xl">
                  <Icon name="Phone" size={16} className="text-purple-400 flex-shrink-0" />
                  <span className="text-white/70 text-sm">{user.phone}</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full mt-4 glass rounded-2xl p-4 flex items-center gap-3 border border-red-500/20 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-red-500/15 flex items-center justify-center">
                  <Icon name="LogOut" size={18} className="text-red-400" />
                </div>
                <span className="text-red-400 font-medium text-sm">Выйти из аккаунта</span>
              </button>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {active === "settings" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            <div className="px-5 pt-14 pb-4 flex items-center gap-3">
              <button onClick={() => navigate("profile")} className="w-9 h-9 flex items-center justify-center text-white/50">
                <Icon name="ArrowLeft" size={22} />
              </button>
              <h2 className="text-white font-display font-bold text-2xl">Настройки</h2>
            </div>
            <div className="px-5 space-y-2">
              {[
                { icon: "User", label: "Аккаунт", desc: "Личные данные", color: "text-purple-400", bg: "bg-purple-500/15" },
                { icon: "Bell", label: "Уведомления", desc: "Звуки и баннеры", color: "text-pink-400", bg: "bg-pink-500/15" },
                { icon: "Palette", label: "Оформление", desc: "Темы и цвета", color: "text-cyan-400", bg: "bg-cyan-500/15" },
                { icon: "Lock", label: "Конфиденциальность", desc: "Кто видит профиль", color: "text-green-400", bg: "bg-green-500/15" },
                { icon: "Database", label: "Хранилище", desc: "Медиа и кэш", color: "text-orange-400", bg: "bg-orange-500/15" },
                { icon: "HelpCircle", label: "Помощь", desc: "FAQ и поддержка", color: "text-blue-400", bg: "bg-blue-500/15" },
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full glass rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all animate-fade-in text-left"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={item.icon as IconName} size={20} className={item.color} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{item.label}</div>
                    <div className="text-white/30 text-xs">{item.desc}</div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-white/20" />
                </button>
              ))}
            </div>
            <div className="h-6" />
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      {!(active === "chats" && activeChat) && (
        <div className="flex-shrink-0 glass border-t border-white/5 px-2 pb-6 pt-2 relative z-20">
          <div className="flex items-center justify-around">
            {bottomNav.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all active:scale-90 ${
                  active === item.id ? "text-white" : "text-white/35"
                }`}
              >
                <div className={`relative w-10 h-10 flex items-center justify-center rounded-2xl transition-all ${active === item.id ? "gradient-bg neon-glow-purple" : ""}`}>
                  <Icon name={item.icon as IconName} size={20} />
                  {item.id === "chats" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">5</span>
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-all ${active === item.id ? "gradient-text" : ""}`}>{item.label}</span>
              </button>
            ))}

            {/* More button */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all active:scale-90 ${showMoreMenu ? "text-white" : "text-white/35"}`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all ${showMoreMenu ? "gradient-bg neon-glow-purple" : ""}`}>
                  <Icon name="MoreHorizontal" size={20} />
                </div>
                <span className="text-[10px] font-medium">Ещё</span>
              </button>

              {showMoreMenu && (
                <div className="absolute bottom-16 right-0 glass rounded-2xl p-2 w-44 animate-scale-in z-50 border border-white/10">
                  {[
                    { id: "channels" as Section, icon: "Radio", label: "Каналы" },
                    { id: "notifications" as Section, icon: "Bell", label: "Уведомления", badge: 3 },
                    { id: "settings" as Section, icon: "Settings", label: "Настройки" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-left"
                    >
                      <Icon name={item.icon as IconName} size={18} className="text-white/60" />
                      <span className="text-white text-sm">{item.label}</span>
                      {"badge" in item && item.badge && (
                        <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">{item.badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}