import { executeQuery } from '@lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const name = params.name;

  if (!name) {
    return NextResponse.json(
      { message: 'Table name is required' },
      { status: 400 }
    );
  }

  try {
    // Get table columns
    const columns = await executeQuery({
      query: `
        SELECT column_name, data_type, column_key, is_nullable
        FROM information_schema.columns
        WHERE table_schema = ? AND table_name = ?
        ORDER BY ordinal_position
      `,
      values: [process.env.MYSQL_DATABASE, name],
    });

    // Get table data
    const data = await executeQuery({
      query: `SELECT * FROM \`${name}\` LIMIT 100`,
    });

    return NextResponse.json({ 
      table: name,
      columns,
      data,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Operation failed', error: error.message },
      { status: 500 }
    );
  }
}