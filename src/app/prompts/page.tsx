'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { promptApi, categoryApi, promptSetApi } from '../../lib/api';

// 类型定义
interface Prompt {
  id: string;
  name: string;
  content: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface PromptSet {
  id: string;
  name: string;
  description: string;
  promptIds: string[];
}

// 排序选项类型
type SortOption = 'name' | 'recent' | 'oldest';

/**
 * 提示词页面组件
 * 只负责展示提示词、分类和指令集，从localStorage读取数据
 */
const PromptsPage: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<'prompts' | 'sets'>('prompts');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promptSets, setPromptSets] = useState<PromptSet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expandedSetId, setExpandedSetId] = useState<string | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const itemsPerPage = 6;

  // 初始化数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [promptsData, categoriesData, setsData] = await Promise.all([
          promptApi.getPrompts(),
          categoryApi.getCategories(),
          promptSetApi.getPromptSets()
        ]);

        if (promptsData) setPrompts(promptsData);
        if (categoriesData) setCategories(categoriesData);
        if (setsData) setPromptSets(setsData);
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };

    loadData();
  }, []);

  // 辅助函数
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '未分类';
  };

  // 搜索和排序处理 - 提示词
  const filteredAndSortedPrompts = useMemo(() => {
    let result = [...prompts];

    // 分类筛选
    if (selectedCategoryId) {
      result = result.filter(prompt => prompt.categoryId === selectedCategoryId);
    }

    // 搜索功能
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(prompt => 
        prompt.name.toLowerCase().includes(term) ||
        prompt.content.toLowerCase().includes(term) ||
        getCategoryName(prompt.categoryId).toLowerCase().includes(term)
      );
    }

    // 排序功能
    switch (sortOption) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'oldest':
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }

    return result;
  }, [prompts, categories, searchTerm, sortOption, selectedCategoryId]);

  // 搜索和排序处理 - 分类
  const filteredAndSortedCategories = useMemo(() => {
    let result = [...categories];

    // 搜索功能
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(category => 
        category.name.toLowerCase().includes(term)
      );
    }

    // 排序功能
    switch (sortOption) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        // 假设ID越大越新
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'oldest':
        // 假设ID越小越旧
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }

    return result;
  }, [categories, searchTerm, sortOption]);

  // 搜索和排序处理 - 指令集
  const filteredAndSortedPromptSets = useMemo(() => {
    let result = [...promptSets];

    // 搜索功能
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(set => 
        set.name.toLowerCase().includes(term) ||
        (set.description && set.description.toLowerCase().includes(term))
      );
    }

    // 排序功能
    switch (sortOption) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        // 假设ID越大越新
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'oldest':
        // 假设ID越小越旧
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }

    return result;
  }, [promptSets, searchTerm, sortOption]);

  // 分页处理
  const getCurrentItems = () => {
    switch (activeTab) {
      case 'prompts':
        return filteredAndSortedPrompts.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );
      case 'sets':
        return filteredAndSortedPromptSets.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );
      default:
        return [];
    }
  };

  const getTotalPages = () => {
    switch (activeTab) {
      case 'prompts':
        return Math.ceil(filteredAndSortedPrompts.length / itemsPerPage);
      case 'sets':
        return Math.ceil(filteredAndSortedPromptSets.length / itemsPerPage);
      default:
        return 1;
    }
  };

  // 重置分页当切换标签页或搜索/排序时
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, sortOption, selectedCategoryId]);

  // 分页组件
  const Pagination = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return null;

    return (
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
  };

  // 空状态组件
  const EmptyState = () => (
    <div className="col-span-full relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-blue-500/20 shadow-lg overflow-hidden">
      {/* 背景纹理 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="text-xs font-mono text-blue-500">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <span>{'01010101'.repeat(4)}</span>
              <span>{'10101010'.repeat(4)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 霓虹蓝发光边框 */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50"></div>
      
      <div className="relative z-10">
        <p className="text-gray-400 font-mono">
          {activeTab === 'prompts' ? '暂无提示词' : '暂无指令集'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
            指令集
          </h1>

          {/* 标签页导航 */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setActiveTab('prompts')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'prompts' ? 'bg-primary text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'} rounded-l-lg`}
              >
                提示词
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sets')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'sets' ? 'bg-primary text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'} rounded-r-lg`}
              >
                指令集
              </button>
            </div>
          </div>

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
                  placeholder={`搜索${activeTab === 'prompts' ? '提示词' : '指令集'}...`}
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
                  <option value="name">按名称排序</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* 提示词标签页 */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              {/* 分类索引 */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">分类筛选</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategoryId(null)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategoryId === null
                          ? 'bg-primary text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      全部
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedCategoryId === category.id
                            ? 'bg-primary text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 提示词列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAndSortedPrompts.length === 0 ? (
                  <EmptyState />
                ) : (
                  (getCurrentItems() as Prompt[]).map((prompt: Prompt) => (
                    <motion.div
                      key={prompt.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                      }}
                      onClick={() => setSelectedPrompt(prompt)}
                      className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-lg overflow-hidden group cursor-pointer"
                    >
                      {/* 背景纹理 */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="text-xs font-mono text-blue-500">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{'01010101'.repeat(4)}</span>
                              <span>{'10101010'.repeat(4)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* 霓虹蓝发光边框 */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10">
                        {/* 顶部：提示词名称、分类 */}
                        <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                          <div>
                            <h3 className="text-xl font-bold font-mono text-foreground mb-2">
                              {prompt.name}
                            </h3>
                            <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                              {getCategoryName(prompt.categoryId)}
                            </span>
                          </div>
                        </div>
                        
                        {/* 提示词内容 */}
                        <p className="text-sm font-mono text-gray-300 mb-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                          {prompt.content.length > 100 ? `${prompt.content.substring(0, 100)}...` : prompt.content}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              <Pagination />
            </div>
          )}

          {/* 指令集标签页 */}
          {activeTab === 'sets' && (
            <div className="space-y-6">
              {/* 指令集列表 */}
              <div className="grid grid-cols-1 gap-4">
                {filteredAndSortedPromptSets.length === 0 ? (
                  <EmptyState />
                ) : (
                  (getCurrentItems() as PromptSet[]).map((set: PromptSet) => (
                    <motion.div
                      key={set.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                      }}
                      className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-lg overflow-hidden group"
                    >
                      {/* 背景纹理 */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="text-xs font-mono text-blue-500">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{'01010101'.repeat(4)}</span>
                              <span>{'10101010'.repeat(4)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* 霓虹蓝发光边框 */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10">
                        {/* 顶部：指令名称 */}
                        <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                          <div>
                            <h3 className="text-xl font-bold font-mono text-foreground mb-2">
                              {set.name}
                            </h3>
                          </div>
                        </div>
                        
                        {/* 下方：简短描述 */}
                        {set.description && (
                          <p className="text-sm font-mono text-gray-300 mb-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                            {set.description}
                          </p>
                        )}
                        
                        {/* 底部：提示词标签 */}
                        {set.promptIds && set.promptIds.length > 0 && (
                          <div className="mt-4">
                            <button
                              onClick={() => setExpandedSetId(expandedSetId === set.id ? null : set.id)}
                              className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                            >
                              {expandedSetId === set.id ? '▼' : '▶'}
                              <span>查看提示词 ({set.promptIds.length})</span>
                            </button>
                            
                            {/* 展开的提示词列表 */}
                            {expandedSetId === set.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 space-y-2"
                              >
                                {set.promptIds.map((promptId) => {
                                  const prompt = prompts.find(p => p.id === promptId);
                                  if (!prompt) return null;
                                  return (
                                    <div key={prompt.id}>
                                      <button
                                        onClick={() => setSelectedPromptId(selectedPromptId === prompt.id ? null : prompt.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-mono transition-all ${
                                          selectedPromptId === prompt.id
                                            ? 'bg-primary/20 text-primary border border-primary/50'
                                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-transparent'
                                        }`}
                                      >
                                        {selectedPromptId === prompt.id ? '▼' : '▶'} {prompt.name}
                                      </button>
                                      
                                      {/* 提示词详情 */}
                                      {selectedPromptId === prompt.id && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          className="mt-2 p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                                        >
                                          <p className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                                            {prompt.content}
                                          </p>
                                        </motion.div>
                                      )}
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              <Pagination />
            </div>
          )}
        </motion.div>
      </div>

      {/* 提示词详情模态框 */}
      {selectedPrompt && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPrompt(null);
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-lg overflow-hidden w-full max-w-2xl max-h-[80vh] group"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="text-xs font-mono text-blue-500 overflow-y-auto max-h-[80vh]">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{'01010101'.repeat(4)}</span>
                    <span>{'10101010'.repeat(4)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50"></div>
            
            <div className="relative z-10 overflow-y-auto max-h-[80vh] p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-2">{selectedPrompt.name}</h3>
                  <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                    {getCategoryName(selectedPrompt.categoryId)}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedPrompt(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-4">
                <p className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{selectedPrompt.content}</p>
              </div>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedPrompt.content);
                  alert('已复制到剪贴板');
                }}
                className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                复制提示词
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PromptsPage;