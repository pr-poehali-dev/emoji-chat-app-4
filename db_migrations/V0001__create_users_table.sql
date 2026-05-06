CREATE TABLE t_p31782049_emoji_chat_app_4.users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  username VARCHAR(50) UNIQUE,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  session_token VARCHAR(128) UNIQUE,
  otp_code VARCHAR(6),
  otp_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);