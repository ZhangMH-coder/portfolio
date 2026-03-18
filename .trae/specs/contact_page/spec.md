# 联系页面和页脚 - 产品需求文档

## Overview
- **Summary**: 设计并实现联系页面和页脚，包含社交媒体链接、邮箱联系方式、轻微视差效果和深色模式切换按钮。
- **Purpose**: 为用户提供与开发者联系的渠道，增强网站的完整性和专业性。
- **Target Users**: 访问网站的潜在雇主、客户或合作伙伴。

## Goals
- 创建联系页面，包含社交媒体链接和邮箱联系方式
- 实现轻微视差效果的页脚
- 添加深色模式切换按钮
- 确保导航栏的"联系"链接正确指向联系页面

## Non-Goals (Out of Scope)
- 实现联系表单提交功能
- 集成第三方联系服务
- 实现实时聊天功能

## Background & Context
- 网站已有的导航栏包含"联系"链接，但尚未实现对应的页面
- 网站使用Next.js 14、Tailwind CSS和Framer Motion构建
- 网站当前采用深色主题，需要添加主题切换功能

## Functional Requirements
- **FR-1**: 创建联系页面，可通过导航栏访问
- **FR-2**: 在联系页面和页脚中展示社交媒体图标（GitHub、bilibili）和邮箱地址
- **FR-3**: 实现轻微视差效果的页脚
- **FR-4**: 添加深色模式切换按钮，允许用户在深色和浅色主题之间切换

## Non-Functional Requirements
- **NFR-1**: 页面响应式设计，适配不同屏幕尺寸
- **NFR-2**: 页面加载速度快，无性能问题
- **NFR-3**: 视觉效果美观，与网站整体风格一致
- **NFR-4**: 交互流畅，动画效果自然

## Constraints
- **Technical**: 使用现有技术栈（Next.js 14、Tailwind CSS、Framer Motion）
- **Business**: 保持与网站整体设计风格一致
- **Dependencies**: 依赖现有的导航栏组件

## Assumptions
- 用户熟悉基本的网站导航操作
- 社交媒体链接和邮箱地址为固定值
- 深色模式切换仅影响前端视觉效果，不涉及后端存储

## Acceptance Criteria

### AC-1: 联系页面可访问
- **Given**: 用户点击导航栏的"联系"链接
- **When**: 页面加载完成
- **Then**: 用户看到联系页面，包含社交媒体链接和邮箱地址
- **Verification**: `programmatic`
- **Notes**: 页面应返回200状态码

### AC-2: 社交媒体链接和邮箱显示正确
- **Given**: 用户访问联系页面或页脚
- **When**: 页面加载完成
- **Then**: 用户看到GitHub、bilibili图标和邮箱地址，点击链接可跳转到对应平台
- **Verification**: `human-judgment`
- **Notes**: 链接应指向正确的URL

### AC-3: 页脚具有轻微视差效果
- **Given**: 用户滚动页面
- **When**: 滚动到页脚区域
- **Then**: 页脚背景或元素具有轻微的视差滚动效果
- **Verification**: `human-judgment`
- **Notes**: 视差效果应自然流畅

### AC-4: 深色模式切换功能正常
- **Given**: 用户点击深色模式切换按钮
- **When**: 按钮被点击
- **Then**: 网站主题在深色和浅色之间切换
- **Verification**: `human-judgment`
- **Notes**: 切换应平滑，无明显闪烁

## Open Questions
- [ ] 是否需要在所有页面都添加深色模式切换按钮，还是仅在联系页面添加？
- [ ] 深色模式切换状态是否需要持久化（如使用localStorage）？