# 🎮 Modern Snake Game - Cyberpunk Edition

一个采用**赛博朋克网格美学**风格的现代化贪吃蛇游戏，使用最新的前端技术栈构建，支持手机、平板和电脑三端完美适配。

![Cyberpunk Snake Game](https://img.shields.io/badge/style-Cyberpunk-ff00ff?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**🚀 在线演示**: [Cloudflare Pages](https://cyberpunk-snake-game.pages.dev)

## ✨ 核心特性

### 🎨 赛博朋克视觉设计
- **霓虹色彩系统**：荧光绿蛇、荧光粉红食物、青色霓虹边框、深紫色背景
- **发光效果**：多层 box-shadow 和 text-shadow 实现逼真的霓虹发光
- **扫描线动画**：全屏扫描线覆盖层，8秒无限循环，增强赛博朋克氛围
- **网格背景**：半透明的青色网格线条，营造科技感
- **粒子系统**：吃食物时产生粒子爆炸效果，向四周均匀扩散

### 🎮 完整的游戏逻辑
- **网格大小**：30×30 的游戏网格
- **移动速度**：150ms 每步（可调整难度）
- **穿墙机制**：蛇从一侧穿出从另一侧进入，无边界限制
- **碰撞检测**：精确的自身碰撞判定
- **食物生成**：随机生成不与蛇身重叠的食物
- **脉冲动画**：食物持续脉冲，通过 Math.sin 驱动半径变化
- **暂停/继续**：支持游戏暂停和恢复

### 📱 多端兼容控制
- **键盘控制**（电脑端）
  - 方向键：↑ ↓ ← →
  - WASD 键：W A S D
  - 空格键：暂停/继续
  - 防止反向移动（不能直接掉头）

- **触摸手势**（手机/平板）
  - 向上滑动：蛇向上移动
  - 向下滑动：蛇向下移动
  - 向左滑动：蛇向左移动
  - 向右滑动：蛇向右移动
  - 最小滑动距离：30px

- **虚拟 D-Pad**（手机端）
  - 响应式 3×3 网格布局
  - 四个方向键 + 中间暂停键
  - 在小屏幕（< 640px）自动显示

### 📊 响应式布局
- **移动端**（< 640px）
  - 游戏画布 max-w-xs
  - 显示虚拟 D-Pad 控制
  - 紧凑的间距和字体

- **平板端**（640px - 768px）
  - 游戏画布 max-w-md
  - 简化版控制按钮

- **桌面端**（≥ 768px）
  - 游戏画布 max-w-2xl
  - 完整文字控制按钮和键盘说明

### 🎯 高质量渲染
- **高清 Canvas**：支持 devicePixelRatio，在高清屏上清晰无模糊
- **优化性能**：使用 requestAnimationFrame 和高效的粒子系统
- **无 TypeScript 错误**：完整的类型检查和安全性

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 19 | UI 框架 |
| **TypeScript** | 5.6 | 类型安全 |
| **Tailwind CSS** | 4 | 样式系统 |
| **Vite** | 7.1 | 构建工具 |
| **Framer Motion** | 12.23 | UI 动画库 |
| **Canvas API** | 原生 | 游戏渲染 |
| **pnpm** | 10.4 | 包管理器 |

## 📦 项目结构

```
cyberpunk-snake-game/
├── client/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── hooks/
│   │   │   ├── useSnakeGame.ts          # 核心游戏逻辑 Hook
│   │   │   └── useTouchControls.ts      # 触摸手势控制 Hook
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # 游戏主页面
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── ui/                      # shadcn/ui 组件库
│   │   │   └── ErrorBoundary.tsx
│   │   ├── App.tsx                      # 应用入口
│   │   ├── main.tsx                     # React 入口
│   │   └── index.css                    # 全局样式和赛博朋克主题
│   └── index.html                       # HTML 模板
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 快速开始

### 安装依赖
```bash
cd cyberpunk-snake-game
pnpm install
```

### 开发模式
```bash
pnpm dev
```
访问 `http://localhost:3000` 查看游戏

### 构建生产版本
```bash
pnpm build
```

### 类型检查
```bash
pnpm check
```

## 🎮 游戏规则

1. **开始游戏**：页面加载后游戏自动开始
2. **移动蛇**：使用键盘、触摸或虚拟按钮控制蛇的方向
3. **吃食物**：蛇头碰到食物时，蛇身增长，得 10 分
4. **游戏结束**：蛇与自身碰撞时游戏结束
5. **重新开始**：点击 "PLAY AGAIN" 按钮重新开始游戏

## 🎨 赛博朋克设计

采用**赛博朋克网格美学**风格，具有以下设计特点：

- **霓虹色彩**：荧光绿蛇、荧光粉红食物、青色网格、深紫色背景
- **发光效果**：多层 box-shadow 和 text-shadow 实现逼真的霓虹发光
- **扫描线动画**：全屏扫描线覆盖层，8秒无限循环
- **粒子系统**：吃食物时产生粒子爆炸效果
- **排版**：Orbitron（标题）+ Space Mono（正文）
- **动画**：流畅的过渡和脉冲效果

## 📱 多端测试

### 手机端（iPhone/Android）
- 支持竖屏和横屏
- 虚拟 D-Pad 自动显示
- 触摸滑动手势识别

### 平板端（iPad/Android Tablet）
- 优化的画布大小
- 简化版控制按钮
- 舒适的交互间距

### 电脑端（Desktop）
- 完整的键盘支持
- 详细的操作说明
- 最佳的游戏体验

## 🔧 自定义 Hook 详解

### useSnakeGame
管理完整的游戏状态和逻辑：
- **状态管理**：蛇位置、食物位置、方向、分数、游戏状态
- **碰撞检测**：自身碰撞判定
- **穿墙机制**：坐标模运算实现环绕
- **粒子系统**：创建和更新粒子效果
- **游戏循环**：setInterval 驱动的主循环

### useTouchControls
处理触摸手势识别：
- **touchstart/touchend 事件**：监听触摸开始和结束
- **滑动方向计算**：比较 deltaX 和 deltaY
- **最小距离阈值**：30px 防止误触
- **方向映射**：将手势转换为游戏方向命令

## 🎯 性能优化

- **Canvas 高清渲染**：Math.round 确保整数像素
- **粒子系统优化**：使用 Ref 存储粒子，避免 React 重渲染
- **事件委托**：触摸事件绑定到容器，减少监听器数量
- **防抖处理**：移动端响应式检测使用 resize 事件

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🚀 部署

### Cloudflare Pages（推荐）

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 创建新的 Pages 项目，连接此 GitHub 仓库
3. 配置构建设置：
   - Framework: `Vite`
   - Build command: `pnpm build`
   - Output directory: `dist`
4. 点击部署，完成！

**在线演示**: https://cyberpunk-snake-game.pages.dev

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📞 联系方式

- GitHub: [@songdaochuanshu](https://github.com/songdaochuanshu)
- 项目仓库: [snakeGame](https://github.com/songdaochuanshu/snakeGame)

---

**享受赛博朋克风格的贪吃蛇游戏吧！** 🚀✨
