import { executeQuery } from '@lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tables = await executeQuery({
      query: `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = ?
      `,
      values: [process.env.MYSQL_DATABASE],
    });
    
    return NextResponse.json({ tables: tables.map((t: any) => t.table_name) });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Failed to get tables', error: error.message },
      { status: 500 }
    );
  }
}