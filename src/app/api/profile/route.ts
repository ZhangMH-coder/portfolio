// 个人信息 API 路由
// 在服务器端处理个人信息的获取和更新

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { validateProfileData } from '../../../lib/validation';
import { handleCORS, handleOptionsRequest } from '../../../lib/cors';

// 处理 OPTIONS 请求
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest(request);
}

// 获取个人信息
export async function GET(request: NextRequest) {
  try {
    const profile = await prisma.profile.findFirst();
    let response = NextResponse.json(profile || null);
    return handleCORS(request, response);
  } catch (error) {
    console.error('获取个人信息失败:', error);
    let response = NextResponse.json({ error: '获取个人信息失败' }, { status: 500 });
    return handleCORS(request, response);
  }
}

// 更新个人信息
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 验证输入数据
    const validation = validateProfileData(data);
    if (!validation.isValid) {
      let response = NextResponse.json({ error: '输入数据无效', errors: validation.errors }, { status: 400 });
      return handleCORS(request, response);
    }
    
    const existingProfile = await prisma.profile.findFirst();
    
    let profile;
    if (existingProfile) {
      // 更新现有个人信息
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data,
      });
    } else {
      // 创建新个人信息
      profile = await prisma.profile.create({
        data,
      });
    }
    
    let response = NextResponse.json(profile);
    return handleCORS(request, response);
  } catch (error) {
    console.error('更新个人信息失败:', error);
    let response = NextResponse.json({ error: '更新个人信息失败' }, { status: 500 });
    return handleCORS(request, response);
  }
}
