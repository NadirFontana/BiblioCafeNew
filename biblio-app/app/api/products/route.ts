// app/api/products/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query;
    if (category) {
      query = sql`
        SELECT p.id, p.category_id, p.name, p.description, p.price, p.available, p.order_index
        FROM products p
        WHERE p.category_id = ${category} AND p.available = true
        ORDER BY p.order_index ASC, p.name ASC
      `;
    } else {
      query = sql`
        SELECT p.id, p.category_id, p.name, p.description, p.price, p.available, p.order_index
        FROM products p
        WHERE p.available = true
        ORDER BY p.category_id, p.order_index ASC, p.name ASC
      `;
    }
    
    const { rows } = await query;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero dei prodotti' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { category_id, name, description, price, available = true, order_index = 0 } = await request.json();
    
    const { rows } = await sql`
      INSERT INTO products (category_id, name, description, price, available, order_index)
      VALUES (${category_id}, ${name}, ${description}, ${price}, ${available}, ${order_index})
      RETURNING id
    `;
    
    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error) {
    console.error('Errore nella creazione del prodotto:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione del prodotto' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, category_id, name, description, price, available, order_index } = await request.json();
    
    await sql`
      UPDATE products 
      SET category_id = ${category_id}, name = ${name}, description = ${description}, 
          price = ${price}, available = ${available}, order_index = ${order_index},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del prodotto:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento del prodotto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID prodotto richiesto' },
        { status: 400 }
      );
    }
    
    await sql`DELETE FROM products WHERE id = ${id}`;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione del prodotto:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione del prodotto' },
      { status: 500 }
    );
  }
}
