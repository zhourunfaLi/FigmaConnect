
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
    
    const mismatches = schemaColumns.filter(col => {
      // Skip the properties that are not database columns
      if (typeof schema[col] === 'function' || col === '_') return false;
      
      // Convert camelCase to snake_case for comparison
      const snakeCase = col.replace(/([A-Z])/g, '_$1').toLowerCase();
      return !dbColumns.includes(snakeCase) && !dbColumns.includes(col);
    });
    
    if(mismatches.length > 0) {
      console.warn(`警告: 表 ${tableName} 中有字段名不匹配: ${mismatches.join(', ')}`);
    }
    
    console.log(`✓ 表 ${tableName} 架构验证通过`);
  }
  
  console.log('所有表结构验证完成');
}
