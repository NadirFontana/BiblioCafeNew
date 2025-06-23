// scripts/verify-db.ts
import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function verifyDatabase() {
  try {
    console.log('🔍 Verifica del database...');

    // Verifica tabelle
    const { rows: tables } = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('categories', 'products')
    `;
    
    console.log('📋 Tabelle trovate:', tables.map(t => t.table_name));

    // Conta categorie
    const { rows: categoryCount } = await sql`SELECT COUNT(*) as count FROM categories`;
    console.log('📂 Categorie totali:', categoryCount[0].count);

    // Conta prodotti
    const { rows: productCount } = await sql`SELECT COUNT(*) as count FROM products`;
    console.log('🍽️ Prodotti totali:', productCount[0].count);

    // Mostra alcune categorie
    const { rows: sampleCategories } = await sql`
      SELECT id, name, emoji FROM categories ORDER BY order_index LIMIT 3
    `;
    console.log('📋 Esempio categorie:');
    sampleCategories.forEach(cat => {
      console.log(`  ${cat.emoji} ${cat.name} (${cat.id})`);
    });

    // Mostra alcuni prodotti
    const { rows: sampleProducts } = await sql`
      SELECT name, price, category_id FROM products ORDER BY id LIMIT 5
    `;
    console.log('🍽️ Esempio prodotti:');
    sampleProducts.forEach(prod => {
      console.log(`  ${prod.name} - €${prod.price} (${prod.category_id})`);
    });

    console.log('✅ Verifica completata con successo!');
    
  } catch (error) {
    console.error('❌ Errore durante la verifica:', error);
    process.exit(1);
  }
}

verifyDatabase();
