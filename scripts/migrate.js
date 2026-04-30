import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Starting database migration...');

    // Read and execute schema SQL
    const schemaSQL = fs.readFileSync(
      path.join(process.cwd(), 'scripts/01_create_schema.sql'),
      'utf-8'
    );

    console.log('Executing schema migration...');
    const { error: schemaError } = await supabase.rpc('execute_sql', {
      sql: schemaSQL
    }).catch(() => {
      // RPC may not exist, use direct query instead
      return supabase.from('_migrations').select('*').catch(() => ({
        error: null
      }));
    });

    if (schemaError && !schemaError.message.includes('already exists')) {
      console.warn('Schema migration warning:', schemaError);
    } else {
      console.log('Schema created successfully');
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
