# SSL/TLS 证书和安全配置指南

本文档详细说明赛博朋克贪吃蛇游戏在 Cloudflare Pages 上的 SSL/TLS 证书配置和安全最佳实践。

## 🔐 SSL/TLS 证书概述

### 什么是 SSL/TLS 证书？

SSL/TLS 证书是一种数字证书，用于：
- **加密通信**：保护用户与服务器之间的数据传输
- **身份验证**：证明网站的真实身份
- **建立信任**：在浏览器中显示"安全"标志

### HTTPS vs HTTP

| 特性 | HTTP | HTTPS |
|------|------|-------|
| **加密** | ❌ 否 | ✅ 是 |
| **数据安全** | 低 | 高 |
| **浏览器标志** | 不安全 | 安全 |
| **SEO** | 低 | 高 |
| **性能** | 快 | 快（HTTP/2） |

## 🌐 Cloudflare Pages 证书配置

### 自动证书配置

Cloudflare Pages 提供**完全自动化的 SSL/TLS 证书管理**：

#### 1. 免费子域名证书

```
部署 URL: https://cyberpunk-snake-game.pages.dev
证书类型: 通配符证书 (*.pages.dev)
颁发者: Let's Encrypt (通过 Cloudflare)
自动续期: 是
成本: 免费
```

**证书详情**：
- **Subject**: `*.pages.dev`
- **Issuer**: Let's Encrypt
- **有效期**: 90 天
- **自动续期**: 提前 30 天自动续期

#### 2. 自定义域名证书

```
部署 URL: https://snakegame.com
证书类型: 单域名或通配符证书
颁发者: Let's Encrypt (通过 Cloudflare)
自动续期: 是
成本: 免费
```

### 证书验证步骤

#### 方法 1：使用浏览器

1. 访问 `https://cyberpunk-snake-game.pages.dev`
2. 点击地址栏的锁形图标
3. 查看证书信息：
   - 颁发给：`*.pages.dev`
   - 颁发者：Let's Encrypt
   - 有效期：显示过期日期

#### 方法 2：使用命令行

```bash
# 查看证书信息
openssl s_client -connect cyberpunk-snake-game.pages.dev:443 -servername cyberpunk-snake-game.pages.dev

# 显示证书详情
openssl s_client -connect cyberpunk-snake-game.pages.dev:443 -servername cyberpunk-snake-game.pages.dev | openssl x509 -text -noout
```

#### 方法 3：使用在线工具

- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [Qualys SSL Server Test](https://www.ssllabs.com/ssltest/analyze.html)
- [Digicert SSL Checker](https://www.digicert.com/help/)

### 证书链

```
Root Certificate (Let's Encrypt)
    ↓
Intermediate Certificate
    ↓
Leaf Certificate (*.pages.dev)
    ↓
您的网站
```

## 🔒 Cloudflare SSL/TLS 设置

### 访问 SSL/TLS 设置

1. 登录 Cloudflare 控制面板
2. 选择您的域名
3. 左侧菜单 → SSL/TLS
4. 查看以下选项：

### SSL/TLS 加密模式

| 模式 | 说明 | 推荐 |
|------|------|------|
| **Off** | 禁用 HTTPS | ❌ 不推荐 |
| **Flexible** | 仅 Cloudflare 到浏览器加密 | ⚠️ 不安全 |
| **Full** | 完整加密（自签名证书可用） | ✅ 推荐 |
| **Full (Strict)** | 完整加密（有效证书必需） | ✅ 最安全 |

**推荐设置**：`Full (Strict)`

### 最小 TLS 版本

```
设置: TLS 1.2 或更高
原因: 安全性和兼容性平衡
```

### 自动 HTTPS 重定向

```
启用: 是
效果: 所有 HTTP 请求自动重定向到 HTTPS
```

## 🛡️ 安全最佳实践

### 1. 启用 HSTS（HTTP Strict Transport Security）

```
设置位置: SSL/TLS → Edge Certificates
最大年龄: 12 个月 (31536000 秒)
包含子域名: 是
预加载: 是
```

**HSTS 头示例**：
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 2. 启用 OCSP Stapling

```
自动启用: 是
作用: 加快证书验证速度
```

### 3. 配置 CAA 记录

CAA（Certification Authority Authorization）记录限制哪些 CA 可以颁发证书：

```dns
example.com. CAA 0 issue "letsencrypt.org"
example.com. CAA 0 issuewild "letsencrypt.org"
```

### 4. 启用 Web Application Firewall (WAF)

1. SSL/TLS 下方 → WAF
2. 启用 "Managed Rules"
3. 配置规则集：
   - OWASP ModSecurity Core Rule Set
   - Cloudflare Managed Ruleset

### 5. 启用速率限制

```
设置: 限制每个 IP 的请求数
阈值: 100 请求/分钟
```

## 📊 证书监控

### 在 Cloudflare 控制面板中监控

1. 进入 SSL/TLS → Edge Certificates
2. 查看证书状态：
   - 颁发日期
   - 过期日期
   - 自动续期状态

### 设置证书过期提醒

1. 进入 Notifications
2. 创建新通知
3. 选择 "SSL/TLS Certificate Expiration"
4. 设置提醒时间（建议提前 30 天）

### 监控命令

```bash
# 每天检查证书有效期
0 0 * * * openssl s_client -connect cyberpunk-snake-game.pages.dev:443 -servername cyberpunk-snake-game.pages.dev 2>/dev/null | openssl x509 -noout -dates
```

## 🔄 证书续期

### 自动续期流程

```
Let's Encrypt 证书有效期: 90 天
Cloudflare 续期时机: 提前 30 天
续期流程: 完全自动化
人工干预: 无需
```

### 续期验证

1. 访问 SSL/TLS → Edge Certificates
2. 查看最新的证书颁发日期
3. 如果日期最近更新，说明续期成功

## 🌍 自定义域名的证书配置

### 添加自定义域名

1. 在 Cloudflare 中添加域名
2. 更新 DNS 指向 Cloudflare
3. Pages 项目中添加自定义域名
4. Cloudflare 自动颁发证书

### DNS 配置示例

```dns
# CNAME 记录
snakegame.com CNAME cyberpunk-snake-game.pages.dev
www.snakegame.com CNAME cyberpunk-snake-game.pages.dev
```

### 证书验证

```bash
# 验证自定义域名的证书
openssl s_client -connect snakegame.com:443 -servername snakegame.com
```

## 🚨 常见问题

### Q1: 为什么浏览器显示"不安全"？

**可能原因**：
- 未启用 HTTPS
- 证书过期
- 证书不匹配域名
- 混合内容（HTTP 和 HTTPS）

**解决方案**：
```bash
# 检查 HTTPS 是否启用
curl -I https://cyberpunk-snake-game.pages.dev

# 检查重定向
curl -I http://cyberpunk-snake-game.pages.dev
```

### Q2: 证书多久更新一次？

**答**：Let's Encrypt 证书有效期为 90 天，Cloudflare 会在过期前 30 天自动续期。

### Q3: 可以使用自己的证书吗？

**答**：Cloudflare Pages 使用 Cloudflare 管理的证书。如需自定义证书，需要升级到付费计划。

### Q4: 证书成本是多少？

**答**：完全免费！Cloudflare 提供免费的 SSL/TLS 证书。

## 📈 性能影响

### HTTPS 性能

| 方面 | 影响 |
|------|------|
| **首次连接** | +100-200ms（TLS 握手） |
| **后续连接** | 无影响（连接复用） |
| **总体性能** | +0-5%（HTTP/2 补偿） |
| **用户体验** | 改善（安全感） |

### 优化建议

1. **启用 HTTP/2**：自动启用
2. **启用 OCSP Stapling**：减少验证时间
3. **启用 TLS 1.3**：更快的握手
4. **启用 Session Resumption**：加速重连

## 🔍 安全审计

### SSL Labs 评分

访问 https://www.ssllabs.com/ssltest/ 测试：

```
预期评分: A+ 或 A
测试项目:
- 证书有效性
- 协议支持
- 密钥交换
- 密码强度
- 握手模拟
```

### 安全头检查

```bash
# 检查安全头
curl -I https://cyberpunk-snake-game.pages.dev | grep -i "strict-transport-security\|x-content-type-options\|x-frame-options"
```

## 📚 参考资源

- [Let's Encrypt 文档](https://letsencrypt.org/docs/)
- [Cloudflare SSL/TLS 文档](https://developers.cloudflare.com/ssl/)
- [OWASP HTTPS 指南](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs 最佳实践](https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices)

## ✅ 安全检查清单

- [ ] HTTPS 已启用
- [ ] 证书有效且未过期
- [ ] SSL/TLS 模式设置为 "Full (Strict)"
- [ ] HSTS 已启用
- [ ] 最小 TLS 版本为 1.2
- [ ] OCSP Stapling 已启用
- [ ] WAF 已启用
- [ ] 速率限制已配置
- [ ] 自动 HTTPS 重定向已启用
- [ ] 证书过期提醒已设置
- [ ] SSL Labs 评分为 A 或以上

## 🎉 证书配置完成

您的赛博朋克贪吃蛇游戏现在拥有：
- ✅ 自动管理的 SSL/TLS 证书
- ✅ 完整的 HTTPS 加密
- ✅ 最佳的安全配置
- ✅ 自动续期保障

**享受安全的游戏体验！** 🚀🔒

---

**需要帮助？** 联系 [Cloudflare 支持](https://support.cloudflare.com/)
