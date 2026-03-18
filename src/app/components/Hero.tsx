'use client';

import { motion } from 'framer-motion';
import React, { useCallback } from 'react';
import { Shape, CodeSnippet } from '@/types';
import { isMobile } from '@/utils';

/**
 * 英雄区组件
 * 包含动画问候语、简短介绍和查看作品按钮
 */
const Hero: React.FC = () => {
  // 使用 useCallback 优化回调函数
  const handleDragEnd = useCallback((event: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      window.location.href = "/projects";
    }
  }, []);
  
  // 代码片段数据
  const codeSnippets: CodeSnippet[] = [
    'function createPortfolio() {',
    '  return (',
    '    <div className="modern-portfolio">',
    '      <HeroSection />',
    '      <ProjectsGrid />',
    '      <SkillsSection />',
    '    </div>',
    '  );',
    '}',
    'export default createPortfolio;'
  ];

  // 几何形状数据
  const shapes: Shape[] = [
    { size: 60, top: '20%', left: '10%', delay: 0 },
    { size: 100, top: '60%', right: '15%', delay: 0.2 },
    { size: 40, top: '40%', left: '85%', delay: 0.4 },
    { size: 80, top: '80%', right: '25%', delay: 0.6 },
  ];

  // 技术栈数据
  const techStack = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Node.js'];

  return (
    <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* 背景代码片段动画 */}
      <div className="absolute inset-0 z-0 opacity-10">
        {codeSnippets.map((snippet, index) => (
          <motion.div
            key={index}
            className="absolute left-0 right-0 text-xs text-primary font-mono"
            initial={{ y: -100, opacity: 0 }}
            animate={{ 
              y: [0, (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 15 + index * 2,
              repeat: Infinity,
              delay: index * 1.5,
              ease: "linear"
            }}
            style={{ 
              top: `${index * 15}%`,
              willChange: 'transform, opacity'
            }}
          >
            {snippet}
          </motion.div>
        ))}
      </div>

      {/* 漂浮的几何形状 */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute z-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 8 + index * 2,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut"
          }}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            right: shape.right,
            willChange: 'transform, opacity'
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* 动画问候语 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              你好，我是 <span className="text-white">崖岸岸</span>
            </h1>
          </motion.div>

          {/* 简短介绍 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-10"
          >
            专注于现代前端开发和用户体验设计，
            致力于创建高质量的数字产品和解决方案。
          </motion.p>

          {/* 查看作品按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: ['0 0 0 rgba(14, 165, 233, 0)', '0 0 20px rgba(14, 165, 233, 0.5)', '0 0 0 rgba(14, 165, 233, 0)']
            }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <motion.a
              href="/projects"
              className="inline-block bg-primary hover:bg-primary/80 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300"
              style={{
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)'
              }}
              drag={isMobile() ? false : "x"}
              dragConstraints={{ left: 0, right: 200 }}
              dragElastic={0.5}
              dragMomentum={true}
              onDragEnd={handleDragEnd}
              whileDrag={{
                scale: 1.05,
                boxShadow: '0 8px 30px rgba(14, 165, 233, 0.5)'
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 8px 30px rgba(14, 165, 233, 0.5)'
              }}
            >
              <div className="flex items-center gap-2">
                <span>查看作品</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          </motion.div>

          {/* 装饰元素 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="mt-16 flex flex-wrap gap-4"
          >
            {techStack.map((tech, index) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-gray-800/50 text-gray-300 text-sm backdrop-blur-sm border border-gray-700/50"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);