// 项目类型定义

/**
 * 项目类型
 */
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
}

/**
 * 技能类型
 */
export interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  icon?: string;
}

/**
 * 几何形状类型
 */
export interface Shape {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  delay: number;
}

/**
 * 代码片段类型
 */
export type CodeSnippet = string;

/**
 * 技术栈图标映射类型
 */
export type TechIcons = Record<string, string>;

/**
 * API响应类型
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 技能API响应类型
 */
export type SkillsApiResponse = ApiResponse<Skill[]>;

/**
 * 项目API响应类型
 */
export type ProjectsApiResponse = ApiResponse<Project[]>;
