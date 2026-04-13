import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

const dbPath = path.join(process.cwd(), "pos.db");

export const db = new Database(dbPath);

// INIT TABLES
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  product_uuid TEXT PRIMARY KEY,
  name TEXT,
  barcode TEXT,
  sku TEXT,
  price REAL,
  gst_percent REAL,
  stock INTEGER
);

CREATE TABLE IF NOT EXISTS carts (
  cart_uuid TEXT PRIMARY KEY,
  status TEXT,
  discount REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_uuid TEXT,
  product_uuid TEXT,
  quantity INTEGER,
  price REAL,
  tax_percent REAL,
  discount REAL DEFAULT 0
);
`);