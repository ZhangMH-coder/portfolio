import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const images = await prisma.managedImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('获取图片库失败:', error);
    return NextResponse.json({ error: '获取图片库失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    const image = await prisma.managedImage.create({
      data: { url },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error('添加图片失败:', error);
    return NextResponse.json({ error: '添加图片失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.managedImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除图片失败:', error);
    return NextResponse.json({ error: '删除图片失败' }, { status: 500 });
  }
}
