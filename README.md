# 作品集网站项目

## 项目介绍

这是一个使用 Next.js 14 和 Tailwind CSS 构建的个人作品集网站，旨在展示个人项目、技能和联系方式。网站采用现代化的设计风格，支持响应式布局，在各种设备上都能提供良好的用户体验。

## 技术栈

- **前端框架**：Next.js 14
- **CSS 框架**：Tailwind CSS
- **动画库**：Framer Motion
- **状态管理**：React useState + useEffect
- **数据存储**：SQLite + Prisma ORM
- **类型系统**：TypeScript

## 项目结构

```
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API 路由
│   │   ├── components/     # 可复用组件
│   │   ├── projects/       # 项目展示页面
│   │   ├── about/          # 关于页面
│   │   ├── contact/        # 联系页面
│   │   ├── prompts/        # 指令集页面
│   │   ├── admin/          # 后台管理页面
│   │   └── page.tsx        # 首页
│   ├── lib/               # 工具库
│   └── types/             # TypeScript 类型定义
├── public/                # 静态资源
├── next.config.js         # Next.js 配置
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 核心功能

### 1. 首页
- 英雄区展示个人信息和简介
- 精选项目展示
- 专业技能展示
- 响应式设计，适配不同设备

### 2. 项目展示页面
- 项目列表展示
- 项目搜索和排序功能
- 项目详情卡片
- 分页功能
- 无状态页面设计（当没有项目时显示友好提示）

### 3. 关于页面
- 个人简介和背景信息
- 技能展示
- 教育和工作经历

### 4. 联系页面
- 联系表单
- 社交媒体链接
- 个人联系方式

### 5. 指令集页面
- 提示词管理
- 分类管理
- 指令集管理
- 搜索和排序功能
- 分页功能

### 6. 后台管理页面
- 项目管理（添加、编辑、删除项目）
- 技能管理（添加、编辑、删除技能）
- 个人信息管理
- 联系信息管理
- 指令集管理
- 数据持久化到 SQLite 数据库

## 优化特点

1. **性能优化**
   - 使用 Next.js Image 组件进行图片优化
   - 实现图片懒加载
   - 使用 React.lazy 和 Suspense 进行代码分割
   - 优化动画效果，减少不必要的重新渲染
   - 使用静态生成（SSG）和增量静态再生（ISR）

2. **用户体验优化**
   - 响应式设计，适配不同设备
   - 流畅的动画和过渡效果
   - 友好的表单验证和错误处理
   - 清晰的视觉层次和导航结构

3. **代码质量优化**
   - 使用 TypeScript 确保类型安全
   - 模块化代码结构，提高代码复用性
   - 详细的代码注释和文档
   - 统一的代码风格和规范

4. **安全性优化**
   - 输入验证和错误处理
   - CORS 配置
   - 依赖库安全更新

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆项目
   ```bash
   git clone <repository-url>
   cd dev-portfolio
   ```

2. 安装依赖
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. 构建生产版本
   ```bash
   npm run build
   # 或
   yarn build
   ```

5. 运行生产服务器
   ```bash
   npm start
   # 或
   yarn start
   ```

## 项目配置

### Next.js 配置

项目使用 `next.config.js` 文件进行配置，主要包括：

- 图片域名配置（允许从外部域名加载图片）
- 其他 Next.js 相关配置

### 环境变量

项目使用 `.env` 文件存储环境变量，包括：

- API 端点
- 其他敏感信息

## 数据管理

项目使用 LocalStorage 进行数据持久化，主要存储以下数据：

- 项目数据
- 技能数据
- 联系信息
- 指令集数据
- 分类数据

## 未来计划

1. 添加用户认证功能
2. 集成后端数据库
3. 添加更多交互功能
4. 优化 SEO 性能
5. 添加更多动画和交互效果

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License

## 联系方式

- 邮箱：2954929104@qq.com
- GitHub：https://github.com/ZhangMH-coder/
- Bilibili：https://space.bilibili.com/380750498

---

感谢您的关注和支持！