'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profileApi, skillApi, projectApi, promptApi, categoryApi, promptSetApi, managedImageApi, contactInfoApi } from '../../lib/api';

// 项目类型定义
interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  techStack: string[];
  demoLink?: string;
  githubLink?: string;
  isFeatured?: boolean;
}

// 技能类型定义
interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
}

// 个人信息类型定义
interface Profile {
  name: string;
  bio: string;
  avatar: string | null;
  email: string;
  phone: string;
  location: string;
  title: string;
}

// 联系信息类型定义
interface ContactInfo {
  email: string;
  github: string;
  bilibili: string;
}

// 提示词类型定义
interface Prompt {
  id: string;
  name: string;
  content: string;
  categoryId: string;
}

// 分类类型定义
interface Category {
  id: string;
  name: string;
}

// 指令集类型定义
interface PromptSet {
  id: string;
  name: string;
  description: string;
  promptIds: string[];
}

/**
 * 后台管理页面
 * 包含项目管理、技能管理和个人信息管理功能
 */
const AdminPage: React.FC = () => {
  // 当前选中的管理选项
  const [activeTab, setActiveTab] = useState('projects');
  // 项目列表
  const [projects, setProjects] = useState<Project[]>([]);
  // 技能列表
  const [skills, setSkills] = useState<Skill[]>([]);
  // 个人信息
  const [profile, setProfile] = useState<Profile>({
    name: '',
    bio: '',
    avatar: null,
    email: '',
    phone: '',
    location: '',
    title: ''
  });
  // 联系信息
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '2954929104@qq.com',
    github: 'https://github.com/ZhangMH-coder/',
    bilibili: 'https://space.bilibili.com/380750498?spm_id_from=333.1007.0.0'
  });
  // 提示词列表
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  // 分类列表
  const [categories, setCategories] = useState<Category[]>([]);
  // 指令集列表
  const [promptSets, setPromptSets] = useState<PromptSet[]>([]);
  // 编辑状态
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSet, setEditingSet] = useState<PromptSet | null>(null);
  // 表单状态
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    images: [],
    techStack: [],
    demoLink: '',
    githubLink: '',
    isFeatured: false
  });
  const [skillFormData, setSkillFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    description: '',
    level: 50
  });
  const [profileFormData, setProfileFormData] = useState<Profile>({
    name: '',
    bio: '',
    avatar: null,
    email: '',
    phone: '',
    location: '',
    title: ''
  });
  const [contactFormData, setContactFormData] = useState<ContactInfo>({
    email: '',
    github: '',
    bilibili: ''
  });
  const [promptFormData, setPromptFormData] = useState<Omit<Prompt, 'id'>>({
    name: '',
    content: '',
    categoryId: ''
  });
  const [categoryFormData, setCategoryFormData] = useState<Omit<Category, 'id'>>({
    name: ''
  });
  const [promptSetFormData, setPromptSetFormData] = useState<Omit<PromptSet, 'id'>>({
    name: '',
    description: '',
    promptIds: []
  });
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({
    title: '',
    description: '',
    name: '',
    email: '',
    bio: ''
  });
  // 技术栈输入
  const [techStackInput, setTechStackInput] = useState('');
  // 模态框状态
  const [showModal, setShowModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  // 模态框标题
  const [modalTitle, setModalTitle] = useState('添加项目');
  const [skillModalTitle, setSkillModalTitle] = useState('添加技能');
  const [promptModalTitle, setPromptModalTitle] = useState('添加提示词');
  const [categoryModalTitle, setCategoryModalTitle] = useState('添加分类');
  const [promptSetModalTitle, setPromptSetModalTitle] = useState('添加指令集');
  // 云端图片列表
  const [cloudImages, setCloudImages] = useState<string[]>([]);
  const [showCloudPicker, setShowCloudPicker] = useState(false);
  const [isLoadingCloudImages, setIsLoadingCloudImages] = useState(false);
  // 头像上传状态
  const [isUploading, setIsUploading] = useState(false);
  // 图片管理
  const [showImageManager, setShowImageManager] = useState(false);
  const [managedImages, setManagedImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // 项目图片上传状态
  const [isUploadingProjectImage, setIsUploadingProjectImage] = useState(false);

  // 加载已管理的图片
  useEffect(() => {
    const loadManagedImages = async () => {
      try {
        const images = await managedImageApi.getImages();
        if (images && images.length > 0) {
          setManagedImages(images.map((img: any) => img.url));
        }
      } catch (error) {
        console.error('加载图片库失败:', error);
      }
    };
    loadManagedImages();
  }, []);

  // 保存图片到管理列表
  const addManagedImage = async () => {
    if (newImageUrl.trim()) {
      try {
        await managedImageApi.addImage(newImageUrl.trim());
        const updated = [newImageUrl.trim(), ...managedImages.filter(img => img !== newImageUrl.trim())];
        setManagedImages(updated);
        setNewImageUrl('');
        alert('图片添加成功');
      } catch (error) {
        console.error('添加图片失败:', error);
        alert('添加图片失败，请重试');
      }
    }
  };

  // 删除管理的图片
  const removeManagedImage = async (url: string) => {
    try {
      const images = await managedImageApi.getImages();
      const imageToDelete = images.find((img: any) => img.url === url);
      if (imageToDelete) {
        await managedImageApi.deleteImage(imageToDelete.id);
      }
      const updated = managedImages.filter(img => img !== url);
      setManagedImages(updated);
    } catch (error) {
      console.error('删除图片失败:', error);
      alert('删除图片失败，请重试');
    }
  };

  // 处理项目图片上传
  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      
      // 验证文件大小（限制 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
      }
      
      setIsUploadingProjectImage(true);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        
        // 添加到表单图片列表
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64Url]
        }));
        
        setIsUploadingProjectImage(false);
        alert('图片上传成功');
      };
      
      reader.onerror = () => {
        setIsUploadingProjectImage(false);
        alert('图片上传失败，请重试');
      };
      
      reader.readAsDataURL(file);
    }
  };

  // 从 API 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载项目数据
        const projectsData = await projectApi.getProjects();
        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData);
        } else {
          setProjects([]);
        }

        // 加载技能数据
        const skillsData = await skillApi.getSkills();
        if (skillsData.length > 0) {
          setSkills(skillsData);
        } else {
          // 初始化默认技能数据
          const defaultSkills: Skill[] = [
            {
              id: '1',
              name: 'React',
              description: '前端JavaScript库',
              level: 90
            },
            {
              id: '2',
              name: 'Next.js',
              description: 'React框架',
              level: 85
            },
            {
              id: '3',
              name: 'Tailwind CSS',
              description: '实用优先的CSS框架',
              level: 80
            },
            {
              id: '4',
              name: 'TypeScript',
              description: 'JavaScript超集',
              level: 75
            },
            {
              id: '5',
              name: 'Framer Motion',
              description: '动画库',
              level: 70
            },
            {
              id: '6',
              name: 'Node.js',
              description: 'JavaScript运行时',
              level: 65
            }
          ];
          setSkills(defaultSkills);
          // 保存到数据库
          for (const skill of defaultSkills) {
            await skillApi.createSkill(skill);
          }
        }

        // 加载个人信息
        const profileData = await profileApi.getProfile();
        if (profileData) {
          setProfile(profileData);
          setProfileFormData(profileData);
        } else {
          // 初始化默认个人信息
          const defaultProfile: Profile = {
            name: '崖岸岸',
            bio: '全栈开发工程师，专注于前端和后端技术，热爱创造高质量的Web应用。',
            avatar: 'https://via.placeholder.com/200/333/fff?text=Avatar',
            email: '2954929104@qq.com',
            phone: '138****8888',
            location: '中国',
            title: '前端开发工程师'
          };
          setProfile(defaultProfile);
          setProfileFormData(defaultProfile);
          // 保存到数据库
          await profileApi.upsertProfile(defaultProfile);
        }

        // 加载联系信息
        const contactData = await contactInfoApi.getContactInfo();
        if (contactData) {
          setContactInfo(contactData);
          setContactFormData(contactData);
        } else {
          // 初始化默认联系信息
          const defaultContactInfo: ContactInfo = {
            email: '2954929104@qq.com',
            github: 'https://github.com/ZhangMH-coder/',
            bilibili: 'https://space.bilibili.com/380750498?spm_id_from=333.1007.0.0'
          };
          setContactInfo(defaultContactInfo);
          setContactFormData(defaultContactInfo);
          await contactInfoApi.saveContactInfo(defaultContactInfo);
        }

        // 加载提示词数据
        const promptsData = await promptApi.getPrompts();
        if (promptsData && promptsData.length > 0) {
          setPrompts(promptsData);
        } else {
          setPrompts([]);
        }

        // 加载分类数据
        const categoriesData = await categoryApi.getCategories();
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          setCategories([]);
        }

        // 加载指令集数据
        const promptSetsData = await promptSetApi.getPromptSets();
        if (promptSetsData && promptSetsData.length > 0) {
          setPromptSets(promptSetsData);
        } else {
          setPromptSets([]);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };

    loadData();
  }, []);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    handleRealTimeValidation('project', name, value);
  };

  // 处理个人信息表单输入变化
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({ ...prev, [name]: value }));
    handleRealTimeValidation('profile', name, value);
  };

  // 处理头像上传
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
        
      // 验证文件大小（限制 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
      }
        
      setIsUploading(true);
        
      try {
        // 使用 FileReader 读取文件并转换为 base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
          
        reader.onloadend = async () => {
          const newAvatarUrl = reader.result as string;
            
          try {
            // 更新表单数据
            setProfileFormData(prev => ({
              ...prev,
              avatar: newAvatarUrl
            }));
              
            // 同时更新 profile 状态
            setProfile(prev => ({
              ...prev,
              avatar: newAvatarUrl
            }));
              
            // 调用 API 保存到数据库
            const profileData = {
              ...profileFormData,
              avatar: newAvatarUrl
            };
            const updatedProfile = await profileApi.upsertProfile(profileData);
              
            // 更新状态为最新数据
            setProfile(updatedProfile);
            setProfileFormData(updatedProfile);
              
            setIsUploading(false);
            alert('头像上传成功！关于页面将同步更新。');
          } catch (error) {
            console.error('保存头像失败:', error);
            setIsUploading(false);
            alert('保存头像失败，请重试');
          }
        };
          
        reader.onerror = () => {
          setIsUploading(false);
          alert('头像上传失败，请重试');
        };
      } catch (error) {
        console.error('头像上传错误:', error);
        setIsUploading(false);
        alert('头像上传失败，请重试');
      }
    }
  };

  // 处理保存个人信息
  const handleSaveProfile = async () => {
    if (!validateForm('profile')) {
      return;
    }

    try {
      // 调用 API 保存到数据库
      const updatedProfile = await profileApi.upsertProfile(profileFormData);
      
      // 更新状态
      setProfile(updatedProfile);
      setProfileFormData(updatedProfile);
      
      alert('个人信息已更新！关于页面将同步显示。');
    } catch (error) {
      console.error('保存个人信息失败:', error);
      alert('保存个人信息失败，请重试');
    }
  };

  // 处理技术栈添加
  const handleAddTechStack = () => {
    if (techStackInput.trim() && !formData.techStack.includes(techStackInput.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        techStack: [...prev.techStack, techStackInput.trim()] 
      }));
      setTechStackInput('');
    }
  };

  // 处理技术栈删除
  const handleRemoveTechStack = (tech: string) => {
    setFormData(prev => ({ 
      ...prev, 
      techStack: prev.techStack.filter(t => t !== tech) 
    }));
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

  // 表单验证函数
  const validateForm = (formType: string) => {
    const errors: Record<string, string> = {};
    
    switch (formType) {
      case 'project':
        if (!formData.title.trim()) {
          errors.title = '请输入项目标题';
        }
        if (!formData.description.trim()) {
          errors.description = '请输入项目描述';
        }
        if (formData.demoLink && !isValidUrl(formData.demoLink)) {
          errors.demoLink = '请输入有效的演示链接';
        }
        if (formData.githubLink && !isValidUrl(formData.githubLink)) {
          errors.githubLink = '请输入有效的 GitHub 链接';
        }
        break;
      case 'skill':
        if (!skillFormData.name.trim()) {
          errors.name = '请输入技能名称';
        }
        if (!skillFormData.description.trim()) {
          errors.description = '请输入技能描述';
        }
        if (skillFormData.level < 0 || skillFormData.level > 100) {
          errors.level = '熟练度必须在 0-100 之间';
        }
        break;
      case 'profile':
        if (!profileFormData.name.trim()) {
          errors.name = '请输入姓名';
        }
        if (!profileFormData.bio.trim()) {
          errors.bio = '请输入个人简介';
        }
        if (profileFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileFormData.email)) {
          errors.email = '请输入有效的邮箱地址';
        }
        break;
      case 'contact':
        if (!contactFormData.email.trim()) {
          errors.email = '请输入邮箱';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactFormData.email)) {
          errors.email = '请输入有效的邮箱地址';
        }
        if (contactFormData.github && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(contactFormData.github)) {
          errors.github = '请输入有效的 GitHub 链接';
        }
        if (contactFormData.bilibili && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(contactFormData.bilibili)) {
          errors.bilibili = '请输入有效的 Bilibili 链接';
        }
        break;
      case 'prompt':
        if (!promptFormData.name.trim()) {
          errors.name = '请输入提示词名称';
        }
        if (!promptFormData.content.trim()) {
          errors.description = '请输入提示词内容';
        }
        break;
      case 'category':
        if (!categoryFormData.name.trim()) {
          errors.name = '请输入分类名称';
        }
        break;
      case 'set':
        if (!promptSetFormData.name.trim()) {
          errors.name = '请输入指令集名称';
        }
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 实时验证函数
  const handleRealTimeValidation = (formType: string, field: string, value: string) => {
    const errors = { ...formErrors };
    
    switch (formType) {
      case 'project':
        if (field === 'title' && !value.trim()) {
          errors.title = '请输入项目标题';
        } else if (field === 'title' && value.trim()) {
          delete errors.title;
        }
        if (field === 'description' && !value.trim()) {
          errors.description = '请输入项目描述';
        } else if (field === 'description' && value.trim()) {
          delete errors.description;
        }
        if (field === 'image') {
          if (!value.trim()) {
            errors.image = '请输入项目图片 URL';
          } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
            errors.image = '请输入有效的图片 URL';
          } else {
            delete errors.image;
          }
        }
        if (field === 'demoLink' && value) {
          if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
            errors.demoLink = '请输入有效的演示链接';
          } else {
            delete errors.demoLink;
          }
        } else if (field === 'demoLink' && !value) {
          delete errors.demoLink;
        }
        if (field === 'githubLink' && value) {
          if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
            errors.githubLink = '请输入有效的 GitHub 链接';
          } else {
            delete errors.githubLink;
          }
        } else if (field === 'githubLink' && !value) {
          delete errors.githubLink;
        }
        break;
      case 'contact':
        if (field === 'email') {
          if (!value.trim()) {
            errors.email = '请输入邮箱';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.email = '请输入有效的邮箱地址';
          } else {
            delete errors.email;
          }
        }
        if (field === 'github' && value) {
          if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
            errors.github = '请输入有效的 GitHub 链接';
          } else {
            delete errors.github;
          }
        } else if (field === 'github' && !value) {
          delete errors.github;
        }
        if (field === 'bilibili' && value) {
          if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
            errors.bilibili = '请输入有效的 Bilibili 链接';
          } else {
            delete errors.bilibili;
          }
        } else if (field === 'bilibili' && !value) {
          delete errors.bilibili;
        }
        break;
      case 'profile':
        if (field === 'name' && !value.trim()) {
          errors.name = '请输入姓名';
        } else if (field === 'name' && value.trim()) {
          delete errors.name;
        }
        if (field === 'bio' && !value.trim()) {
          errors.bio = '请输入个人简介';
        } else if (field === 'bio' && value.trim()) {
          delete errors.bio;
        }
        if (field === 'email' && value) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.email = '请输入有效的邮箱地址';
          } else {
            delete errors.email;
          }
        } else if (field === 'email' && !value) {
          delete errors.email;
        }
        break;
    }
    
    setFormErrors(errors);
  };

  // 处理添加项目
  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({ 
      title: '', 
      description: '', 
      images: [], 
      techStack: [],
      demoLink: '',
      githubLink: '',
      isFeatured: false
    });
    setModalTitle('添加项目');
    setShowModal(true);
  };

  // 处理编辑项目
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({ 
      title: project.title, 
      description: project.description, 
      images: project.images || [], 
      techStack: [...project.techStack],
      demoLink: project.demoLink || '',
      githubLink: project.githubLink || '',
      isFeatured: project.isFeatured || false
    });
    setModalTitle('编辑项目');
    setShowModal(true);
  };

  // 处理删除项目
  const handleDeleteProject = async (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      try {
        await projectApi.deleteProject(id);
        const updatedProjects = projects.filter(project => project.id !== id);
        setProjects(updatedProjects);
      } catch (error) {
        console.error('删除项目失败:', error);
        alert('删除项目失败，请重试');
      }
    }
  };
  
  // 处理精选项目切换
  const toggleFeaturedProject = async (id: string) => {
    const projectToUpdate = projects.find(p => p.id === id);
    if (projectToUpdate) {
      try {
        const updatedProject = await projectApi.updateProject(id, {
          ...projectToUpdate,
          isFeatured: !projectToUpdate.isFeatured
        });
        const updatedProjects = projects.map(project => 
          project.id === id ? updatedProject : project
        );
        setProjects(updatedProjects);
      } catch (error) {
        console.error('更新精选状态失败:', error);
        alert('更新精选状态失败，请重试');
      }
    }
  };

  // 处理保存项目
  const handleSaveProject = async () => {
    if (!validateForm('project')) {
      return;
    }

    try {
      if (editingProject) {
        // 编辑现有项目
        const updatedProject = await projectApi.updateProject(editingProject.id, formData);
        const updatedProjects = projects.map(project => 
          project.id === editingProject.id ? updatedProject : project
        );
        setProjects(updatedProjects);
      } else {
        // 添加新项目
        const newProject = await projectApi.createProject(formData);
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
      }

      setShowModal(false);
    } catch (error) {
      console.error('保存项目失败:', error);
      alert('保存项目失败，请重试');
    }
  };

  // 处理技能表单输入变化
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSkillFormData(prev => ({ ...prev, [name]: name === 'level' ? parseInt(value) : value }));
  };

  // 处理添加技能
  const handleAddSkill = () => {
    setEditingSkill(null);
    setSkillFormData({ 
      name: '', 
      description: '', 
      level: 50
    });
    setSkillModalTitle('添加技能');
    setShowSkillModal(true);
  };

  // 处理编辑技能
  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillFormData({ 
      name: skill.name, 
      description: skill.description, 
      level: skill.level
    });
    setSkillModalTitle('编辑技能');
    setShowSkillModal(true);
  };

  // 处理删除技能
  const handleDeleteSkill = async (id: string) => {
    if (confirm('确定要删除这个技能吗？')) {
      try {
        await skillApi.deleteSkill(id);
        setSkills(prev => prev.filter(skill => skill.id !== id));
      } catch (error) {
        console.error('删除技能失败:', error);
        alert('删除技能失败，请重试');
      }
    }
  };

  // 处理保存技能
  const handleSaveSkill = async () => {
    if (!validateForm('skill')) {
      return;
    }

    try {
      if (editingSkill) {
        // 编辑现有技能
        const updatedSkill = await skillApi.updateSkill(editingSkill.id, skillFormData);
        setSkills(prev => prev.map(skill => 
          skill.id === editingSkill.id ? updatedSkill : skill
        ));
      } else {
        // 添加新技能
        const newSkill = await skillApi.createSkill(skillFormData);
        setSkills(prev => [...prev, newSkill]);
      }

      setShowSkillModal(false);
    } catch (error) {
      console.error('保存技能失败:', error);
      alert('保存技能失败，请重试');
    }
  };

  // 处理联系信息表单输入变化
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
    handleRealTimeValidation('contact', name, value);
  };

  // 处理保存联系信息
  const handleSaveContact = async () => {
    if (!validateForm('contact')) {
      return;
    }

    try {
      await contactInfoApi.saveContactInfo(contactFormData);
      setContactInfo(contactFormData);
      setShowContactModal(false);
      alert('联系信息已更新');
    } catch (error) {
      console.error('保存联系信息失败:', error);
      alert('保存联系信息失败，请重试');
    }
  };

  // 处理提示词表单输入变化
  const handlePromptInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPromptFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理添加提示词
  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setPromptFormData({ 
      name: '', 
      content: '', 
      categoryId: ''
    });
    setPromptModalTitle('添加提示词');
    setShowPromptModal(true);
  };

  // 处理编辑提示词
  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setPromptFormData({ 
      name: prompt.name, 
      content: prompt.content, 
      categoryId: prompt.categoryId
    });
    setPromptModalTitle('编辑提示词');
    setShowPromptModal(true);
  };

  // 处理删除提示词
  const handleDeletePrompt = async (id: string) => {
    if (confirm('确定要删除这个提示词吗？')) {
      try {
        await promptApi.deletePrompt(id);
        const updatedPrompts = prompts.filter(prompt => prompt.id !== id);
        setPrompts(updatedPrompts);
      } catch (error) {
        console.error('删除提示词失败:', error);
        alert('删除提示词失败，请重试');
      }
    }
  };

  // 处理保存提示词
  const handleSavePrompt = async () => {
    if (!validateForm('prompt')) {
      return;
    }

    try {
      if (editingPrompt) {
        // 编辑现有提示词
        const updatedPrompt = await promptApi.updatePrompt(editingPrompt.id, promptFormData);
        const updatedPrompts = prompts.map(prompt => 
          prompt.id === editingPrompt.id ? updatedPrompt : prompt
        );
        setPrompts(updatedPrompts);
      } else {
        // 添加新提示词
        const newPrompt = await promptApi.createPrompt(promptFormData);
        const updatedPrompts = [...prompts, newPrompt];
        setPrompts(updatedPrompts);
      }

      setShowPromptModal(false);
    } catch (error) {
      console.error('保存提示词失败:', error);
      alert('保存提示词失败，请重试');
    }
  };

  // 处理分类表单输入变化
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理添加分类
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ name: '' });
    setCategoryModalTitle('添加分类');
    setShowCategoryModal(true);
  };

  // 处理编辑分类
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({ name: category.name });
    setCategoryModalTitle('编辑分类');
    setShowCategoryModal(true);
  };

  // 处理删除分类
  const handleDeleteCategory = async (id: string) => {
    if (confirm('确定要删除这个分类吗？')) {
      try {
        await categoryApi.deleteCategory(id);
        // 更新分类数据
        const updatedCategories = categories.filter(category => category.id !== id);
        setCategories(updatedCategories);
        
        // 同时更新使用该分类的提示词
        const updatedPrompts = prompts.map(prompt => 
          prompt.categoryId === id ? { ...prompt, categoryId: '' } : prompt
        );
        setPrompts(updatedPrompts);
      } catch (error) {
        console.error('删除分类失败:', error);
        alert('删除分类失败，请重试');
      }
    }
  };

  // 处理保存分类
  const handleSaveCategory = async () => {
    if (!validateForm('category')) {
      return;
    }

    try {
      if (editingCategory) {
        // 编辑现有分类
        const updatedCategory = await categoryApi.updateCategory(editingCategory.id, categoryFormData);
        const updatedCategories = categories.map(category => 
          category.id === editingCategory.id ? updatedCategory : category
        );
        setCategories(updatedCategories);
      } else {
        // 添加新分类
        const newCategory = await categoryApi.createCategory(categoryFormData);
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
      }

      setShowCategoryModal(false);
    } catch (error) {
      console.error('保存分类失败:', error);
      alert('保存分类失败，请重试');
    }
  };

  // 处理指令集表单输入变化
  const handleSetInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPromptSetFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理指令集提示词选择
  const handlePromptSelect = (promptId: string) => {
    setPromptSetFormData(prev => {
      if (prev.promptIds.includes(promptId)) {
        return { ...prev, promptIds: prev.promptIds.filter(id => id !== promptId) };
      } else {
        return { ...prev, promptIds: [...prev.promptIds, promptId] };
      }
    });
  };

  // 处理添加指令集
  const handleAddSet = () => {
    setEditingSet(null);
    setPromptSetFormData({ 
      name: '', 
      description: '', 
      promptIds: []
    });
    setPromptSetModalTitle('添加指令集');
    setShowSetModal(true);
  };

  // 处理编辑指令集
  const handleEditSet = (set: PromptSet) => {
    setEditingSet(set);
    setPromptSetFormData({ 
      name: set.name, 
      description: set.description, 
      promptIds: [...set.promptIds]
    });
    setPromptSetModalTitle('编辑指令集');
    setShowSetModal(true);
  };

  // 处理删除指令集
  const handleDeleteSet = async (id: string) => {
    if (confirm('确定要删除这个指令集吗？')) {
      try {
        await promptSetApi.deletePromptSet(id);
        const updatedSets = promptSets.filter(set => set.id !== id);
        setPromptSets(updatedSets);
      } catch (error) {
        console.error('删除指令集失败:', error);
        alert('删除指令集失败，请重试');
      }
    }
  };

  // 处理保存指令集
  const handleSaveSet = async () => {
    if (!validateForm('set')) {
      return;
    }

    try {
      if (editingSet) {
        // 编辑现有指令集
        const updatedSet = await promptSetApi.updatePromptSet(editingSet.id, promptSetFormData);
        const updatedSets = promptSets.map(set => 
          set.id === editingSet.id ? updatedSet : set
        );
        setPromptSets(updatedSets);
      } else {
        // 添加新指令集
        const newSet = await promptSetApi.createPromptSet(promptSetFormData);
        const updatedSets = [...promptSets, newSet];
        setPromptSets(updatedSets);
      }

      setShowSetModal(false);
    } catch (error) {
      console.error('保存指令集失败:', error);
      alert('保存指令集失败，请重试');
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-white"
          >
            后台管理
          </motion.h1>

          {/* 管理界面布局 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 侧边栏导航 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-64 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-6">管理选项</h2>
              <nav className="space-y-2">
                {[
                  { id: 'projects', name: '项目管理' },
                  { id: 'skills', name: '技能管理' },
                  { id: 'profile', name: '个人信息' },
                  { id: 'contact', name: '联系信息' },
                  { id: 'prompts', name: '指令集管理' }
                ].map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === item.id ? 'bg-primary/20 text-primary shadow-md' : 'text-white hover:bg-white/10'}`}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            {/* 主内容区域 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
            >
              {/* 项目管理 */}
              {activeTab === 'projects' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">项目管理</h2>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-300">管理您的项目列表</p>
                    <motion.button 
                    onClick={handleAddProject}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
                  >
                    添加项目
                  </motion.button>
                  </div>
                  {/* 项目列表 */}
                  <div className="space-y-4">
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <div key={project.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                                {project.isFeatured && (
                                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    精选
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm mt-2">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {project.techStack.map((tech, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => toggleFeaturedProject(project.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                  project.isFeatured 
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30' 
                                    : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:bg-gray-600/50'
                                }`}
                              >
                                {project.isFeatured ? '取消精选' : '设为精选'}
                              </button>
                              <div className="flex gap-2">
                                <motion.button 
                                  onClick={() => handleEditProject(project)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  编辑
                                </motion.button>
                                <motion.button 
                                  onClick={() => handleDeleteProject(project.id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  删除
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        暂无项目数据
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 技能管理 */}
              {activeTab === 'skills' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">技能管理</h2>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-300">管理您的技能列表</p>
                    <motion.button 
                    onClick={handleAddSkill}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
                  >
                    添加技能
                  </motion.button>
                  </div>
                  {/* 技能列表 */}
                  <div className="space-y-4">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <div key={skill.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                            <div className="flex gap-2">
                              <motion.button 
                                onClick={() => handleEditSkill(skill)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                              >
                                编辑
                              </motion.button>
                              <motion.button 
                                onClick={() => handleDeleteSkill(skill.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                              >
                                删除
                              </motion.button>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mt-2">{skill.description}</p>
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                              <span>熟练度</span>
                              <span>{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        暂无技能数据
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 个人信息管理 */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">个人信息管理</h2>
                  <p className="text-gray-300 mb-6">更新您的个人信息，将同步显示在关于页面</p>
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">基本信息</h3>
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* 头像上传 */}
                        <div className="md:w-1/4 flex flex-col items-center">
                          <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary">
                              {profileFormData.avatar ? (
                                <img 
                                  src={profileFormData.avatar} 
                                  alt="头像" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                  <span className="text-gray-400">上传头像</span>
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
                              <label className="cursor-pointer">
                                <input 
                                  type="file" 
                                  onChange={handleAvatarUpload}
                                  className="hidden"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                              </label>
                            </div>
                          </div>
                          {isUploading && (
                            <p className="text-sm text-gray-400">上传中...</p>
                          )}
                        </div>
                        {/* 个人信息表单 */}
                        <div className="md:flex-1 space-y-4">
                          <div>
                            <label className="block text-gray-300 text-sm mb-2">姓名</label>
                            <input 
                              type="text" 
                              name="name"
                              value={profileFormData.name}
                              onChange={handleProfileInputChange}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="输入您的姓名"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm mb-2">职位</label>
                            <input 
                              type="text" 
                              name="title"
                              value={profileFormData.title}
                              onChange={handleProfileInputChange}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="输入您的职位"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm mb-2">简介</label>
                            <textarea 
                              name="bio"
                              value={profileFormData.bio}
                              onChange={handleProfileInputChange}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="输入您的个人简介"
                              rows={4}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">邮箱</label>
                              <input 
                                type="email" 
                                name="email"
                                value={profileFormData.email}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="输入您的邮箱"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">电话</label>
                              <input 
                                type="text" 
                                name="phone"
                                value={profileFormData.phone}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="输入您的电话"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">所在地</label>
                              <input 
                                type="text" 
                                name="location"
                                value={profileFormData.location}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="输入您的所在地"
                              />
                            </div>
                          </div>
                          <motion.button 
                            onClick={handleSaveProfile}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
                          >
                            保存更改
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 联系信息管理 */}
              {activeTab === 'contact' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">联系信息管理</h2>
                  <p className="text-gray-300 mb-6">更新您的联系信息</p>
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">联系信息</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">邮箱</label>
                          <input 
                            type="email" 
                            name="email"
                            value={contactFormData.email}
                            onChange={handleContactInputChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="输入您的邮箱"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">GitHub 链接</label>
                          <input 
                            type="text" 
                            name="github"
                            value={contactFormData.github}
                            onChange={handleContactInputChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="输入您的 GitHub 链接"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Bilibili 链接</label>
                          <input 
                            type="text" 
                            name="bilibili"
                            value={contactFormData.bilibili}
                            onChange={handleContactInputChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="输入您的 Bilibili 链接"
                          />
                        </div>
                        <motion.button 
                          onClick={() => {
                            setContactFormData(contactInfo);
                            setShowContactModal(true);
                          }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
                        >
                          编辑联系信息
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 指令集管理 */}
              {activeTab === 'prompts' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">指令集管理</h2>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-300">管理提示词、分类和指令集</p>
                    <div className="flex gap-2">
                      <motion.button 
                      onClick={handleAddPrompt}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
                    >
                      添加提示词
                    </motion.button>
                    <motion.button 
                      onClick={handleAddCategory}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
                    >
                      添加分类
                    </motion.button>
                    <motion.button 
                      onClick={handleAddSet}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
                    >
                      添加指令集
                    </motion.button>
                    </div>
                  </div>

                  {/* 提示词列表 */}
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold text-white mb-4">提示词</h3>
                    <div className="space-y-4">
                      {prompts.length > 0 ? (
                        prompts.map((prompt) => (
                          <div key={prompt.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-semibold text-white">{prompt.name}</h4>
                              <div className="flex gap-2">
                                <motion.button 
                                  onClick={() => handleEditPrompt(prompt)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  编辑
                                </motion.button>
                                <motion.button 
                                  onClick={() => handleDeletePrompt(prompt.id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  删除
                                </motion.button>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">{prompt.content.length > 100 ? `${prompt.content.substring(0, 100)}...` : prompt.content}</p>
                            <div className="mt-3">
                              <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                                {categories.find(c => c.id === prompt.categoryId)?.name || '未分类'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          暂无提示词数据
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 分类列表 */}
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold text-white mb-4">分类</h3>
                    <div className="space-y-4">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <div key={category.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-semibold text-white">{category.name}</h4>
                              <div className="flex gap-2">
                                <motion.button 
                                  onClick={() => handleEditCategory(category)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  编辑
                                </motion.button>
                                <motion.button 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  删除
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          暂无分类数据
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 指令集列表 */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">指令集</h3>
                    <div className="space-y-4">
                      {promptSets.length > 0 ? (
                        promptSets.map((set) => (
                          <div key={set.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-semibold text-white">{set.name}</h4>
                              <div className="flex gap-2">
                                <motion.button 
                                  onClick={() => handleEditSet(set)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  编辑
                                </motion.button>
                                <motion.button 
                                  onClick={() => handleDeleteSet(set.id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  删除
                                </motion.button>
                              </div>
                            </div>
                            {set.description && (
                              <p className="text-gray-400 text-sm mt-2">{set.description}</p>
                            )}
                            <div className="mt-3">
                              <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                                包含 {set.promptIds.length} 个提示词
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          暂无指令集数据
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* 项目管理模态框 */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-lg overflow-hidden w-full max-w-4xl max-h-[90vh] group"
              >
                {/* 背景纹理 */}
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
                
                {/* 霓虹蓝发光边框 */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 overflow-y-auto max-h-[90vh] p-6">
                  <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-900/80 backdrop-blur-xl py-2">
                    <h3 className="text-xl font-bold font-mono text-white">{modalTitle}</h3>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">项目标题</label>
                      <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.title ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="输入项目标题"
                      />
                      {formErrors.title && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">项目描述</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.description ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="输入项目描述"
                        rows={4}
                      />
                      {formErrors.description && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">项目图片</label>
                      <div className="space-y-3">
                        {/* 已选择的图片预览 */}
                        {formData.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {formData.images.map((img, index) => (
                              <div key={index} className="relative inline-block group">
                                <img 
                                  src={img} 
                                  alt={`项目预览 ${index + 1}`} 
                                  className="w-24 h-16 object-cover rounded-lg border border-white/20"
                                />
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newImages = formData.images.filter((_, i) => i !== index);
                                    setFormData({ ...formData, images: newImages });
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* 图片上传和选择按钮 */}
                        <div>
                          {/* 本地上传按钮 */}
                          <label className="flex items-center justify-center w-full px-4 py-3 bg-blue-600/50 hover:bg-blue-600 border border-blue-500/50 rounded-lg text-gray-300 hover:text-white transition-all cursor-pointer">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleProjectImageUpload}
                              className="hidden"
                              disabled={isUploadingProjectImage}
                            />
                            {isUploadingProjectImage ? (
                              <>
                                <svg className="animate-spin mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                上传中...
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="17 8 12 3 7 8"></polyline>
                                  <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                点击上传本地图片
                              </>
                            )}
                          </label>
                          
                          {/* 提示文字 */}
                          <p className="text-xs text-gray-500 mt-2">支持 JPG、PNG、GIF 等格式，最大 5MB</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">技术栈</label>
                      <div className="flex gap-2 mb-2">
                        <input 
                          type="text" 
                          value={techStackInput}
                          onChange={(e) => setTechStackInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTechStack()}
                          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="输入技术栈并按回车添加"
                        />
                        <button 
                          onClick={handleAddTechStack}
                          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
                        >
                          添加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.techStack.map((tech, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full flex items-center gap-1">
                            {tech}
                            <button 
                              onClick={() => handleRemoveTechStack(tech)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">演示链接</label>
                      <input 
                        type="text" 
                        name="demoLink"
                        value={formData.demoLink}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.demoLink ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="输入演示链接"
                      />
                      {formErrors.demoLink && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.demoLink}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">GitHub 链接</label>
                      <input 
                        type="text" 
                        name="githubLink"
                        value={formData.githubLink}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.githubLink ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="输入 GitHub 链接"
                      />
                      {formErrors.githubLink && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.githubLink}</p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.isFeatured || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary"
                        />
                        <span className="text-gray-300 text-sm">设为精选项目（将在首页展示）</span>
                      </label>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <motion.button 
                        onClick={() => setShowModal(false)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-white font-mono rounded-lg transition-all duration-300 border border-gray-700 shadow-sm hover:shadow-md"
                      >
                        取消
                      </motion.button>
                      <motion.button 
                        onClick={handleSaveProject}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono rounded-lg transition-all duration-300 border border-blue-700/50 shadow-md hover:shadow-lg hover:shadow-blue-500/20"
                      >
                        保存
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* 技能管理模态框 */}
          {showSkillModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-lg overflow-hidden w-full max-w-md group"
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
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-mono text-white">{skillModalTitle}</h3>
                    <button 
                      onClick={() => setShowSkillModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">技能名称</label>
                      <input 
                        type="text" 
                        name="name"
                        value={skillFormData.name}
                        onChange={handleSkillInputChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="输入技能名称"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">技能描述</label>
                      <textarea 
                        name="description"
                        value={skillFormData.description}
                        onChange={handleSkillInputChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="输入技能描述"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">熟练度</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          name="level"
                          min="0"
                          max="100"
                          value={skillFormData.level}
                          onChange={handleSkillInputChange}
                          className="flex-1"
                        />
                        <span className="text-white w-12 text-center">{skillFormData.level}%</span>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button 
                        onClick={() => setShowSkillModal(false)}
                        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-white font-mono rounded-lg transition-colors border border-gray-700"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleSaveSkill}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono rounded-lg transition-colors border border-blue-700/50"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* 联系信息管理模态框 */}
          {showContactModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-lg overflow-hidden w-full max-w-md group"
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
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-mono text-white">编辑联系信息</h3>
                    <button 
                      onClick={() => setShowContactModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">邮箱</label>
                      <input 
                        type="email" 
                        name="email"
                        value={contactFormData.email}
                        onChange={handleContactInputChange}
                        className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.email ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="输入您的邮箱"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">GitHub 链接</label>
                      <input 
                        type="text" 
                        name="github"
                        value={contactFormData.github}
                        onChange={handleContactInputChange}
                        className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.github ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="输入您的 GitHub 链接"
                      />
                      {formErrors.github && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.github}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Bilibili 链接</label>
                      <input 
                        type="text" 
                        name="bilibili"
                        value={contactFormData.bilibili}
                        onChange={handleContactInputChange}
                        className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.bilibili ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="输入您的 Bilibili 链接"
                      />
                      {formErrors.bilibili && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.bilibili}</p>
                      )}
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button 
                        onClick={() => setShowContactModal(false)}
                        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-white font-mono rounded-lg transition-colors border border-gray-700"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleSaveContact}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono rounded-lg transition-colors border border-blue-700/50"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* 提示词管理模态框 */}
          {showPromptModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-lg overflow-hidden w-full max-w-2xl group"
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
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-mono text-white">{promptModalTitle}</h3>
                    <button 
                      onClick={() => setShowPromptModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">提示词名称</label>
                      <input 
                        type="text" 
                        name="name"
                        value={promptFormData.name}
                        onChange={handlePromptInputChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="输入提示词名称"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">提示词内容</label>
                      <textarea 
                        name="content"
                        value={promptFormData.content}
                        onChange={handlePromptInputChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="输入提示词内容"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">分类</label>
                      <select 
                        name="categoryId"
                        value={promptFormData.categoryId}
                        onChange={handlePromptInputChange}
                        className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">未分类</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button 
                        onClick={() => setShowPromptModal(false)}
                        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-white font-mono rounded-lg transition-colors border border-gray-700"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleSavePrompt}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono rounded-lg transition-colors border border-blue-700/50"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* 分类管理模态框 */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-lg overflow-hidden w-full max-w-md group"
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
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-mono text-white">{categoryModalTitle}</h3>
                    <button 
                      onClick={() => setShowCategoryModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">分类名称</label>
                    <input 
                      type="text" 
                      name="name"
                      value={categoryFormData.name}
                      onChange={handleCategoryInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="输入分类名称"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowCategoryModal(false)}
                      className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-white font-mono rounded-lg transition-colors border border-gray-700"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSaveCategory}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono rounded-lg transition-colors border border-blue-700/50"
                    >
                      保存
                    </button>
                  </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* 指令集管理模态框 */}
          {showSetModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-lg overflow-hidden w-full max-w-2xl group"
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
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-mono text-white">{promptSetModalTitle}</h3>
                    <button 
                      onClick={() => setShowSetModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">指令集名称</label>
                    <input 
                      type="text" 
                      name="name"
                      value={promptSetFormData.name}
                      onChange={handleSetInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="输入指令集名称"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">指令集描述</label>
                    <textarea 
                      name="description"
                      value={promptSetFormData.description}
                      onChange={handleSetInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="输入指令集描述"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">选择提示词</label>
                    <div className="flex flex-wrap gap-2">
                      {prompts.map(prompt => (
                        <label
                          key={prompt.id}
                          className={`px-3 py-1 rounded-full text-sm cursor-pointer ${promptSetFormData.promptIds.includes(prompt.id) ? 'bg-primary text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                        >
                          <input
                            type="checkbox"
                            checked={promptSetFormData.promptIds.includes(prompt.id)}
                            onChange={() => handlePromptSelect(prompt.id)}
                            className="hidden"
                          />
                          {prompt.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowSetModal(false)}
                      className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-white font-mono rounded-lg transition-colors border border-gray-700"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSaveSet}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono rounded-lg transition-colors border border-blue-700/50"
                    >
                      保存
                    </button>
                  </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* 云端图片选择模态框 */}
        {showCloudPicker && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCloudPicker(false);
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-lg overflow-hidden w-full max-w-3xl max-h-[80vh] group"
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="text-xs font-mono text-purple-500 overflow-y-auto max-h-[80vh]">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{'01010101'.repeat(4)}</span>
                      <span>{'10101010'.repeat(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 opacity-50"></div>
              
                <div className="relative z-10 overflow-y-auto max-h-[80vh] p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold font-mono text-white">选择云端图片</h3>
                  <button 
                    onClick={() => setShowCloudPicker(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                
                {isLoadingCloudImages ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-400">加载中...</div>
                  </div>
                ) : cloudImages.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-400">暂无图片，请先在 Obsidian 中同步图片</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {cloudImages.map((img, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group/img border-2 border-transparent hover:border-purple-500 transition-all"
                      onClick={() => {
                        setFormData((prev: any) => ({
                          ...prev,
                          images: [...prev.images, img]
                        }));
                        setShowCloudPicker(false);
                      }}
                    >
                      <img src={img} alt={`云端图片 ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm">点击添加</span>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* 图片管理模态框 */}
      {showImageManager && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowImageManager(false);
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-lg overflow-hidden w-full max-w-3xl max-h-[80vh] group"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="text-xs font-mono text-purple-500 overflow-y-auto max-h-[80vh]">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{'01010101'.repeat(4)}</span>
                    <span>{'10101010'.repeat(4)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 opacity-50"></div>
            
            <div className="relative z-10 overflow-y-auto max-h-[80vh] p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-mono text-white">图片库管理</h3>
                <button 
                  onClick={() => setShowImageManager(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              {/* 添加新图片 */}
              <div className="flex gap-2 mb-4">
                <input 
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addManagedImage()}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="输入图片链接后按回车添加"
                />
                <button
                  onClick={addManagedImage}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  添加
                </button>
              </div>
              <p className="text-gray-500 text-xs mb-4">提示：在Obsidian的图片上右键复制链接，粘贴到这里添加</p>
              
              {/* 图片列表 */}
              {managedImages.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-400">暂无图片，请添加图片链接</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {managedImages.map((img, index) => (
                    <div key={index} className="relative group/img">
                      <div 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
                        onClick={() => {
                          setFormData((prev: any) => ({
                            ...prev,
                            images: [...prev.images, img]
                          }));
                          setShowImageManager(false);
                        }}
                      >
                        <img src={img} alt={`图片 ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm">点击选用</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeManagedImage(img)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;