# Cloudflare Pages 部署配置指南

本文档提供详细的步骤，帮助您快速将赛博朋克贪吃蛇游戏部署到 Cloudflare Pages。

## 📋 前置准备

✅ 代码已推送到 GitHub：`https://github.com/songdaochuanshu/snakeGame`  
✅ 拥有 Cloudflare 账户（免费账户即可）  
✅ GitHub 账户已授权给 Cloudflare

## 🚀 快速部署（5 分钟）

### 步骤 1：访问 Cloudflare 控制面板

1. 打开 https://dash.cloudflare.com
2. 使用您的 Cloudflare 账户登录
3. 如果是新账户，完成初始设置

### 步骤 2：创建 Pages 项目

1. 在左侧菜单找到 **"Pages"**
2. 点击 **"Create a project"** 或 **"Connect to Git"**
3. 选择 **"Connect to Git"**

### 步骤 3：授权 GitHub

1. 点击 **"GitHub"** 选项
2. 在弹出的窗口中授权 Cloudflare 访问您的 GitHub 账户
3. 选择 **"Only select repositories"**（推荐）
4. 选择 **"songdaochuanshu/snakeGame"** 仓库
5. 点击 **"Install & Authorize"**

### 步骤 4：配置构建设置

在 Cloudflare Pages 配置页面，填入以下信息：

| 字段 | 值 |
|------|-----|
| **Project name** | `cyberpunk-snake-game` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `pnpm build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (留空) |

### 步骤 5：部署

1. 点击 **"Save and Deploy"** 按钮
2. Cloudflare 将自动：
   - 从 GitHub 克隆代码
   - 安装依赖
   - 构建项目
   - 部署到 Cloudflare 全球 CDN

### 步骤 6：等待部署完成

- 部署通常需要 **2-5 分钟**
- 在 Cloudflare Pages 控制面板中可以查看实时进度
- 部署完成后，您将看到一个 ✅ 标记

### 步骤 7：获取部署 URL

部署完成后，您将获得：

```
https://cyberpunk-snake-game.pages.dev
```

**恭喜！您的游戏已在线！** 🎉

## 🌐 自定义域名（可选）

### 方法 1：使用 Cloudflare 托管的域名

如果您已在 Cloudflare 中添加了域名：

1. 进入 Pages 项目
2. 点击 **"Custom domains"**
3. 点击 **"Set up a custom domain"**
4. 输入您的域名（例如：`snakegame.com`）
5. Cloudflare 将自动配置 DNS 和 SSL 证书

### 方法 2：使用外部域名

1. 在您的域名注册商中，将 DNS 指向 Cloudflare：
   ```dns
   NS1: iris.ns.cloudflare.com
   NS2: noah.ns.cloudflare.com
   ```

2. 在 Cloudflare 中添加域名
3. 按照方法 1 的步骤配置自定义域名

## 🔄 自动部署

Cloudflare Pages 与 GitHub 完全集成，支持自动部署：

### 自动部署工作流

```
您推送代码到 GitHub
        ↓
Cloudflare 自动检测到更新
        ↓
自动触发构建
        ↓
构建成功后自动部署
        ↓
网站立即更新
```

### 配置自动部署

1. 进入 Pages 项目 → **"Settings"**
2. 点击 **"Builds & deployments"**
3. 确保 **"Production branch"** 设置为 `main`
4. 可选：启用 **"Preview deployments"** 为所有分支创建预览链接

## 📊 监控部署

### 查看部署历史

1. 进入 Pages 项目
2. 点击 **"Deployments"** 标签
3. 查看所有部署记录

### 查看构建日志

1. 在部署列表中选择一个部署
2. 点击 **"View build log"**
3. 查看详细的构建过程和任何错误信息

### 常见构建问题

#### 问题：构建失败 - "pnpm not found"

**解决方案**：
1. 进入 Pages 项目设置
2. 点击 **"Environment"**
3. 添加环境变量：
   ```
   NODE_VERSION: 22
   ```

#### 问题：构建失败 - "dist directory not found"

**解决方案**：
1. 检查本地构建是否成功：
   ```bash
   pnpm install
   pnpm build
   ls -la dist/
   ```
2. 确保 `package.json` 中的 build 命令正确
3. 检查 Cloudflare 中的 "Build output directory" 设置

#### 问题：部署后页面显示 404

**解决方案**：
1. 检查 "Build output directory" 是否设置为 `dist`
2. 确保 `dist/index.html` 存在
3. 清除浏览器缓存（Ctrl+Shift+Delete）

## 🔐 安全配置

### 启用 HTTPS 重定向

1. 进入 Pages 项目 → **"Settings"**
2. 点击 **"Domains"**
3. 确保 HTTPS 已启用

### 配置安全头

Cloudflare 会自动添加以下安全头：
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`

### 启用 WAF（Web Application Firewall）

1. 进入您的域名设置（如使用自定义域名）
2. 点击 **"Security"** → **"WAF"**
3. 启用 **"Managed Rules"**

## 📈 性能优化

### 启用缓存

1. 进入 Pages 项目 → **"Settings"**
2. 点击 **"Caching"**
3. 配置缓存规则：
   - **HTML**：不缓存或 5 分钟
   - **CSS/JS**：1 年
   - **图片**：1 年

### 启用压缩

Cloudflare 自动启用：
- Gzip 压缩
- Brotli 压缩
- 图片优化

## 🔄 回滚部署

如果需要回滚到之前的版本：

1. 进入 Pages 项目 → **"Deployments"**
2. 找到要回滚的部署
3. 点击 **"Rollback to this deployment"**
4. 确认回滚

## 📱 测试部署

### 在不同设备上测试

```bash
# 电脑端
https://cyberpunk-snake-game.pages.dev

# 手机端
# 使用手机浏览器访问上述 URL
# 或扫描二维码
```

### 测试清单

- [ ] 页面在电脑上正常加载
- [ ] 页面在手机上正常加载
- [ ] 页面在平板上正常加载
- [ ] 所有按钮都能正常工作
- [ ] 游戏逻辑正常运行
- [ ] HTTPS 正常工作
- [ ] 响应速度满足预期

## 🎯 常见问题

### Q1：部署后多久才能访问？

**答**：通常 2-5 分钟。如果超过 10 分钟仍未完成，请检查构建日志。

### Q2：可以同时部署多个分支吗？

**答**：可以。启用 "Preview deployments" 后，每个分支都会获得独立的预览链接。

### Q3：如何更新已部署的网站？

**答**：只需推送代码到 GitHub 的 `main` 分支，Cloudflare 会自动重新构建和部署。

### Q4：部署是否收费？

**答**：Cloudflare Pages 对个人和小型项目完全免费。

### Q5：如何查看网站访问统计？

**答**：
1. 进入 Pages 项目
2. 点击 **"Analytics"** 标签
3. 查看访问数据

## 📞 获取帮助

### Cloudflare 文档

- [Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)
- [Cloudflare 支持](https://support.cloudflare.com/)

### GitHub 相关

- [GitHub Pages vs Cloudflare Pages](https://github.com/pages/)
- [GitHub Actions 集成](https://github.com/features/actions)

## ✅ 部署完成检查清单

- [ ] Cloudflare 账户已创建
- [ ] GitHub 已授权给 Cloudflare
- [ ] Pages 项目已创建
- [ ] 构建设置已正确配置
- [ ] 部署成功完成
- [ ] 网站可以访问
- [ ] HTTPS 正常工作
- [ ] 游戏功能正常
- [ ] 自定义域名已配置（如需要）
- [ ] 自动部署已启用

## 🎉 下一步

1. **分享您的游戏**：
   ```
   https://cyberpunk-snake-game.pages.dev
   ```

2. **监控性能**：
   - 定期检查 Analytics
   - 监控构建日志

3. **持续更新**：
   - 在 GitHub 上开发新功能
   - 推送代码自动部署

4. **收集反馈**：
   - 邀请朋友测试
   - 根据反馈改进

---

**祝您的赛博朋克贪吃蛇游戏部署顺利！** 🚀✨

有任何问题，请查阅 [DEPLOYMENT.md](DEPLOYMENT.md) 和 [SSL_CERTIFICATE.md](SSL_CERTIFICATE.md) 获取更详细的信息。
