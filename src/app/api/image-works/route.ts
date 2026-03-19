import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const imageWorks = await prisma.imageWork.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(imageWorks);
  } catch (error) {
    console.error('获取图片作品失败:', error);
    return NextResponse.json({ error: '获取图片作品失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const imageWork = await prisma.imageWork.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        prompt: data.prompt || null,
        tags: data.tags || [],
        isFeatured: data.isFeatured || false,
      },
    });
    
    return NextResponse.json(imageWork);
  } catch (error) {
    console.error('创建图片作品失败:', error);
    return NextResponse.json({ error: '创建图片作品失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const imageWork = await prisma.imageWork.update({
      where: { id },
      data: {
        ...updateData,
        tags: updateData.tags || [],
      },
    });
    
    return NextResponse.json(imageWork);
  } catch (error) {
    console.error('更新图片作品失败:', error);
    return NextResponse.json({ error: '更新图片作品失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;
    
    await prisma.imageWork.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除图片作品失败:', error);
    return NextResponse.json({ error: '删除图片作品失败' }, { status: 500 });
  }
}
