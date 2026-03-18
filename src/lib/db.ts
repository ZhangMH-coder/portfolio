'use server';

// 数据库服务文件
// 封装所有数据库操作，提供统一的接口

import prisma from './prisma';

// 个人信息相关操作
export const profileService = {
  // 获取个人信息
  async getProfile() {
    try {
      const profile = await prisma.profile.findFirst();
      return profile;
    } catch (error) {
      console.error('获取个人信息失败:', error);
      return null;
    }
  },

  // 创建或更新个人信息
  async upsertProfile(data: {
    name: string;
    title: string;
    bio: string;
    avatar?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
  }) {
    try {
      const existingProfile = await prisma.profile.findFirst();
      if (existingProfile) {
        // 更新现有个人信息
        const updatedProfile = await prisma.profile.update({
          where: { id: existingProfile.id },
          data,
        });
        return updatedProfile;
      } else {
        // 创建新个人信息
        const newProfile = await prisma.profile.create({
          data,
        });
        return newProfile;
      }
    } catch (error) {
      console.error('保存个人信息失败:', error);
      throw error;
    }
  },
};

// 技能相关操作
export const skillService = {
  // 获取所有技能
  async getSkills() {
    try {
      const skills = await prisma.skill.findMany();
      return skills;
    } catch (error) {
      console.error('获取技能列表失败:', error);
      return [];
    }
  },

  // 创建技能
  async createSkill(data: {
    name: string;
    description: string;
    level: number;
  }) {
    try {
      const newSkill = await prisma.skill.create({
        data,
      });
      return newSkill;
    } catch (error) {
      console.error('创建技能失败:', error);
      throw error;
    }
  },

  // 更新技能
  async updateSkill(id: string, data: {
    name: string;
    description: string;
    level: number;
  }) {
    try {
      const updatedSkill = await prisma.skill.update({
        where: { id },
        data,
      });
      return updatedSkill;
    } catch (error) {
      console.error('更新技能失败:', error);
      throw error;
    }
  },

  // 删除技能
  async deleteSkill(id: string) {
    try {
      await prisma.skill.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('删除技能失败:', error);
      throw error;
    }
  },
};

// 项目相关操作
export const projectService = {
  // 获取所有项目
  async getProjects() {
    try {
      const projects = await prisma.project.findMany();
      return projects;
    } catch (error) {
      console.error('获取项目列表失败:', error);
      return [];
    }
  },

  // 创建项目
  async createProject(data: {
    title: string;
    description: string;
    images: string[];
    techStack: string[];
    demoLink?: string;
    githubLink?: string;
    isFeatured?: boolean;
  }) {
    try {
      const newProject = await prisma.project.create({
        data: {
          ...data,
          techStack: data.techStack as any,
          images: data.images as any,
        },
      });
      return newProject;
    } catch (error) {
      console.error('创建项目失败:', error);
      throw error;
    }
  },

  // 更新项目
  async updateProject(id: string, data: {
    title: string;
    description: string;
    images: string[];
    techStack: string[];
    demoLink?: string;
    githubLink?: string;
    isFeatured?: boolean;
  }) {
    try {
      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          ...data,
          techStack: data.techStack as any,
          images: data.images as any,
        },
      });
      return updatedProject;
    } catch (error) {
      console.error('更新项目失败:', error);
      throw error;
    }
  },

  // 删除项目
  async deleteProject(id: string) {
    try {
      await prisma.project.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('删除项目失败:', error);
      throw error;
    }
  },
};

// 联系信息相关操作
export const contactInfoService = {
  // 获取联系信息
  async getContactInfo() {
    try {
      const contactInfo = await prisma.contactInfo.findFirst();
      return contactInfo;
    } catch (error) {
      console.error('获取联系信息失败:', error);
      return null;
    }
  },

  // 创建或更新联系信息
  async upsertContactInfo(data: {
    email: string;
    github: string;
    bilibili: string;
  }) {
    try {
      const existingContactInfo = await prisma.contactInfo.findFirst();
      if (existingContactInfo) {
        // 更新现有联系信息
        const updatedContactInfo = await prisma.contactInfo.update({
          where: { id: existingContactInfo.id },
          data,
        });
        return updatedContactInfo;
      } else {
        // 创建新联系信息
        const newContactInfo = await prisma.contactInfo.create({
          data,
        });
        return newContactInfo;
      }
    } catch (error) {
      console.error('保存联系信息失败:', error);
      throw error;
    }
  },
};

// 分类相关操作
export const categoryService = {
  // 获取所有分类
  async getCategories() {
    try {
      const categories = await prisma.category.findMany();
      return categories;
    } catch (error) {
      console.error('获取分类列表失败:', error);
      return [];
    }
  },

  // 创建分类
  async createCategory(data: {
    name: string;
  }) {
    try {
      const newCategory = await prisma.category.create({
        data,
      });
      return newCategory;
    } catch (error) {
      console.error('创建分类失败:', error);
      throw error;
    }
  },

  // 更新分类
  async updateCategory(id: string, data: {
    name: string;
  }) {
    try {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data,
      });
      return updatedCategory;
    } catch (error) {
      console.error('更新分类失败:', error);
      throw error;
    }
  },

  // 删除分类
  async deleteCategory(id: string) {
    try {
      await prisma.category.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('删除分类失败:', error);
      throw error;
    }
  },
};

// 提示词相关操作
export const promptService = {
  // 获取所有提示词
  async getPrompts() {
    try {
      const prompts = await prisma.prompt.findMany();
      return prompts;
    } catch (error) {
      console.error('获取提示词列表失败:', error);
      return [];
    }
  },

  // 创建提示词
  async createPrompt(data: {
    name: string;
    content: string;
    categoryId?: string;
  }) {
    try {
      const newPrompt = await prisma.prompt.create({
        data,
      });
      return newPrompt;
    } catch (error) {
      console.error('创建提示词失败:', error);
      throw error;
    }
  },

  // 更新提示词
  async updatePrompt(id: string, data: {
    name: string;
    content: string;
    categoryId?: string;
  }) {
    try {
      const updatedPrompt = await prisma.prompt.update({
        where: { id },
        data,
      });
      return updatedPrompt;
    } catch (error) {
      console.error('更新提示词失败:', error);
      throw error;
    }
  },

  // 删除提示词
  async deletePrompt(id: string) {
    try {
      await prisma.prompt.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('删除提示词失败:', error);
      throw error;
    }
  },
};

// 指令集相关操作
export const promptSetService = {
  // 获取所有指令集
  async getPromptSets() {
    try {
      const promptSets = await prisma.promptSet.findMany();
      return promptSets;
    } catch (error) {
      console.error('获取指令集列表失败:', error);
      return [];
    }
  },

  // 创建指令集
  async createPromptSet(data: {
    name: string;
    description?: string;
    promptIds: string[];
  }) {
    try {
      const newPromptSet = await prisma.promptSet.create({
        data: {
          ...data,
          promptIds: data.promptIds as any,
        },
      });
      return newPromptSet;
    } catch (error) {
      console.error('创建指令集失败:', error);
      throw error;
    }
  },

  // 更新指令集
  async updatePromptSet(id: string, data: {
    name: string;
    description?: string;
    promptIds: string[];
  }) {
    try {
      const updatedPromptSet = await prisma.promptSet.update({
        where: { id },
        data: {
          ...data,
          promptIds: data.promptIds as any,
        },
      });
      return updatedPromptSet;
    } catch (error) {
      console.error('更新指令集失败:', error);
      throw error;
    }
  },

  // 删除指令集
  async deletePromptSet(id: string) {
    try {
      await prisma.promptSet.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('删除指令集失败:', error);
      throw error;
    }
  },
};

export default {
  profile: profileService,
  skill: skillService,
  project: projectService,
  contactInfo: contactInfoService,
  category: categoryService,
  prompt: promptService,
  promptSet: promptSetService,
};
