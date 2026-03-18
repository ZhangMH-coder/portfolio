import { NextResponse } from 'next/server';

// 上传（禁用）
export async function GET() {
  return NextResponse.json({ error: 'Use image manager in admin' }, { status: 400 });
}

export async function POST() {
  return NextResponse.json({ error: 'Use image manager in admin' }, { status: 400 });
}
