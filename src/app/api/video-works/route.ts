import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import fs from 'fs';

const dbFile = path.resolve(process.cwd(), 'prisma', 'dev.db');
console.log('DB File exists:', fs.existsSync(dbFile), dbFile);

const dbUrl = `file:${dbFile}`;
console.log('VideoWorks DB URL:', dbUrl);
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const videoWorks = await prisma.videoWork.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(videoWorks);
  } catch (error) {
    console.error('获取视频作品失败:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '获取视频作品失败', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const videoWork = await prisma.videoWork.create({
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail || null,
        prompt: data.prompt || null,
        tags: data.tags || [],
        isFeatured: data.isFeatured || false,
      },
    });
    
    return NextResponse.json(videoWork);
  } catch (error) {
    console.error('创建视频作品失败:', error);
    return NextResponse.json({ error: '创建视频作品失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const videoWork = await prisma.videoWork.update({
      where: { id },
      data: {
        ...updateData,
        tags: updateData.tags || [],
      },
    });
    
    return NextResponse.json(videoWork);
  } catch (error) {
    console.error('更新视频作品失败:', error);
    return NextResponse.json({ error: '更新视频作品失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;
    
    await prisma.videoWork.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除视频作品失败:', error);
    return NextResponse.json({ error: '删除视频作品失败' }, { status: 500 });
  }
}
