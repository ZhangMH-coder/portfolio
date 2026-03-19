// API 服务文件
// 封装所有 API 调用，提供统一的接口

// 个人信息相关 API
export const profileApi = {
  // 获取个人信息
  async getProfile() {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('获取个人信息失败');
      }
      return await response.json();
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
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('保存个人信息失败');
      }
      return await response.json();
    } catch (error) {
      console.error('保存个人信息失败:', error);
      throw error;
    }
  },
};

// 技能相关 API
export const skillApi = {
  // 获取所有技能
  async getSkills() {
    try {
      const response = await fetch('/api/skills');
      if (!response.ok) {
        throw new Error('获取技能列表失败');
      }
      return await response.json();
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
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('创建技能失败');
      }
      return await response.json();
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
      const response = await fetch('/api/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      });
      if (!response.ok) {
        throw new Error('更新技能失败');
      }
      return await response.json();
    } catch (error) {
      console.error('更新技能失败:', error);
      throw error;
    }
  },

  // 删除技能
  async deleteSkill(id: string) {
    try {
      const response = await fetch('/api/skills', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('删除技能失败');
      }
      return true;
    } catch (error) {
      console.error('删除技能失败:', error);
      throw error;
    }
  },
};

export default {
  profile: profileApi,
  skill: skillApi,
};

// 项目相关 API
export const projectApi = {
  async getProjects() {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('获取项目失败');
      return await response.json();
    } catch (error) {
      console.error('获取项目失败:', error);
      return [];
    }
  },
  async createProject(data: any) {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('创建项目失败');
    return await response.json();
  },
  async updateProject(id: string, data: any) {
    const response = await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error('更新项目失败');
    return await response.json();
  },
  async deleteProject(id: string) {
    const response = await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('删除项目失败');
    return true;
  },
};

// 提示词相关 API
export const promptApi = {
  async getPrompts() {
    try {
      const response = await fetch('/api/prompts');
      if (!response.ok) throw new Error('获取提示词失败');
      return await response.json();
    } catch (error) {
      console.error('获取提示词失败:', error);
      return [];
    }
  },
  async createPrompt(data: any) {
    const response = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('创建提示词失败');
    return await response.json();
  },
  async updatePrompt(id: string, data: any) {
    const response = await fetch('/api/prompts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error('更新提示词失败');
    return await response.json();
  },
  async deletePrompt(id: string) {
    const response = await fetch('/api/prompts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('删除提示词失败');
    return true;
  },
};

// 分类相关 API
export const categoryApi = {
  async getCategories() {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('获取分类失败');
      return await response.json();
    } catch (error) {
      console.error('获取分类失败:', error);
      return [];
    }
  },
  async createCategory(data: any) {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('创建分类失败');
    return await response.json();
  },
  async updateCategory(id: string, data: any) {
    const response = await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error('更新分类失败');
    return await response.json();
  },
  async deleteCategory(id: string) {
    const response = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('删除分类失败');
    return true;
  },
};

// 指令集相关 API
export const promptSetApi = {
  async getPromptSets() {
    try {
      const response = await fetch('/api/prompt-sets');
      if (!response.ok) throw new Error('获取指令集失败');
      return await response.json();
    } catch (error) {
      console.error('获取指令集失败:', error);
      return [];
    }
  },
  async createPromptSet(data: any) {
    const response = await fetch('/api/prompt-sets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('创建指令集失败');
    return await response.json();
  },
  async updatePromptSet(id: string, data: any) {
    const response = await fetch('/api/prompt-sets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error('更新指令集失败');
    return await response.json();
  },
  async deletePromptSet(id: string) {
    const response = await fetch('/api/prompt-sets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('删除指令集失败');
    return true;
  },
};

// 图片库相关 API
export const managedImageApi = {
  async getImages() {
    try {
      const response = await fetch('/api/managed-images');
      if (!response.ok) throw new Error('获取图片库失败');
      return await response.json();
    } catch (error) {
      console.error('获取图片库失败:', error);
      return [];
    }
  },
  async addImage(url: string) {
    const response = await fetch('/api/managed-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) throw new Error('添加图片失败');
    return await response.json();
  },
  async deleteImage(id: string) {
    const response = await fetch('/api/managed-images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('删除图片失败');
    return true;
  },
};

// 联系信息相关 API
export const contactInfoApi = {
  async getContactInfo() {
    try {
      const response = await fetch('/api/contact-info');
      if (!response.ok) throw new Error('获取联系信息失败');
      return await response.json();
    } catch (error) {
      console.error('获取联系信息失败:', error);
      return null;
    }
  },
  async saveContactInfo(data: {
    email: string;
    github: string;
    bilibili: string;
  }) {
    try {
      const response = await fetch('/api/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('保存联系信息失败');
      return await response.json();
    } catch (error) {
      console.error('保存联系信息失败:', error);
      throw error;
    }
  },
};

// 视频作品相关 API
export const videoWorkApi = {
  async getVideoWorks() {
    try {
      const response = await fetch('/api/video-works');
      if (!response.ok) throw new Error('获取视频作品失败');
      return await response.json();
    } catch (error) {
      console.error('获取视频作品失败:', error);
      return [];
    }
  },
  async createVideoWork(data: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnail?: string;
    prompt?: string;
    tags?: string[];
    isFeatured?: boolean;
  }) {
    const response = await fetch('/api/video-works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('创建视频作品失败');
    return await response.json();
  },
  async updateVideoWork(id: string, data: any) {
    const response = await fetch('/api/video-works', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error('更新视频作品失败');
    return await response.json();
  },
  async deleteVideoWork(id: string) {
    const response = await fetch('/api/video-works', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('删除视频作品失败');
    return true;
  },
};

// AI图片作品相关 API
export const imageWorkApi = {
  async getImageWorks() {
    try {
      const response = await fetch('/api/image-works');
      if (!response.ok) throw new Error('获取图片作品失败');
      return await response.json();
    } catch (error) {
      console.error('获取图片作品失败:', error);
      return [];
    }
  },
  async createImageWork(data: {
    title: string;
    description: string;
    imageUrl: string;
    prompt?: string;
    tags?: string[];
    isFeatured?: boolean;
  }) {
    const response = await fetch('/api/image-works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('创建图片作品失败');
    return await response.json();
  },
  async updateImageWork(id: string, data: any) {
    const response = await fetch('/api/image-works', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error('更新图片作品失败');
    return await response.json();
  },
  async deleteImageWork(id: string) {
    const response = await fetch('/api/image-works', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('删除图片作品失败');
    return true;
  },
};