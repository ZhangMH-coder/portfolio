// 技能 API 路由
// 在服务器端处理技能的获取、创建、更新和删除

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { validateSkillData, validateId } from '../../../lib/validation';
import { handleCORS, handleOptionsRequest } from '../../../lib/cors';

// 处理 OPTIONS 请求
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest(request);
}

// 获取所有技能
export async function GET(request: NextRequest) {
  try {
    const skills = await prisma.skill.findMany();
    let response = NextResponse.json(skills);
    return handleCORS(request, response);
  } catch (error) {
    console.error('获取技能列表失败:', error);
    let response = NextResponse.json({ error: '获取技能列表失败' }, { status: 500 });
    return handleCORS(request, response);
  }
}

// 创建技能
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 验证输入数据
    const validation = validateSkillData(data);
    if (!validation.isValid) {
      let response = NextResponse.json({ error: '输入数据无效', errors: validation.errors }, { status: 400 });
      return handleCORS(request, response);
    }
    
    const newSkill = await prisma.skill.create({
      data,
    });
    let response = NextResponse.json(newSkill);
    return handleCORS(request, response);
  } catch (error) {
    console.error('创建技能失败:', error);
    let response = NextResponse.json({ error: '创建技能失败' }, { status: 500 });
    return handleCORS(request, response);
  }
}

// 更新技能
export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    
    // 验证 ID
    const idValidation = validateId(id);
    if (!idValidation.isValid) {
      let response = NextResponse.json({ error: idValidation.error }, { status: 400 });
      return handleCORS(request, response);
    }
    
    // 验证输入数据
    const dataValidation = validateSkillData(data);
    if (!dataValidation.isValid) {
      let response = NextResponse.json({ error: '输入数据无效', errors: dataValidation.errors }, { status: 400 });
      return handleCORS(request, response);
    }
    
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data,
    });
    let response = NextResponse.json(updatedSkill);
    return handleCORS(request, response);
  } catch (error) {
    console.error('更新技能失败:', error);
    let response = NextResponse.json({ error: '更新技能失败' }, { status: 500 });
    return handleCORS(request, response);
  }
}

// 删除技能
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    // 验证 ID
    const idValidation = validateId(id);
    if (!idValidation.isValid) {
      let response = NextResponse.json({ error: idValidation.error }, { status: 400 });
      return handleCORS(request, response);
    }
    
    await prisma.skill.delete({
      where: { id },
    });
    let response = NextResponse.json({ success: true });
    return handleCORS(request, response);
  } catch (error) {
    console.error('删除技能失败:', error);
    let response = NextResponse.json({ error: '删除技能失败' }, { status: 500 });
    return handleCORS(request, response);
  }
}
