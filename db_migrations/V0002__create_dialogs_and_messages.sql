CREATE TABLE t_p31782049_emoji_chat_app_4.dialogs (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER NOT NULL REFERENCES t_p31782049_emoji_chat_app_4.users(id),
  user2_id INTEGER NOT NULL REFERENCES t_p31782049_emoji_chat_app_4.users(id),
  last_message_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CHECK(user1_id < user2_id)
);

CREATE TABLE t_p31782049_emoji_chat_app_4.messages (
  id SERIAL PRIMARY KEY,
  dialog_id INTEGER NOT NULL REFERENCES t_p31782049_emoji_chat_app_4.dialogs(id),
  sender_id INTEGER NOT NULL REFERENCES t_p31782049_emoji_chat_app_4.users(id),
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_dialog_id ON t_p31782049_emoji_chat_app_4.messages(dialog_id);
CREATE INDEX idx_messages_created_at ON t_p31782049_emoji_chat_app_4.messages(created_at);
CREATE INDEX idx_dialogs_user1 ON t_p31782049_emoji_chat_app_4.dialogs(user1_id);
CREATE INDEX idx_dialogs_user2 ON t_p31782049_emoji_chat_app_4.dialogs(user2_id);