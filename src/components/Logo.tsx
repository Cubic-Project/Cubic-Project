import { motion } from 'framer-motion';

export const Logo = () => {
  return (
    <motion.div 
      className="relative flex items-center justify-center"
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* 1. 后方盖子 最底层 */}
        <path 
          d="M4 9L12 5L10 2L2 6L4 9Z" 
          className="fill-primary" 
          style={{ opacity: 0.3 }} 
        />
        <path 
          d="M4 9L12 5L10 2L2 6L4 9" 
          className="stroke-primary" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        <path 
          d="M12 5L20 9L22 6L14 2L12 5Z" 
          className="fill-primary" 
          style={{ opacity: 0.3 }} 
        />
        <path 
          d="M12 5L20 9L22 6L14 2L12 5" 
          className="stroke-primary" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* 2. 内部空间 深色背景 */}
        <path 
          d="M4 9L12 13L20 9L12 5L4 9Z" 
          className="fill-primary" 
          style={{ opacity: 0.1 }} 
        />

        {/* 3. 盒身 中层 */}
        {/* 左侧面 */}
        <path 
          d="M4 9L12 13V21L4 17V9Z" 
          className="fill-primary" 
          style={{ opacity: 0.8 }} 
        />
        {/* 右侧面 */}
        <path 
          d="M12 13L20 9V17L12 21V13Z" 
          className="fill-primary" 
          style={{ opacity: 0.6 }} 
        />
        
        {/* 盒身轮廓线 */}
        <path 
          d="M4 9V17L12 21L20 17V9" 
          className="stroke-primary" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M12 21V13" 
          className="stroke-primary" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* 4. 前方盖子 最顶层 */}
        {/* 左前盖 */}
        <path 
          d="M4 9L12 13L10 16L2 12L4 9Z" 
          className="fill-primary" 
          style={{ opacity: 0.5 }} 
        />
        <path 
          d="M4 9L12 13L10 16L2 12L4 9" 
          className="stroke-primary" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* 右前盖 */}
        <path 
          d="M12 13L20 9L22 12L14 16L12 13Z" 
          className="fill-primary" 
          style={{ opacity: 0.4 }} 
        />
        <path 
          d="M12 13L20 9L22 12L14 16L12 13" 
          className="stroke-primary" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    </motion.div>
  );
};
