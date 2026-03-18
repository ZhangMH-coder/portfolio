'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { projectApi } from '../../lib/api';
// 项目类型定义
interface Project {
  id: number | string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  tags?: string[];
  techStack?: string[];
  link?: string;
  demoLink?: string;
  githubLink?: string;
  isFeatured?: boolean;
}
import { TechBadge } from '@/components/common/TechBadge';

/**
 * 项目展示组件
 * 包含3个玻璃拟态卡片，每个带图片、标题、标签和链接
 */
const Projects: React.FC = () => {
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

  // 从 API 加载精选项目
  const [featuredProjects, setFeaturedProjects] = React.useState<Project[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const loadFeaturedProjects = async () => {
      setIsMounted(true);
      try {
        const projects = await projectApi.getProjects();
        if (projects && projects.length > 0) {
          // 过滤出精选项目，最多 3 个
          const featured = projects
            .filter((p: Project) => p.isFeatured === true)
            .slice(0, 3);
          setFeaturedProjects(featured);
        }
      } catch (error) {
        console.error('加载精选项目失败:', error);
      }
    };

    loadFeaturedProjects();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">精选项目</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isMounted ? '展示我近期完成的一些代表性作品，涵盖前端开发、UI设计和数据可视化等领域' : '加载中...'}
          </p>
        </motion.div>

        {/* 项目网格 */}
        {!isMounted ? (
          // SSR 期间显示加载状态
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass overflow-hidden rounded-lg shadow-sm p-6">
                <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse rounded-t-lg"></div>
                <div className="mt-6 space-y-4">
                  <div className="h-6 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 w-16 bg-gray-700/50 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-700/50 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 10px 30px rgba(14, 165, 233, 0.15)',
                  transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true, margin: "-50px" }}
                className="glass overflow-hidden rounded-lg shadow-sm transition-all duration-300"
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
                  <Image
                    src={project.images?.[0] || project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* 项目内容 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>

                  {/* 技术栈图标 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack && Array.isArray(project.techStack) ? project.techStack.map((tag: string, tagIndex: number) => (
                      <TechBadge
                        key={tagIndex}
                        tech={tag}
                        icon={techIcons[tag] || '📦'}
                      />
                    )) : []}
                  </div>

                  {/* 链接 */}
                  <a
                    href="/projects"
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>暂无精选项目</p>
            <p className="text-sm mt-2">请在后台管理中将项目设为精选</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(Projects);