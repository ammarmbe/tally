CREATE TABLE users (
    id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL DEFAULT 'https://singlecolorimage.com/get/d4d4d4/100x100',
    subscription TEXT,
    notifications BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() AT TIME ZONE 'Africa/Cairo',
    durations INT[] NOT NULL DEFAULT '{15}'
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() AT TIME ZONE 'Africa/Cairo',
    days TEXT[] NOT NULL
);

CREATE TABLE course_times (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    start TIME,
    "end" TIME,
    room TEXT,
    UNIQUE (course_id, day, start)
);

CREATE TYPE entry_type AS ENUM ('attended', 'cancelled', 'missed');

CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type entry_type NOT NULL
);

CREATE TYPE notification_duration AS ENUM ('15', '30', '45', '60');

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() AT TIME ZONE 'Africa/Cairo',
    duration INT NOT NULL
);

-- Indexes
CREATE INDEX idx_course_times_day ON course_times(day);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_entries_date ON entries(date);
