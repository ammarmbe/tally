CREATE TABLE users (
    id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL DEFAULT 'https://singlecolorimage.com/get/d4d4d4/100x100',
);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    days TEXT[] NOT NULL
);

CREATE TABLE course_times (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    start TIME,
    "end" TIME
);

CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type TEXT NOT NULL -- 'attended', 'cancelled', 'missed'
);

CREATE TABLE subscriptions (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    subscription TEXT NOT NULL,
    duration INT NOT NULL DEFAULT 15
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);