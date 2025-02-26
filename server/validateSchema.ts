
import { db } from './db';
import { sql } from 'drizzle-orm';

export async function validateSchema() {
  const tables = ['categories', 'artworks', 'users', 'comments'];
  
  for (const table of tables) {
    const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = ${table};
    `);
    console.log(`Table ${table} columns:`, result.rows);
  }
}
