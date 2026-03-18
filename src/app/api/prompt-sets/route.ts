import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const promptSets = await prisma.promptSet.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(promptSets);
  } catch (error) {
    console.error('获取指令集失败:', error);
    return NextResponse.json({ error: '获取指令集失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const promptSet = await prisma.promptSet.create({
      data: {
        name: data.name,
        description: data.description || '',
        promptIds: data.promptIds || [],
      },
    });
    return NextResponse.json(promptSet);
  } catch (error) {
    console.error('创建指令集失败:', error);
    return NextResponse.json({ error: '创建指令集失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const promptSet = await prisma.promptSet.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        promptIds: data.promptIds,
      },
    });
    return NextResponse.json(promptSet);
  } catch (error) {
    console.error('更新指令集失败:', error);
    return NextResponse.json({ error: '更新指令集失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.promptSet.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除指令集失败:', error);
    return NextResponse.json({ error: '删除指令集失败' }, { status: 500 });
  }
}
