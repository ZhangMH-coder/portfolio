'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  images: string[];
  techStack: string[];
  demoLink?: string;
  githubLink?: string;
  onClick?: () => void;
}

// 技术栈图标映射
const techIcons: Record<string, string> = {
  'React': '⚛️',
  'Next.js': '⬢',
  'TypeScript': 'TS',
  'Tailwind CSS': '💨',
  'Stripe': '💳',
  'D3.js': '📊',
  'Chart.js': '📈',
  'Figma': '🎨',
  'UI/UX': '👤',
  'Mobile Design': '📱',
  'Prototyping': '🔄',
  'Python': '🐍',
  'Node.js': '🟢',
  'Express': '⚡',
  'MongoDB': '🍃',
};

/**
 * 项目卡片组件
 * 可复用的项目展示卡片，包含标题、描述、图片、技术栈、演示链接和 GitHub 链接
 */
const ProjectCard: React.FC<ProjectCardProps> = React.memo(({
  title,
  description,
  images,
  techStack,
  demoLink,
  githubLink,
  onClick
}) => {
  const mainImage = images && images.length > 0 ? images[0] : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        boxShadow: '0 10px 30px rgba(14, 165, 233, 0.15)',
        transition: { duration: 0.3 }
      }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={onClick}
      className="glass overflow-hidden rounded-lg shadow-sm transition-all duration-300 cursor-pointer"
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        willChange: 'transform, opacity'
      }}
    >
      {/* 项目图片 */}
      <div className="relative overflow-hidden h-64 rounded-t-lg">
        {/* 图片占位符 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover transition-all duration-500 hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">暂无图片</span>
          </div>
        )}
      </div>

      {/* 项目内容 */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>

        {/* 技术栈图标 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {techStack && techStack.map((tech, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20"
            >
              <span>{techIcons[tech] || '📦'}</span>
              <span className="text-gray-300">{tech}</span>
            </div>
          ))}
        </div>

        {/* 链接 */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onClick) onClick();
          }}
          className="inline-flex items-center text-primary hover:underline font-medium"
        >
          查看详情
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
            className="ml-2"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
});

export default ProjectCard;