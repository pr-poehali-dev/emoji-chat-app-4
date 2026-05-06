import { useState } from "react";
import Icon from "@/components/ui/icon";

type IconName = Parameters<typeof Icon>[0]["name"];
type Section = "home" | "chats" | "groups" | "channels" | "search" | "notifications" | "profile" | "settings";

const navItems = [
  { id: "home" as Section, icon: "Home", label: "Главная" },
  { id: "chats" as Section, icon: "MessageCircle", label: "Чаты" },
  { id: "groups" as Section, icon: "Users", label: "Группы" },
  { id: "channels" as Section, icon: "Radio", label: "Каналы" },
  { id: "search" as Section, icon: "Search", label: "Поиск" },
  { id: "notifications" as Section, icon: "Bell", label: "Уведомления" },
  { id: "profile" as Section, icon: "User", label: "Профиль" },
  { id: "settings" as Section, icon: "Settings", label: "Настройки" },
];

const chats = [
  { id: 1, name: "Алексей Смирнов", msg: "Завтра встреча в 10:00 🔥", time: "12:34", unread: 3, online: true, avatar: "А" },
  { id: 2, name: "Дизайн-команда", msg: "Макеты готовы, проверяй!", time: "11:20", unread: 12, online: false, avatar: "Д", group: true },
  { id: 3, name: "Мария Волкова", msg: "Голосовое сообщение 0:45", time: "10:05", unread: 0, online: true, avatar: "М", voice: true },
  { id: 4, name: "Tech News", msg: "🚀 Apple выпустила новую модель...", time: "09:30", unread: 1, online: false, avatar: "T", channel: true },
  { id: 5, name: "Иван Петров", msg: "Окей, договорились!", time: "Вчера", unread: 0, online: false, avatar: "И" },
  { id: 6, name: "Стартап-клуб", msg: "Сергей: Кто едет на конференцию?", time: "Вчера", unread: 5, online: false, avatar: "С", group: true },
];

const messages = [
  { id: 1, from: "them", text: "Привет! Как дела? Готов к звонку?", time: "12:20" },
  { id: 2, from: "me", text: "Да, всё готово! Через 5 минут буду онлайн 👍", time: "12:22" },
  { id: 3, from: "them", text: "Отлично! Кстати, посмотри макеты — я только что отправил", time: "12:23" },
  { id: 4, from: "me", text: "Уже смотрю, выглядит круто! Особенно главный экран", time: "12:25" },
  { id: 5, from: "them", text: "🎉 Спасибо! Над ним дольше всего работал", time: "12:26" },
  { id: 6, from: "me", text: "Созваниваемся в 12:30?", time: "12:28" },
  { id: 7, from: "them", text: "Да, принято!", time: "12:29" },
];

const channels = [
  { id: 1, name: "Tech Insider", desc: "Новости технологий каждый день", members: "128K", avatar: "🚀", color: "from-blue-500 to-cyan-400" },
  { id: 2, name: "Design Weekly", desc: "Лучшее в мире дизайна", members: "54K", avatar: "🎨", color: "from-purple-500 to-pink-400" },
  { id: 3, name: "Crypto Alert", desc: "Сигналы и аналитика рынка", members: "89K", avatar: "₿", color: "from-orange-500 to-yellow-400" },
  { id: 4, name: "Startup Russia", desc: "Сообщество предпринимателей", members: "32K", avatar: "💡", color: "from-green-500 to-emerald-400" },
];

const groups = [
  { id: 1, name: "Дизайн-команда", members: 12, online: 5, avatar: "Д", color: "from-purple-600 to-pink-500", lastActive: "сейчас" },
  { id: 2, name: "Разработка", members: 8, online: 3, avatar: "Р", color: "from-blue-600 to-cyan-500", lastActive: "5 мин" },
  { id: 3, name: "Маркетинг", members: 15, online: 2, avatar: "М", color: "from-orange-500 to-red-500", lastActive: "1 час" },
  { id: 4, name: "Стартап-клуб", members: 124, online: 18, avatar: "С", color: "from-green-500 to-teal-500", lastActive: "сейчас" },
];

const notifications = [
  { id: 1, user: "Алексей", text: "отправил тебе сообщение", time: "2 мин назад", icon: "MessageCircle", color: "text-purple-400" },
  { id: 2, user: "Мария Волкова", text: "пропущенный звонок", time: "15 мин назад", icon: "PhoneMissed", color: "text-red-400" },
  { id: 3, user: "Дизайн-команда", text: "новое сообщение в группе", time: "1 час назад", icon: "Users", color: "text-cyan-400" },
  { id: 4, user: "Tech Insider", text: "опубликовал новый пост", time: "2 часа назад", icon: "Radio", color: "text-pink-400" },
  { id: 5, user: "Иван", text: "упомянул тебя в группе", time: "3 часа назад", icon: "AtSign", color: "text-green-400" },
];

export default function Index() {
  const [active, setActive] = useState<Section>("home");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedChat = chats.find((c) => c.id === activeChat);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a12]">
      {/* Sidebar */}
      <aside className="w-20 flex flex-col items-center py-6 gap-2 glass border-r border-white/5 relative z-10">
        {/* Logo */}
        <div className="mb-4 relative">
          <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center neon-glow-purple animate-float">
            <span className="text-white font-display font-black text-sm">P</span>
          </div>
        </div>

        {/* Nav */}
        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => { setActive(item.id); setActiveChat(null); }}
            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group hover:scale-110 ${
              active === item.id
                ? "gradient-bg neon-glow-purple"
                : "hover:bg-white/8 text-white/40 hover:text-white/80"
            }`}
            title={item.label}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <Icon name={item.icon as IconName} size={20} className={active === item.id ? "text-white" : ""} />
            {item.id === "notifications" && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">3</span>
            )}
            {item.id === "chats" && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">5</span>
            )}
            <div className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              {item.label}
            </div>
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">

        {/* HOME */}
        {active === "home" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden p-6">
            <div className="mb-8 animate-fade-in">
              <p className="text-white/40 text-sm font-sans mb-1">Добро пожаловать обратно 👋</p>
              <h1 className="text-3xl font-display font-black text-white">
                Привет, <span className="gradient-text">Алексей!</span>
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Сообщений", value: "1,247", icon: "MessageCircle", color: "from-purple-600 to-pink-500" },
                { label: "Контактов", value: "89", icon: "Users", color: "from-cyan-600 to-blue-500" },
                { label: "Групп", value: "12", icon: "Hash", color: "from-orange-500 to-pink-500" },
              ].map((stat, i) => (
                <div key={i} className={`glass rounded-2xl p-4 animate-fade-in`} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon name={stat.icon as IconName} size={18} className="text-white" />
                  </div>
                  <div className="text-2xl font-display font-black text-white">{stat.value}</div>
                  <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-6 animate-fade-in">
              <h2 className="text-white font-display font-bold text-lg mb-4">Последние чаты</h2>
              <div className="space-y-2">
                {chats.slice(0, 4).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => { setActive("chats"); setActiveChat(chat.id); }}
                    className="w-full glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/8 transition-all duration-200 hover:scale-[1.01] text-left"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                        {chat.avatar}
                      </div>
                      {chat.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a12]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-white font-medium text-sm truncate">{chat.name}</span>
                        <span className="text-white/30 text-xs ml-2 flex-shrink-0">{chat.time}</span>
                      </div>
                      <p className="text-white/40 text-xs truncate">{chat.msg}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="min-w-5 h-5 px-1 gradient-bg rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fade-in">
              <h2 className="text-white font-display font-bold text-lg mb-4">Онлайн сейчас</h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-hidden pb-2">
                {chats.filter(c => c.online).map((chat) => (
                  <button key={chat.id} className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">
                        {chat.avatar}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0a0a12]" />
                    </div>
                    <span className="text-white/60 text-xs">{chat.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHATS */}
        {active === "chats" && !activeChat && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-white/5">
              <h2 className="text-white font-display font-bold text-xl mb-3">Чаты</h2>
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  placeholder="Поиск по чатам..."
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hidden p-2">
              {chats.map((chat, i) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all duration-200 mb-1 animate-fade-in text-left"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
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
                      {chat.voice && <Icon name="Mic" size={12} className="text-purple-400 flex-shrink-0" />}
                      <p className="text-white/40 text-xs truncate">{chat.msg}</p>
                    </div>
                  </div>
                  {chat.unread > 0 && (
                    <span className="min-w-5 h-5 px-1.5 gradient-bg rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHAT WINDOW */}
        {active === "chats" && activeChat && (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 glass">
              <button onClick={() => setActiveChat(null)} className="text-white/40 hover:text-white transition-colors mr-1">
                <Icon name="ArrowLeft" size={20} />
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCallActive(true)}
                  className="w-9 h-9 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 flex items-center justify-center transition-all hover:scale-105"
                >
                  <Icon name="Phone" size={16} />
                </button>
                <button
                  onClick={() => setIsCallActive(true)}
                  className="w-9 h-9 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 flex items-center justify-center transition-all hover:scale-105"
                >
                  <Icon name="Video" size={16} />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-white/5 text-white/40 hover:text-white flex items-center justify-center transition-all">
                  <Icon name="MoreVertical" size={16} />
                </button>
              </div>
            </div>

            {/* Call overlay */}
            {isCallActive && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a12]/95 backdrop-blur-xl animate-scale-in">
                <div className="relative mb-8">
                  <div className="w-28 h-28 rounded-full gradient-bg flex items-center justify-center text-white font-display font-black text-4xl z-10 relative">
                    {selectedChat?.avatar}
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/40 animate-ping" />
                </div>
                <h2 className="text-white font-display font-bold text-2xl mb-2">{selectedChat?.name}</h2>
                <p className="text-white/40 mb-10">Звоним...</p>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isMuted ? "bg-red-500/20 text-red-400" : "glass text-white/70 hover:text-white"}`}
                  >
                    <Icon name={isMuted ? "MicOff" : "Mic"} size={22} />
                  </button>
                  <button
                    onClick={() => setIsCallActive(false)}
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110"
                  >
                    <Icon name="PhoneOff" size={24} className="text-white" />
                  </button>
                  <button className="w-14 h-14 rounded-full glass text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110">
                    <Icon name="Volume2" size={22} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={msg.id} className={`flex animate-fade-in ${msg.from === "me" ? "justify-end" : "justify-start"}`} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className={`max-w-[70%] px-4 py-2.5 ${msg.from === "me" ? "message-bubble-out" : "message-bubble-in"}`}>
                    <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[11px] mt-1 ${msg.from === "me" ? "text-white/60 text-right" : "text-white/30"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              {/* Voice message demo */}
              <div className="flex justify-start animate-fade-in">
                <div className="message-bubble-in px-4 py-3 flex items-center gap-3 max-w-[60%]">
                  <button className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
                    <Icon name="Play" size={14} className="text-white" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-end gap-0.5 mb-1 h-5">
                      {Array.from({ length: 24 }).map((_, j) => (
                        <div
                          key={j}
                          className="w-0.5 rounded-full bg-purple-400/60"
                          style={{ height: `${Math.sin(j * 0.7) * 8 + 10}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-white/30 text-[11px]">0:32</span>
                  </div>
                  <Icon name="Mic" size={14} className="text-purple-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2 glass rounded-2xl px-3 py-2">
                <button className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-purple-400 transition-colors">
                  <Icon name="Smile" size={20} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-purple-400 transition-colors">
                  <Icon name="Paperclip" size={18} />
                </button>
                <input
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Сообщение..."
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 focus:outline-none"
                />
                {msgInput ? (
                  <button className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="Send" size={16} className="text-white" />
                  </button>
                ) : (
                  <button className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 hover:bg-purple-500/30 hover:scale-110 transition-all">
                    <Icon name="Mic" size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GROUPS */}
        {active === "groups" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden p-6">
            <h2 className="text-white font-display font-bold text-2xl mb-6 animate-fade-in">Группы</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {groups.map((group, i) => (
                <div
                  key={group.id}
                  className="glass rounded-3xl p-5 hover:bg-white/8 transition-all duration-200 hover:scale-[1.02] cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center text-white font-display font-black text-2xl mb-4`}>
                    {group.avatar}
                  </div>
                  <h3 className="text-white font-display font-bold text-base mb-1">{group.name}</h3>
                  <p className="text-white/40 text-xs mb-3">{group.members} участников</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-green-400 text-xs">{group.online} онлайн</span>
                    </div>
                    <span className="text-white/25 text-xs">{group.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full glass rounded-2xl py-4 flex items-center justify-center gap-2 text-purple-400 hover:bg-purple-500/10 transition-all border border-purple-500/20 hover:border-purple-500/40">
              <Icon name="Plus" size={18} />
              <span className="font-medium">Создать группу</span>
            </button>
          </div>
        )}

        {/* CHANNELS */}
        {active === "channels" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden p-6">
            <h2 className="text-white font-display font-bold text-2xl mb-2 animate-fade-in">Каналы</h2>
            <p className="text-white/40 text-sm mb-6 animate-fade-in">Подпишись на интересные каналы</p>
            <div className="space-y-3">
              {channels.map((ch, i) => (
                <div
                  key={ch.id}
                  className="glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/8 transition-all hover:scale-[1.01] cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {ch.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{ch.name}</h3>
                    <p className="text-white/40 text-xs mb-2">{ch.desc}</p>
                    <div className="flex items-center gap-1.5 text-white/30 text-xs">
                      <Icon name="Users" size={12} />
                      <span>{ch.members} подписчиков</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-medium hover:opacity-90 transition-opacity flex-shrink-0">
                    Читать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH */}
        {active === "search" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden p-6">
            <h2 className="text-white font-display font-bold text-2xl mb-6 animate-fade-in">Поиск</h2>
            <div className="relative mb-6 animate-fade-in">
              <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск людей, групп, каналов..."
                className="w-full bg-white/5 border border-white/8 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
            {!searchQuery ? (
              <div>
                <h3 className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">Недавние</h3>
                <div className="space-y-2">
                  {["Алексей Смирнов", "Tech Insider", "Дизайн-команда"].map((name, i) => (
                    <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors animate-fade-in text-left" style={{ animationDelay: `${i * 0.05}s` }}>
                      <Icon name="Clock" size={16} className="text-white/20" />
                      <span className="text-white/60 text-sm">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <h3 className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">Результаты</h3>
                {chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                  <div className="space-y-2">
                    {chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                      <button key={c.id} onClick={() => { setActive("chats"); setActiveChat(c.id); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">{c.avatar}</div>
                        <div>
                          <div className="text-white text-sm font-medium">{c.name}</div>
                          <div className="text-white/40 text-xs">{c.online ? "онлайн" : "был недавно"}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-white/30 text-sm">Ничего не найдено</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {active === "notifications" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden p-6">
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <h2 className="text-white font-display font-bold text-2xl">Уведомления</h2>
              <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">Прочитать все</button>
            </div>
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <div
                  key={n.id}
                  className="glass rounded-2xl p-4 flex items-start gap-4 hover:bg-white/8 transition-all animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon name={n.icon as any} size={18} className={n.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-semibold">{n.user}</span>{" "}
                      <span className="text-white/60">{n.text}</span>
                    </p>
                    <p className="text-white/30 text-xs mt-1">{n.time}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full gradient-bg mt-2 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {active === "profile" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            <div className="relative h-48 gradient-bg flex items-end p-6 overflow-hidden">
              <div className="absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.8) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(236,72,153,0.8) 0%, transparent 60%)" }}
              />
              <button className="absolute top-4 right-4 glass px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-1.5 hover:bg-white/15 transition-colors">
                <Icon name="Edit3" size={13} />
                Изменить
              </button>
              <div className="relative z-10 flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-display font-black text-3xl border-4 border-[#0a0a12]">
                  А
                </div>
                <div className="mb-1">
                  <h2 className="text-white font-display font-black text-2xl">Алексей Смирнов</h2>
                  <p className="text-white/60 text-sm">@alexsmirn</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-white/60 text-sm mb-6">Привет! Я пользуюсь Pulse 🚀</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Друзья", value: "89" },
                  { label: "Группы", value: "12" },
                  { label: "Каналы", value: "7" },
                ].map((s, i) => (
                  <div key={i} className="glass rounded-2xl p-4 text-center">
                    <div className="text-white font-display font-black text-xl gradient-text">{s.value}</div>
                    <div className="text-white/40 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { icon: "Phone", label: "+7 (999) 123-45-67" },
                  { icon: "Mail", label: "alex@example.com" },
                  { icon: "MapPin", label: "Москва, Россия" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl">
                    <Icon name={item.icon as any} size={16} className="text-purple-400" />
                    <span className="text-white/70 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {active === "settings" && (
          <div className="flex-1 overflow-y-auto scrollbar-hidden p-6">
            <h2 className="text-white font-display font-bold text-2xl mb-6 animate-fade-in">Настройки</h2>
            <div className="space-y-2">
              {[
                { icon: "User", label: "Аккаунт", desc: "Личные данные и безопасность", color: "text-purple-400" },
                { icon: "Bell", label: "Уведомления", desc: "Звуки, вибрация, баннеры", color: "text-pink-400" },
                { icon: "Palette", label: "Оформление", desc: "Темы и цвета интерфейса", color: "text-cyan-400" },
                { icon: "Lock", label: "Конфиденциальность", desc: "Кто видит твой профиль", color: "text-green-400" },
                { icon: "Database", label: "Хранилище", desc: "Медиа и кэш", color: "text-orange-400" },
                { icon: "HelpCircle", label: "Помощь", desc: "FAQ и поддержка", color: "text-blue-400" },
                { icon: "LogOut", label: "Выйти", desc: "Завершить сессию", color: "text-red-400" },
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/8 transition-all hover:scale-[1.01] animate-fade-in text-left"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon name={item.icon as any} size={18} className={item.color} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{item.label}</div>
                    <div className="text-white/30 text-xs">{item.desc}</div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-white/20" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-5"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent)" }} />
      </div>
    </div>
  );
}