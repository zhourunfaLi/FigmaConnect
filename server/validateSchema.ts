
import { db } from './db';
import { sql } from 'drizzle-orm';
import { artworks, categories, users, comments } from '../shared/schema';

const schemaDefinitions = {
  artworks,
  categories, 
  users,
  comments
};

export async function validateSchema() {
  for (const [tableName, schema] of Object.entries(schemaDefinitions)) {
    const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = ${tableName};
    `);
    
    const dbColumns = result.rows.map(row => row.column_name);
    const schemaColumns = Object.keys(schema);
    
    const mismatches = schemaColumns.filter(col => !dbColumns.includes(col));
    if(mismatches.length > 0) {
      throw new Error(`Table ${tableName} is missing columns: ${mismatches.join(', ')}`);
    }
    
    console.log(`✓ Table ${tableName} schema validated`);
  }
}
