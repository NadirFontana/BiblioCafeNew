// app/api/categories/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, name, emoji, order_index
      FROM categories
      ORDER BY order_index ASC
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Errore nel recupero delle categorie:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero delle categorie' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { id, name, emoji, order_index } = await request.json();
    
    await sql`
      INSERT INTO categories (id, name, emoji, order_index)
      VALUES (${id}, ${name}, ${emoji}, ${order_index})
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nella creazione della categoria:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione della categoria' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, emoji, order_index } = await request.json();
    
    await sql`
      UPDATE categories 
      SET name = ${name}, emoji = ${emoji}, order_index = ${order_index}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della categoria:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento della categoria' },
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
        { error: 'ID categoria richiesto' },
        { status: 400 }
      );
    }
    
    await sql`DELETE FROM categories WHERE id = ${id}`;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione della categoria:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione della categoria' },
      { status: 500 }
    );
  }
}
