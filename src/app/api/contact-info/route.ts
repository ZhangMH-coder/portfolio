import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('获取联系信息失败:', error);
    return NextResponse.json({ error: '获取联系信息失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const existingContactInfo = await prisma.contactInfo.findFirst();
    
    if (existingContactInfo) {
      const updated = await prisma.contactInfo.update({
        where: { id: existingContactInfo.id },
        data: {
          email: data.email,
          github: data.github,
          bilibili: data.bilibili,
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.contactInfo.create({
        data: {
          email: data.email,
          github: data.github,
          bilibili: data.bilibili,
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error('保存联系信息失败:', error);
    return NextResponse.json({ error: '保存联系信息失败' }, { status: 500 });
  }
}
