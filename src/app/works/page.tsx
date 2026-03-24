'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { imageWorkApi, videoWorkApi } from '../../lib/api';

interface ImageWork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prompt?: string;
  tags: string[];
}

interface VideoWork {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  prompt?: string;
  tags: string[];
}

type TabType = 'images' | 'videos';

const ITEMS_PER_PAGE = 6;

const WorksPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('images');
  const [imageWorks, setImageWorks] = useState<ImageWork[]>([]);
  const [videoWorks, setVideoWorks] = useState<VideoWork[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageWork | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoWork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePage, setImagePage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [imagesData, videosData] = await Promise.all([
          imageWorkApi.getImageWorks(),
          videoWorkApi.getVideoWorks()
        ]);
        setImageWorks(imagesData || []);
        setVideoWorks(videosData || []);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const captureVideoThumbnail = (videoId: string, videoUrl: string) => {
    if (videoThumbnails[videoId]) return;
    
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.currentTime = 0.1;
    
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        setVideoThumbnails(prev => ({ ...prev, [videoId]: thumbnail }));
      }
    };
  };

  const imageTotalPages = Math.ceil(imageWorks.length / ITEMS_PER_PAGE);
  const videoTotalPages = Math.ceil(videoWorks.length / ITEMS_PER_PAGE);
  
  const currentImageWorks = imageWorks.slice(
    (imagePage - 1) * ITEMS_PER_PAGE,
    imagePage * ITEMS_PER_PAGE
  );
  
  const currentVideoWorks = videoWorks.slice(
    (videoPage - 1) * ITEMS_PER_PAGE,
    videoPage * ITEMS_PER_PAGE
  );

  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center gap-2 mt-12">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          上一页
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          下一页
        </button>
      </div>
    );
  };

  const renderImageCards = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentImageWorks.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => setSelectedImage(image)}
            className="glass overflow-hidden cursor-pointer group"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={image.imageUrl} 
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {image.tags && image.tags.length > 0 && (
                <div className="absolute top-2 left-2 flex gap-1">
                  {image.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-2">{image.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{image.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <Pagination 
        currentPage={imagePage} 
        totalPages={imageTotalPages} 
        onPageChange={setImagePage} 
      />
    </>
  );

  const renderVideoCards = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentVideoWorks.map((video, index) => {
          const thumbnail = video.thumbnail || videoThumbnails[video.id];
          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedVideo(video)}
              onViewportEnter={() => {
                if (!video.thumbnail && !videoThumbnails[video.id]) {
                  captureVideoThumbnail(video.id, video.videoUrl);
                }
              }}
              viewport={{ once: true }}
              className="glass overflow-hidden cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                {thumbnail ? (
                  <img 
                    src={thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div 
                    className="w-full h-full bg-gray-800 flex items-center justify-center"
                    ref={(el) => {
                      if (el && !video.thumbnail && !videoThumbnails[video.id]) {
                        captureVideoThumbnail(video.id, video.videoUrl);
                      }
                    }}
                  >
                    <svg className="w-16 h-16 text-gray-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                {video.tags && video.tags.length > 0 && (
                  <div className="absolute top-2 left-2 flex gap-1">
                    {video.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{video.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <Pagination 
        currentPage={videoPage} 
        totalPages={videoTotalPages} 
        onPageChange={setVideoPage} 
      />
    </>
  );

  const renderImageDetailModal = () => {
    if (!selectedImage) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setSelectedImage(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.title}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedImage.title}</h2>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-2">描述</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{selectedImage.description}</p>
            </div>

            {selectedImage.prompt && (
              <div className="mb-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  创作提示词
                </h3>
                <p className="text-gray-300 font-mono text-sm whitespace-pre-wrap">{selectedImage.prompt}</p>
              </div>
            )}

            {selectedImage.tags && selectedImage.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedImage.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderVideoDetailModal = () => {
    if (!selectedVideo) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setSelectedVideo(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="relative">
            <video 
              src={selectedVideo.videoUrl} 
              controls 
              className="w-full max-h-[50vh] object-contain bg-black"
            />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedVideo.title}</h2>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-2">描述</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{selectedVideo.description}</p>
            </div>

            {selectedVideo.prompt && (
              <div className="mb-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  创作提示词
                </h3>
                <p className="text-gray-300 font-mono text-sm whitespace-pre-wrap">{selectedVideo.prompt}</p>
              </div>
            )}

            {selectedVideo.tags && selectedVideo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedVideo.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">作品集</h1>
          <p className="text-gray-400">AI 创作作品展示</p>
        </motion.div>

          <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800/50 rounded-xl p-1">
            <button
              onClick={() => { setActiveTab('images'); setImagePage(1); }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'images'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                图片作品
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('videos'); setVideoPage(1); }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                视频作品
              </span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'images' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'images' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'images' ? (
                imageWorks.length > 0 ? (
                  renderImageCards()
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-500">暂无图片作品</p>
                    <p className="text-gray-600 text-sm mt-2">请在后台管理中添加 AI 图片作品</p>
                  </div>
                )
              ) : videoWorks.length > 0 ? (
                renderVideoCards()
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500">暂无视频作品</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && renderImageDetailModal()}
        {selectedVideo && renderVideoDetailModal()}
      </AnimatePresence>
    </div>
  );
};

export default WorksPage;
