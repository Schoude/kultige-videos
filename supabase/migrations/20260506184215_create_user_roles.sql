-- 1. Create a roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);
-- 2. Insert your specific roles
INSERT INTO roles (name)
VALUES ('admin'),
  ('viewer');
-- 3. Link your existing auth.users to these roles
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);
