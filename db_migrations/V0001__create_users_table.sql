
CREATE TABLE t_p3482084_react_native_family_.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  display_name VARCHAR(128) NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'member',
  avatar VARCHAR(8) DEFAULT '👤',
  bio TEXT DEFAULT '',
  city VARCHAR(64) DEFAULT '',
  age INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p3482084_react_native_family_.users (username, display_name, password_hash, role, avatar, city, age, bio)
VALUES (
  'admin',
  'Администратор',
  'pbkdf2:sha256:600000$adminfamily2024$' || encode(sha256('admin123'::bytea), 'hex'),
  'admin',
  '👑',
  'Москва',
  NULL,
  'Администратор семейного чата'
);
