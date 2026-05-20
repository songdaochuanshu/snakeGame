# 部署指南 - Cloudflare Pages

本文档详细说明如何将赛博朋克贪吃蛇游戏部署到 Cloudflare Pages，包括 SSL/TLS 证书配置。

## 📋 前置要求

- GitHub 账户（已连接仓库）
- Cloudflare 账户（免费账户即可）
- 自定义域名（可选，使用 Cloudflare 免费子域名也可以）

## 🚀 部署步骤

### 第一步：准备 GitHub 仓库

确保您的代码已推送到 GitHub：

```bash
# 查看远程仓库
git remote -v

# 推送代码
git push -u origin main
```

### 第二步：连接 Cloudflare Pages

1. **登录 Cloudflare 控制面板**
   - 访问 https://dash.cloudflare.com
   - 使用您的 Cloudflare 账户登录

2. **创建新项目**
   - 在左侧菜单找到 "Pages"
   - 点击 "Create a project" 或 "Connect to Git"
   - 选择 "Connect to Git"

3. **授权 GitHub**
   - 选择 GitHub 作为 Git 提供商
   - 授权 Cloudflare 访问您的 GitHub 账户
   - 选择 "songdaochuanshu/snakeGame" 仓库

4. **配置构建设置**
   - **Project name**：`cyberpunk-snake-game`
   - **Production branch**：`main`
   - **Framework preset**：选择 "Vite"
   - **Build command**：`pnpm build`
   - **Build output directory**：`dist`
   - **Root directory**：留空或设置为 `/`

5. **环境变量**（可选）
   - 如果需要，可以添加环境变量
   - 对于此项目，通常不需要额外的环境变量

6. **部署**
   - 点击 "Save and Deploy"
   - Cloudflare 将自动从 GitHub 克隆代码并构建

### 第三步：等待部署完成

- 部署通常需要 2-5 分钟
- 您可以在 Cloudflare Pages 控制面板中查看部署进度
- 部署完成后，您将获得一个 `*.pages.dev` 的免费子域名

## 🔐 SSL/TLS 证书配置

Cloudflare Pages 会自动为所有部署提供 SSL/TLS 证书，**无需手动配置**。

### 自动证书配置

- **HTTPS 支持**：所有 Cloudflare Pages 部署都自动支持 HTTPS
- **证书颁发者**：Cloudflare 使用 Let's Encrypt 颁发的证书
- **自动续期**：证书会自动续期，无需人工干预
- **子域名**：`*.pages.dev` 域名已包含在通配符证书中

### 验证 HTTPS

部署完成后，您可以验证 HTTPS 是否正常工作：

```bash
# 使用 curl 检查
curl -I https://your-project.pages.dev

# 应该看到类似的响应：
# HTTP/2 200
# cf-cache-status: MISS
# server: cloudflare
```

## 🌐 绑定自定义域名

如果您有自己的域名，可以将其绑定到 Cloudflare Pages：

### 步骤 1：在 Cloudflare 中添加域名

1. 在 Cloudflare 控制面板中，点击 "Add a Site"
2. 输入您的域名（例如：snakegame.com）
3. 选择免费计划
4. 按照指示更新您的域名 DNS 设置

### 步骤 2：连接 Pages 项目到自定义域名

1. 进入您的 Pages 项目
2. 点击 "Custom domains"
3. 点击 "Set up a custom domain"
4. 输入您的域名（例如：snakegame.com 或 game.snakegame.com）
5. Cloudflare 将自动配置 DNS 和 SSL 证书

### 步骤 3：验证域名

- 等待 DNS 传播（通常 5-30 分钟）
- 访问您的自定义域名验证是否正常工作
- HTTPS 证书会自动配置

## 🔄 自动部署

Cloudflare Pages 与 GitHub 集成，支持自动部署：

### 自动部署触发条件

- **主分支推送**：当您推送代码到 `main` 分支时，自动触发部署
- **Pull Request**：每个 PR 都会生成预览链接
- **分支部署**：可以为其他分支配置自动部署

### 配置自动部署

1. 进入 Pages 项目设置
2. 点击 "Builds & deployments"
3. 配置 "Production branch" 为 `main`
4. 可选：配置 "Preview deployments" 为所有分支

## 📊 监控和日志

### 查看部署日志

1. 进入 Pages 项目
2. 点击 "Deployments" 标签
3. 选择特定的部署查看详细日志

### 常见问题排查

#### 构建失败

**症状**：部署失败，显示构建错误

**解决方案**：
```bash
# 本地测试构建
pnpm install
pnpm build

# 检查 dist 目录是否生成
ls -la dist/
```

#### 404 错误

**症状**：访问页面显示 404

**解决方案**：
- 检查 "Build output directory" 是否设置为 `dist`
- 确保 `package.json` 中的 build 命令正确
- 检查 Cloudflare 部署日志

#### 样式或脚本加载失败

**症状**：页面加载但样式/脚本不生效

**解决方案**：
- 检查浏览器控制台的 CORS 错误
- 确保所有资源路径都是相对路径
- 清除浏览器缓存（Ctrl+Shift+Delete）

## 🔒 安全建议

### 1. 保护敏感信息

- **不要在代码中存储密钥**：使用环境变量
- **使用 .gitignore**：排除 `.env` 文件
- **定期轮换 Token**：GitHub Personal Access Token 应定期更新

### 2. 启用 Cloudflare 安全功能

1. 进入 Cloudflare 域名设置
2. 启用 "Web Application Firewall (WAF)"
3. 配置 DDoS 防护
4. 启用速率限制

### 3. 监控部署

- 定期检查部署日志
- 设置部署失败通知
- 监控网站性能指标

## 📈 性能优化

### Cloudflare 缓存配置

1. 进入域名设置 → Caching
2. 配置缓存规则：
   - **HTML**：不缓存或短期缓存
   - **CSS/JS**：长期缓存（1 年）
   - **图片**：长期缓存（1 年）

### 启用 Cloudflare 功能

- **Brotli 压缩**：自动启用，减少传输大小
- **Minification**：启用 CSS/JS/HTML 压缩
- **Image Optimization**：启用图片优化

## 🚨 故障排除

### 部署卡住

```bash
# 重新触发部署
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### 清除缓存

1. 进入 Cloudflare 控制面板
2. 选择您的域名
3. 点击 "Caching" → "Purge Cache"
4. 选择 "Purge Everything"

### 查看实时日志

访问 Cloudflare Pages 部署页面，查看实时构建日志

## 📚 参考资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)
- [Let's Encrypt 证书信息](https://letsencrypt.org/)
- [Cloudflare SSL/TLS 文档](https://developers.cloudflare.com/ssl/)

## ✅ 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] Cloudflare 账户已创建
- [ ] Pages 项目已创建并连接到 GitHub
- [ ] 构建设置已正确配置
- [ ] 部署成功完成
- [ ] HTTPS 正常工作
- [ ] 自定义域名已配置（如需要）
- [ ] DNS 已传播
- [ ] 网站在浏览器中正常显示
- [ ] 所有功能已测试

## 🎉 部署完成

恭喜！您的赛博朋克贪吃蛇游戏已成功部署到 Cloudflare Pages。

**访问您的网站**：
- 免费子域名：`https://cyberpunk-snake-game.pages.dev`
- 自定义域名：`https://your-domain.com`（如已配置）

**下一步**：
1. 分享您的游戏链接
2. 监控部署和性能
3. 根据用户反馈进行更新

---

**需要帮助？** 查看 [Cloudflare 支持文档](https://support.cloudflare.com/)
