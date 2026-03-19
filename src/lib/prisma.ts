// Prisma 客户端实例管理
// 创建一个全局的 PrismaClient 实例，避免在每个 API 路由中创建新实例

import { PrismaClient } from '../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

// 使用绝对路径
const dbUrl = `file:${path.resolve(process.cwd(), 'prisma', 'dev.db')}`;
const adapter = new PrismaLibSql({
  url: dbUrl
});

// 创建全局 Prisma 客户端实例
const prisma = new PrismaClient({ adapter });

export default prisma;