'use client';

import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { Skill } from '@/types';

/**
 * 技能展示组件
 * 展示个人专业技能和技术栈
 * 包含带标签的技能图标和熟练度
 */
const Skills: React.FC = () => {
  /**
   * 技能数据
   * 包含技能名称和熟练度
   */
  const skills: Skill[] = useMemo(() => [
    { id: 1, name: 'React', level: 5, category: '前端', icon: '⚛️' },
    { id: 2, name: 'Next.js', level: 5, category: '前端', icon: '⬢' },
    { id: 3, name: 'TypeScript', level: 5, category: '前端', icon: 'TS' },
    { id: 4, name: 'Tailwind CSS', level: 5, category: '前端', icon: '💨' },
    { id: 5, name: 'Framer Motion', level: 4, category: '前端', icon: '✨' },
    { id: 6, name: 'Node.js', level: 4, category: '后端', icon: '🟢' },
    { id: 7, name: 'Express', level: 4, category: '后端', icon: '⚡' },
    { id: 8, name: 'MongoDB', level: 4, category: '后端', icon: '🍃' },
    { id: 9, name: 'UI/UX设计', level: 4, category: '设计', icon: '🎨' },
    { id: 10, name: 'Figma', level: 4, category: '设计', icon: '🎯' },
    { id: 11, name: 'Git', level: 5, category: '工具', icon: '🔧' },
    { id: 12, name: 'Docker', level: 3, category: '工具', icon: '🐳' },
  ], []);

  /**
   * 获取技能熟练度文本
   * @param level 技能等级 (1-5)
   * @returns 熟练度文本
   */
  const getLevelText = useMemo(() => {
    const levels = ['基础', '熟悉', '熟练', '精通', '专家'];
    return (level: number): string => {
      return levels[Math.min(level - 1, 4)];
    };
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
          <h2 className="text-4xl font-bold mb-4">专业技能</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            我掌握的技术栈和工具，以及我的专业领域
          </p>
        </motion.div>

        {/* 技能网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
              viewport={{ once: true }}
              className="glass p-6 text-center hover:bg-opacity-10 transition-all duration-300"
              style={{
                willChange: 'transform, opacity'
              }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-xl font-bold">{skill.icon || skill.name.charAt(0)}</span>
              </div>
              <h3 className="font-medium mb-1">{skill.name}</h3>
              <p className="text-sm text-gray-400">{getLevelText(skill.level)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Skills);