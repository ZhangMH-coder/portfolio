import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

// 获取所有项目
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('获取项目失败:', error);
    return NextResponse.json({ error: '获取项目失败' }, { status: 500 });
  }
}

// 创建项目
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images || [],
        techStack: data.techStack || [],
        demoLink: data.demoLink || '',
        githubLink: data.githubLink || '',
        isFeatured: data.isFeatured || false,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error('创建项目失败:', error);
    return NextResponse.json({ error: '创建项目失败' }, { status: 500 });
  }
}

// 更新项目
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const project = await prisma.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
        techStack: data.techStack,
        demoLink: data.demoLink,
        githubLink: data.githubLink,
        isFeatured: data.isFeatured,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error('更新项目失败:', error);
    return NextResponse.json({ error: '更新项目失败' }, { status: 500 });
  }
}

// 删除项目
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除项目失败:', error);
    return NextResponse.json({ error: '删除项目失败' }, { status: 500 });
  }
}
