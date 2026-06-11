
CREATE TABLE t_p3482084_react_native_family_.chats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128),
  is_group BOOLEAN DEFAULT FALSE,
  avatar VARCHAR(8) DEFAULT '💬',
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p3482084_react_native_family_.chat_members (
  chat_id INTEGER NOT NULL REFERENCES t_p3482084_react_native_family_.chats(id),
  user_id INTEGER NOT NULL REFERENCES t_p3482084_react_native_family_.users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE t_p3482084_react_native_family_.messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER NOT NULL REFERENCES t_p3482084_react_native_family_.chats(id),
  user_id INTEGER NOT NULL REFERENCES t_p3482084_react_native_family_.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_chat_id ON t_p3482084_react_native_family_.messages(chat_id);
CREATE INDEX idx_messages_created_at ON t_p3482084_react_native_family_.messages(created_at);
