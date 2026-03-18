import React, { Suspense } from "react";

// 懒加载组件
const Hero = React.lazy(() => import("./components/Hero"));
const Projects = React.lazy(() => import("./components/Projects"));
const Skills = React.lazy(() => import("./components/Skills"));

/**
 * 首页组件
 * 组合所有主要部分
 */
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <Hero />
      <Projects />
      <Skills />
    </Suspense>
  );
}
