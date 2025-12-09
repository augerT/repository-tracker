CREATE DATABASE repos_test;

\c repos_test

-- Copy your schema from dbsetup.sql
CREATE TABLE repos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  latest_release_id INTEGER,
  latest_release_tag VARCHAR(255),
  latest_release_date TIMESTAMP,
  latest_release_notes TEXT,
  seen_by_user BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(owner, name)
);

CREATE INDEX idx_repos_owner_name ON repos(owner, name);
CREATE INDEX idx_repos_seen_by_user ON repos(seen_by_user);