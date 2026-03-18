// 输入验证工具

// 验证个人信息数据
export function validateProfileData(data: any) {
  const errors: string[] = [];
  
  if (data.name && typeof data.name !== 'string') {
    errors.push('姓名必须是字符串');
  }
  
  if (data.title && typeof data.title !== 'string') {
    errors.push('标题必须是字符串');
  }
  
  if (data.bio && typeof data.bio !== 'string') {
    errors.push('个人简介必须是字符串');
  }
  
  if (data.email && typeof data.email !== 'string') {
    errors.push('邮箱必须是字符串');
  } else if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('邮箱格式不正确');
  }
  
  if (data.phone && typeof data.phone !== 'string') {
    errors.push('电话必须是字符串');
  }
  
  if (data.website && typeof data.website !== 'string') {
    errors.push('网站必须是字符串');
  } else if (data.website && !/^https?:\/\//.test(data.website)) {
    errors.push('网站 URL 格式不正确');
  }
  
  if (data.github && typeof data.github !== 'string') {
    errors.push('GitHub 必须是字符串');
  }
  
  if (data.linkedin && typeof data.linkedin !== 'string') {
    errors.push('LinkedIn 必须是字符串');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证技能数据
export function validateSkillData(data: any) {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string') {
    errors.push('技能名称是必填项且必须是字符串');
  }
  
  if (data.level && typeof data.level !== 'number') {
    errors.push('技能等级必须是数字');
  } else if (data.level && (data.level < 1 || data.level > 100)) {
    errors.push('技能等级必须在 1-100 之间');
  }
  
  if (data.category && typeof data.category !== 'string') {
    errors.push('技能分类必须是字符串');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证 ID 格式
export function validateId(id: any) {
  if (!id || typeof id !== 'string') {
    return { isValid: false, error: 'ID 必须是字符串' };
  }
  
  if (!/^[0-9a-fA-F-]+$/.test(id)) {
    return { isValid: false, error: 'ID 格式不正确' };
  }
  
  return { isValid: true, error: null };
}
