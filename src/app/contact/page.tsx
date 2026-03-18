'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contactInfoApi } from '../../lib/api';

// 联系信息类型定义
interface ContactInfo {
  email: string;
  github: string;
  bilibili: string;
}

// 卡片组件
const ContactCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay: number;
}> = ({ icon, label, value, href, delay }) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.2)"
      }}
      className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-lg overflow-hidden group cursor-pointer"
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="text-xs font-mono text-blue-500">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <span>{'01010101'.repeat(4)}</span>
              <span>{'10101010'.repeat(4)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-white font-medium truncate">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
};

/**
 * 联系页面组件
 * 显示联系信息和社交媒体链接
 */
const ContactPage: React.FC = () => {
  // 联系信息状态
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '2954929104@qq.com',
    github: 'https://github.com/ZhangMH-coder/',
    bilibili: 'https://space.bilibili.com/380750498?spm_id_from=333.1007.0.0'
  });

  // 从 API 加载数据
  useEffect(() => {
    const loadContactInfo = async () => {
      const data = await contactInfoApi.getContactInfo();
      if (data) {
        setContactInfo(data);
      }
    };
    loadContactInfo();
  }, []);

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white"
          >
            联系我
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 shadow-lg overflow-hidden"
          >
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
            
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50"></div>
            
            <div className="relative z-10">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-gray-300 mb-8 text-center"
              >
                如果您对我的作品感兴趣，或者有任何问题，欢迎通过以下方式联系我
              </motion.p>
              
              <div className="space-y-4">
                {/* 邮箱信息 */}
                <ContactCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  label="邮箱"
                  value={contactInfo.email}
                  href={`mailto:${contactInfo.email}`}
                  delay={0.4}
                />
                
                {/* GitHub */}
                <ContactCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  }
                  label="GitHub"
                  value="访问我的 GitHub 主页"
                  href={contactInfo.github}
                  delay={0.5}
                />
                
                {/* Bilibili */}
                <ContactCard
                  icon={
                    <img src="/icons/bilibili.png" alt="Bilibili" className="h-6 w-6" />
                  }
                  label="Bilibili"
                  value="关注我的 B 站频道"
                  href={contactInfo.bilibili}
                  delay={0.6}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;