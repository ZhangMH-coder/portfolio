'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profileApi, skillApi } from '../../lib/api';

// 技能类型定义
interface Skill {
  id: number;
  name: string;
  level: string;
  icon: string;
}

// 个人信息类型定义
interface Profile {
  name: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
}

/**
 * 关于页面组件
 * 包含头像插图、技能标签气泡、干净布局和柔和渐变背景
 * 从localStorage读取数据，只负责展示
 */
const AboutPage = () => {
  // 状态管理
  const [avatar, setAvatar] = useState<string>('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20portrait%20dark%20theme&image_size=square');
  const [name, setName] = useState('崖岸岸');
  const [title, setTitle] = useState('前端开发工程师');
  const [bio, setBio] = useState('专注于现代前端开发和用户体验设计，致力于创建高质量的数字产品和解决方案。拥有多年的React、Next.js和TypeScript开发经验，热爱学习新技术和解决复杂问题。');
  const [email, setEmail] = useState('2954929104@qq.com');
  const [phone, setPhone] = useState('138****8888');
  const [location, setLocation] = useState('中国');
  
  // 技能数据
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: 'React', level: '精通', icon: '⚛️' },
    { id: 2, name: 'Next.js', level: '精通', icon: '⬢' },
    { id: 3, name: 'TypeScript', level: '精通', icon: 'TS' },
    { id: 4, name: 'Tailwind CSS', level: '精通', icon: '💨' },
    { id: 5, name: 'Framer Motion', level: '熟练', icon: '✨' },
    { id: 6, name: 'Node.js', level: '熟练', icon: '🟢' },
    { id: 7, name: 'Express', level: '熟练', icon: '⚡' },
    { id: 8, name: 'MongoDB', level: '熟练', icon: '🍃' },
    { id: 9, name: 'UI/UX设计', level: '熟练', icon: '🎨' },
    { id: 10, name: 'Figma', level: '熟练', icon: '🎯' },
  ]);

  // 从 API 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载个人信息
        const profileData = await profileApi.getProfile();
        if (profileData) {
          setName(profileData.name || name);
          setTitle(profileData.title || title);
          setBio(profileData.bio || bio);
          setAvatar(profileData.avatar || avatar);
          setEmail(profileData.email || email);
          setPhone(profileData.phone || phone);
          setLocation(profileData.location || location);
        }

        // 加载技能数据
        const skillsData = await skillApi.getSkills();
        if (skillsData.length > 0) {
          // 转换技能数据格式以匹配前端需要的格式
          const formattedSkills = skillsData.map((skill: any, index: number) => ({
            id: index + 1,
            name: skill.name,
            level: skill.level > 80 ? '精通' : skill.level > 60 ? '熟练' : '基础',
            icon: getSkillIcon(skill.name)
          }));
          setSkills(formattedSkills);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };

    loadData();
  }, []);

  // 根据技能名称获取图标
  const getSkillIcon = (skillName: string): string => {
    const iconMap: Record<string, string> = {
      'React': '⚛️',
      'Next.js': '⬢',
      'TypeScript': 'TS',
      'Tailwind CSS': '💨',
      'Framer Motion': '✨',
      'Node.js': '🟢',
      'Express': '⚡',
      'MongoDB': '🍃',
      'UI/UX设计': '🎨',
      'Figma': '🎯'
    };
    return iconMap[skillName] || '📦';
  };

  return (
    <section className="py-20 min-h-screen">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">关于我</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            了解我的背景、技能和经历
          </p>
        </motion.div>

        {/* 主要内容 */}
        <div className="max-w-4xl mx-auto">
          {/* 个人信息卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 mb-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* 头像部分 */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/30"
                >
                  <img
                    src={avatar}
                    alt="个人头像"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* 个人信息部分 */}
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-bold">{name}</h2>
                  <p className="text-xl text-primary">{title}</p>
                  <p className="text-gray-400">{bio}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 md:col-span-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <circle cx="12" cy="10" r="3" />
                        <path d="M17.65 6.35A9.46 9.46 0 0 1 21 12.5a9.46 9.46 0 0 1-3.35 5.15A9.46 9.46 0 0 1 12.5 21a9.46 9.46 0 0 1-5.15-3.35A9.46 9.46 0 0 1 3 12.5a9.46 9.46 0 0 1 3.35-5.15A9.46 9.46 0 0 1 12.5 3" />
                      </svg>
                      <span>{location}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* 技能部分 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">专业技能</h2>
            </div>

            {/* 技能标签气泡 */}
            <div className="flex flex-wrap gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="glass px-4 py-3 rounded-full flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{skill.icon}</span>
                    <span>{skill.name}</span>
                    <span className="text-xs text-gray-400">({skill.level})</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;