'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * 导航栏组件
 * 包含Logo和导航链接
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: '首页', path: '' },
    { name: '项目', path: 'projects' },
    { name: '关于', path: 'about' },
    { name: '联系', path: 'contact' },
    { name: '指令集', path: 'prompts' },
    { name: '后台管理', path: 'admin' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary">Dev</span>Portfolio
          </Link>
        </motion.div>

        {/* 导航链接 - 桌面端 */}
        <nav className="hidden md:flex items-center gap-6 sm:gap-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link 
                href={`/${item.path}`} 
                className="text-foreground hover:text-primary transition-all duration-300 font-medium text-sm sm:text-base relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* 移动端菜单按钮 */}
        <div className="flex items-center">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Link 
                  href={`/${item.path}`} 
                  className="block text-foreground hover:text-primary transition-all duration-300 font-medium py-3 px-2 rounded-lg hover:bg-white/10 relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  <span className="absolute bottom-2 left-2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-16px)]"></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;