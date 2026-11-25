import { neon } from "@neondatabase/serverless";

// Contact-form messages, kept in Vercel's Postgres (Neon). The table is
// created on first use, so connecting the database is the only setup step.
const url = () => process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
export const dbConfigured = () => url().length > 0;

export type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

let ready: Promise<unknown> | null = null;
function db() {
  const sql = neon(url());
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`.catch((error) => {
    ready = null;
    throw error;
  });
  return { sql, ready };
}

export async function saveMessage(name: string, email: string, message: string) {
  const { sql, ready } = db();
  await ready;
  await sql`INSERT INTO contact_messages (name, email, message) VALUES (${name}, ${email}, ${message})`;
}

export async function listMessages() {
  const { sql, ready } = db();
  await ready;
  const rows = await sql`
    SELECT id, name, email, message, read, created_at
    FROM contact_messages ORDER BY created_at DESC LIMIT 500`;
  return rows.map((r) => ({
    ...r,
    id: Number(r.id),
    created_at: new Date(r.created_at as string).toISOString(),
  })) as Message[];
}

export async function setRead(id: number, read: boolean) {
  const { sql, ready } = db();
  await ready;
  await sql`UPDATE contact_messages SET read = ${read} WHERE id = ${id}`;
}

export async function deleteMessage(id: number) {
  const { sql, ready } = db();
  await ready;
  await sql`DELETE FROM contact_messages WHERE id = ${id}`;
}
