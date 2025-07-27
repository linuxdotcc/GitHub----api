# GitHub随机图片API

基于GitHub存储的随机图片API，部署在Vercel上。通过访问特定URL来随机返回指定文件夹内的图片。

**特别说明：图片直接从本仓库根目录获取，无需额外配置外部仓库。**

## 功能特点

- 🎲 随机返回指定文件夹内的图片
- 🚀 部署在Vercel，响应速度快
- 📁 支持多级文件夹结构
- 🏠 **图片从本仓库根目录获取**
- 🔒 支持私有仓库（需要GitHub Token）
- 📊 支持JSON格式返回图片信息
- 🖼️ 支持多种图片格式（jpg, jpeg, png, gif, webp, bmp, svg）
- ⚡ Vercel自动检测仓库信息，无需手动配置

## 使用方法

### 基本用法

访问 `https://your-domain.vercel.app/folder_name` 会随机重定向到该文件夹内的一张图片。

例如：
- `https://your-domain.vercel.app/aaa` - 随机返回aaa文件夹内的图片
- `https://your-domain.vercel.app/photos/nature` - 随机返回photos/nature文件夹内的图片

### 返回JSON格式

添加 `?type=json` 参数可以获取图片信息的JSON格式：

```
https://your-domain.vercel.app/aaa?type=json
```

返回格式：
```json
{
  "success": true,
  "image": {
    "name": "image1.jpg",
    "url": "https://raw.githubusercontent.com/user/repo/main/aaa/image1.jpg",
    "size": 123456,
    "path": "aaa/image1.jpg"
  },
  "folder": "aaa",
  "totalImages": 5,
  "repository": "user/repo"
}
```

## 部署步骤

### 1. 准备仓库结构

**重要：图片需要放在本仓库的根目录下**

在本仓库根目录创建文件夹并上传图片，例如：
```
github-random-image-api/
├── api/                 # API代码（不要动）
├── aaa/                 # 图片文件夹
│   ├── image1.jpg
│   ├── image2.png
│   └── image3.gif
├── bbb/                 # 另一个图片文件夹
│   ├── photo1.jpg
│   └── photo2.png
├── photos/              # 多级文件夹
│   └── nature/
│       ├── sunset.jpg
│       └── mountain.png
├── package.json
├── vercel.json
└── README.md
```

### 2. 获取GitHub Token（可选）

仅在以下情况需要：
- 使用私有仓库
- 需要更高的API调用限制（每小时5000次 vs 60次）

创建步骤：
1. 访问 GitHub Settings > Developer settings > Personal access tokens
2. 点击 "Generate new token"
3. 选择权限：`repo`（用于私有仓库）或 `public_repo`（用于公开仓库）
4. 复制生成的token

### 3. 部署到Vercel

#### 方法一：通过Vercel网站（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 连接你的GitHub账户
3. **直接导入本仓库**（包含图片文件夹的仓库）
4. Vercel会自动检测仓库信息，无需手动配置
5. 如果是私有仓库，在环境变量中添加 `GITHUB_TOKEN`
6. 点击部署

#### 方法二：通过Vercel CLI

1. 安装Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 在项目目录下运行：
   ```bash
   vercel
   ```

3. 按照提示完成部署

### 4. 配置环境变量（可选）

**通常情况下无需配置**，Vercel会自动设置以下变量：
- `VERCEL_GIT_REPO_OWNER` - 自动检测
- `VERCEL_GIT_REPO_SLUG` - 自动检测

仅在以下情况需要手动配置：

| 变量名 | 说明 | 何时需要 |
|--------|------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | 私有仓库或需要更高API限制 |
| `GITHUB_OWNER` | GitHub用户名（手动覆盖） | Vercel自动检测失败时 |
| `GITHUB_REPO` | 仓库名称（手动覆盖） | Vercel自动检测失败时 |

### 5. 测试API

部署完成后，访问以下URL测试：

- `https://your-domain.vercel.app/aaa` - 随机图片重定向
- `https://your-domain.vercel.app/aaa?type=json` - JSON格式信息

## 错误处理

API会返回相应的错误信息：

- `400`: 未指定文件夹路径
- `404`: 文件夹不存在或文件夹内无图片文件
- `500`: 服务器内部错误

## 支持的图片格式

- JPG/JPEG
- PNG
- GIF
- WebP
- BMP
- SVG

## 注意事项

1. **GitHub API限制**：未认证请求每小时限制60次，认证请求每小时限制5000次
2. **文件大小**：建议图片文件不要过大，以确保快速响应
3. **缓存**：API响应设置了no-cache，确保每次都是随机图片
4. **私有仓库**：需要设置GITHUB_TOKEN环境变量

## 本地开发

1. 克隆项目：
   ```bash
   git clone <your-repo-url>
   cd github-random-image-api
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建 `.env.local` 文件：
   ```
   GITHUB_OWNER=your-username
   GITHUB_REPO=your-repo
   GITHUB_TOKEN=your-token
   ```

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

5. 访问 `http://localhost:3000/folder_name` 测试

## 许可证

MIT License