// 清理 localStorage 中的项目数据
const fs = require('fs');
const path = require('path');

// 模拟 localStorage
const localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// 读取 localStorage 数据（模拟）
try {
  const dataPath = path.join(__dirname, 'localStorage.json');
  if (fs.existsSync(dataPath)) {
    const data = fs.readFileSync(dataPath, 'utf8');
    localStorage.data = JSON.parse(data);
    console.log('读取到 localStorage 数据');
  } else {
    console.log('localStorage.json 文件不存在，创建新文件');
  }
} catch (error) {
  console.error('读取 localStorage 数据失败:', error);
}

// 检查项目数据
const projectsData = localStorage.getItem('projects');
if (projectsData) {
  try {
    const projects = JSON.parse(projectsData);
    console.log('当前项目数量:', projects.length);
    console.log('项目列表:');
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   图片 URL: ${project.image}`);
      console.log(`   演示链接: ${project.demoLink || '无'}`);
      console.log(`   GitHub 链接: ${project.githubLink || '无'}`);
      
      // 检查 URL 是否有效
      try {
        new URL(project.image);
        console.log(`   图片 URL 有效`);
      } catch (error) {
        console.log(`   图片 URL 无效: ${error.message}`);
      }
      
      if (project.demoLink) {
        try {
          new URL(project.demoLink);
          console.log(`   演示链接 有效`);
        } catch (error) {
          console.log(`   演示链接 无效: ${error.message}`);
        }
      }
      
      if (project.githubLink) {
        try {
          new URL(project.githubLink);
          console.log(`   GitHub 链接 有效`);
        } catch (error) {
          console.log(`   GitHub 链接 无效: ${error.message}`);
        }
      }
      
      console.log('');
    });
    
    // 删除无效的项目
    const validProjects = projects.filter(project => {
      try {
        new URL(project.image);
        if (project.demoLink) new URL(project.demoLink);
        if (project.githubLink) new URL(project.githubLink);
        return true;
      } catch (error) {
        console.log(`删除无效项目: ${project.title}`);
        return false;
      }
    });
    
    if (validProjects.length !== projects.length) {
      console.log(`清理前项目数量: ${projects.length}`);
      console.log(`清理后项目数量: ${validProjects.length}`);
      localStorage.setItem('projects', JSON.stringify(validProjects));
      
      // 保存到文件
      const dataPath = path.join(__dirname, 'localStorage.json');
      fs.writeFileSync(dataPath, JSON.stringify(localStorage.data, null, 2));
      console.log('清理后的项目数据已保存到 localStorage.json');
    } else {
      console.log('所有项目 URL 都有效，无需清理');
    }
  } catch (error) {
    console.error('解析项目数据失败:', error);
  }
} else {
  console.log('localStorage 中没有项目数据');
}
