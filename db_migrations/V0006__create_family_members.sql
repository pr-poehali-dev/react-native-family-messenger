CREATE TABLE t_p3482084_react_native_family_.family_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, member_id)
);