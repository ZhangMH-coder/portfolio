'use client';

import React, { useState, useMemo, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { motion } from 'framer-motion';
import { projectApi } from '../../lib/api';

// 项目类型定义
interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  techStack: string[];
  demoLink?: string;
  githubLink?: string;
}

// 排序选项类型
type SortOption = 'title' | 'recent' | 'oldest';

/**
 * 项目展示页面 - 客户端组件
 * 使用ProjectCard组件展示项目
 * 预加载默认项目数据
 */
const ProjectsPage = () => {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const itemsPerPage = 6;

  // 状态管理
  const [projects, setProjects] = useState<Project[]>([]);

  // 关闭模态框时重置图片索引
  const handleCloseModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  // 打开全屏图片查看器
  const handleOpenFullscreenImage = (index: number) => {
    setCurrentImageIndex(index);
    setShowFullscreenImage(true);
  };

  // 关闭全屏图片查看器
  const handleCloseFullscreenImage = () => {
    setShowFullscreenImage(false);
  };

  // 验证 URL 是否有效
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // 从 API 加载项目数据
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await projectApi.getProjects();
        if (projectsData && projectsData.length > 0) {
          const validProjects = projectsData.filter((project: Project) => {
            const hasValidImage = project.images && project.images.length > 0 && project.images.some((img: string) => isValidUrl(img));
            return hasValidImage || true;
          });
          setProjects(validProjects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('加载项目数据失败:', error);
        setProjects([]);
      }
    };

    loadProjects();
  }, []);

  // 搜索和排序处理
  const filteredAndSortedProjects = useMemo(() => {
    // 过滤掉无效项目
    let result = projects.filter(p => p && p.title) || [];

    // 搜索功能
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        (project.techStack && Array.isArray(project.techStack) && project.techStack.some(tech => tech.toLowerCase().includes(term)))
      );
    }

    // 排序功能
    switch (sortOption) {
      case 'title':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'recent':
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'oldest':
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }

    return result;
  }, [projects, searchTerm, sortOption]);

  // 分页处理
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const currentProjects = filteredAndSortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 无状态页面组件
  const EmptyState = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-8">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-4">暂无项目</h2>
      <p className="text-gray-400 max-w-md mb-8">
        您还没有添加任何项目。开始创建您的第一个项目，展示您的技能和成果。
      </p>
      <a 
        href="/admin" 
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
      >
        添加项目
      </a>
    </div>
  );

  // 分页组件
  const Pagination = () => (
    <div className="flex justify-center mt-12">
      <nav className="inline-flex rounded-md shadow">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 border-t border-b ${page === 1 ? 'border-l' : ''} ${page === totalPages ? 'border-r rounded-r-md' : ''} ${page === currentPage ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground"
          >
            项目展示
          </motion.h1>

          {/* 搜索、排序和筛选控件 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            {/* 搜索框 */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索项目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 bg-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 排序选项 */}
            <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
              <div className="relative group">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="relative px-4 py-2 rounded-lg bg-gray-900/80 backdrop-blur-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-blue-500/20 font-mono text-sm appearance-none cursor-pointer"
                >
                  <option value="recent">最新优先</option>
                  <option value="oldest">最早优先</option>
                  <option value="title">按标题排序</option>
                </select>
              </div>
            </div>
          </motion.div>
          
          {/* 检查项目数据是否为空 */}
          {filteredAndSortedProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <EmptyState />
            </motion.div>
          ) : (
            <>
              {/* 项目卡片网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      images={project.images || []}
                      techStack={project.techStack}
                      demoLink={project.demoLink}
                      githubLink={project.githubLink}
                      onClick={() => { setSelectedProject(project); setCurrentImageIndex(0); }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* 分页控件 */}
              {totalPages > 1 && <Pagination />}
            </>
          )}
        </div>
      </div>

      {/* 项目详情模态框 */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-lg overflow-hidden w-full max-w-4xl max-h-[90vh] group"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="text-xs font-mono text-blue-500 overflow-y-auto max-h-[90vh]">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{'01010101'.repeat(4)}</span>
                    <span>{'10101010'.repeat(4)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 overflow-y-auto max-h-[90vh] p-6">
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="mb-6">
                  {/* 大图展示 */}
                  <div 
                    className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 mb-4 cursor-pointer group/img" 
                    onClick={() => handleOpenFullscreenImage(currentImageIndex)}
                  >
                    <img 
                      src={selectedProject.images[currentImageIndex]} 
                      alt={`${selectedProject.title} - 图片 ${currentImageIndex + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105" 
                    />
                    {/* 放大提示图标 */}
                    <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                      </svg>
                    </div>
                    {/* 左右切换按钮 */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((currentImageIndex - 1 + selectedProject.images.length) % selectedProject.images.length);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((currentImageIndex + 1) % selectedProject.images.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </>
                    )}
                  </div>
                  {/* 缩略图列表 */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProject.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`缩略图 ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-4">{selectedProject.title}</h2>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">项目描述</h3>
                <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
              </div>

              {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">技术栈</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded-full border border-blue-800/50">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                {selectedProject.demoLink && selectedProject.demoLink !== '#' && (
                  <a href={selectedProject.demoLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">访问演示</a>
                )}
                {selectedProject.githubLink && selectedProject.githubLink !== '#' && (
                  <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">查看 GitHub</a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 全屏图片查看器 */}
      {showFullscreenImage && selectedProject && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[70] p-4"
          onClick={handleCloseFullscreenImage}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-7xl max-h-screen flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部工具栏 */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {/* 图片计数 */}
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-mono">
                {currentImageIndex + 1} / {selectedProject.images.length}
              </div>
              {/* 关闭按钮 */}
              <button 
                onClick={handleCloseFullscreenImage}
                className="bg-black/50 backdrop-blur-sm hover:bg-red-600 text-white p-3 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* 主图片 */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <img 
                src={selectedProject.images[currentImageIndex]} 
                alt={`${selectedProject.title} - 全屏预览 ${currentImageIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* 底部导航 */}
            <div className="flex justify-between items-center mt-4 px-4">
              {/* 项目标题 */}
              <div className="text-white text-lg font-semibold truncate max-w-md">
                {selectedProject.title}
              </div>

              {/* 切换按钮 */}
              {selectedProject.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex((currentImageIndex - 1 + selectedProject.images.length) % selectedProject.images.length)}
                    className="bg-black/50 backdrop-blur-sm hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((currentImageIndex + 1) % selectedProject.images.length)}
                    className="bg-black/50 backdrop-blur-sm hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* 缩略图导航 */}
            {selectedProject.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-4 px-4 mt-2">
                {selectedProject.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-blue-500 opacity-100 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`缩略图 ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;