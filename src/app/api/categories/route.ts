import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const category = await prisma.category.create({
      data: { name: data.name },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json({ error: '创建分类失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const category = await prisma.category.update({
      where: { id: data.id },
      data: { name: data.name },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('更新分类失败:', error);
    return NextResponse.json({ error: '更新分类失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除分类失败:', error);
    return NextResponse.json({ error: '删除分类失败' }, { status: 500 });
  }
}
