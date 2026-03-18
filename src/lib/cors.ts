// CORS 配置

import { NextRequest, NextResponse } from 'next/server';

// 允许的源
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080'
];

// CORS 中间件
export function handleCORS(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin');
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

// 处理 OPTIONS 请求
export function handleOptionsRequest(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return handleCORS(request, response);
}
