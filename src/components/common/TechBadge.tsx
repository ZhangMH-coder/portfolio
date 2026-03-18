import React from 'react';

/**
 * 技术栈徽章组件
 * @param props 组件属性
 * @param props.tech 技术名称
 * @param props.icon 技术图标
 */
interface TechBadgeProps {
  tech: string;
  icon: string;
}

export const TechBadge: React.FC<TechBadgeProps> = ({ tech, icon }) => {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-800/50 text-gray-300 text-xs backdrop-blur-sm border border-gray-700/50">
      <span className="text-sm">{icon}</span>
      <span>{tech}</span>
    </span>
  );
};
