import sqlite3 from 'sqlite3'

const database = new sqlite3.Database('./permits.db')

export function run(query, params = []) {
  return new Promise((resolve, reject) => {
    database.run(query, params, function onRun(error) {
      if (error) {
        reject(error)
        return
      }

      resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

export function get(query, params = []) {
  return new Promise((resolve, reject) => {
    database.get(query, params, (error, row) => {
      if (error) {
        reject(error)
        return
      }

      resolve(row)
    })
  })
}

export function all(query, params = []) {
  return new Promise((resolve, reject) => {
    database.all(query, params, (error, rows) => {
      if (error) {
        reject(error)
        return
      }

      resolve(rows)
    })
  })
}

export async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS permits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      permitType TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `)
}
