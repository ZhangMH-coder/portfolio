import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('获取提示词失败:', error);
    return NextResponse.json({ error: '获取提示词失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const prompt = await prisma.prompt.create({
      data: {
        name: data.name,
        content: data.content,
        categoryId: data.categoryId || '',
      },
    });
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('创建提示词失败:', error);
    return NextResponse.json({ error: '创建提示词失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const prompt = await prisma.prompt.update({
      where: { id: data.id },
      data: {
        name: data.name,
        content: data.content,
        categoryId: data.categoryId,
      },
    });
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('更新提示词失败:', error);
    return NextResponse.json({ error: '更新提示词失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.prompt.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除提示词失败:', error);
    return NextResponse.json({ error: '删除提示词失败' }, { status: 500 });
  }
}
