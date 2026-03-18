'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * 页脚组件
 * 包含社交媒体链接、邮箱地址和版权信息，具有视差效果
 */
const Footer = () => {
  // 使用framer-motion的useScroll和useTransform创建视差效果
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/ZhangMH-coder/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'Bilibili',
      url: 'https://space.bilibili.com/380750498?spm_id_from=333.1007.0.0',
      icon: (
        <img src="/icons/bilibili.png" alt="Bilibili" className="h-5 w-5" />
      )
    }
  ];

  return (
    <footer className="mt-20 py-16 glass relative overflow-hidden">
      {/* 视差背景元素 */}
      <motion.div
        className="absolute inset-0 z-0 opacity-10"
        style={{ y: y1 }}
      >
        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20"></div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{ y: y2 }}
          >
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">Dev</span>Portfolio
            </Link>
            <p className="text-gray-400 mt-2">现代程序员作品集</p>
          </motion.div>

          {/* 联系信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            style={{ y: y3 }}
            className="flex flex-col items-center md:items-end gap-4"
          >
            {/* 邮箱地址 */}
            <div className="flex items-center space-x-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>2954929104@qq.com</span>
            </div>

            {/* 社交媒体链接 */}
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-primary transition-colors duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-700 hover:border-primary transition-colors duration-300">
                    {link.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 版权信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500"
        >
          <p>© {new Date().getFullYear()} DevPortfolio. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;