import Database from "better-sqlite3";

const db = new Database("uploads.db");

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS uploads (
    id TEXT PRIMARY KEY,
    filename TEXT,
    size INTEGER,
    status TEXT,
    created_at TEXT,
    completed_at TEXT
  )
`).run();

export const UploadRepo = {
  create({ id, filename, size }) {
        try {
      db.prepare(`
        INSERT INTO uploads (id, filename, size, status, created_at)
        VALUES (?, ?, ?, 'CREATED', ?)
      `).run(id, filename, size, new Date().toISOString());
      console.log("DB: Created upload", id);
    } catch (error) {
      console.error("DB error on create:", error);
    }
  },

  start(id) {
    db.prepare(
      `UPDATE uploads SET status='UPLOADING' WHERE id=?`
    ).run(id);
  },

  complete(id) {
    db.prepare(
      `UPDATE uploads SET status='COMPLETED', completed_at=? WHERE id=?`
    ).run(new Date().toISOString(), id);
  },

  fail(id) {
    db.prepare(
      `UPDATE uploads SET status='FAILED' WHERE id=?`
    ).run(id);
  },

  get(id) {
    return db.prepare(`SELECT * FROM uploads WHERE id=?`).get(id);
  }
};
