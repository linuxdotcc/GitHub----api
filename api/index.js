// 首页API - 显示使用说明
export default function handler(req, res) {
  const baseUrl = `https://${req.headers.host}`;
  
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub随机图片API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        .api-example {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            border-left: 4px solid #007bff;
        }
        .code {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Monaco', 'Consolas', monospace;
        }
        .feature {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .feature-icon {
            margin-right: 10px;
            font-size: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎲 GitHub随机图片API</h1>
        <p>基于GitHub存储的随机图片API服务</p>
        <p><strong>🏠 图片直接从本仓库根目录获取</strong></p>
    </div>

    <h2>🚀 使用方法</h2>
    
    <div class="api-example">
        <h3>随机获取图片（重定向）</h3>
        <div class="code">GET ${baseUrl}/folder_name</div>
        <p>例如：<a href="${baseUrl}/aaa" target="_blank">${baseUrl}/aaa</a></p>
        <p><small>💡 图片需要放在本仓库根目录的 aaa 文件夹中</small></p>
    </div>

    <div class="api-example">
        <h3>获取图片信息（JSON格式）</h3>
        <div class="code">GET ${baseUrl}/folder_name?type=json</div>
        <p>例如：<a href="${baseUrl}/aaa?type=json" target="_blank">${baseUrl}/aaa?type=json</a></p>
    </div>

    <h2>✨ 功能特点</h2>
    <div class="feature">
        <span class="feature-icon">🎲</span>
        <span>随机返回指定文件夹内的图片</span>
    </div>
    <div class="feature">
        <span class="feature-icon">🏠</span>
        <span>图片从本仓库根目录获取，无需外部配置</span>
    </div>
    <div class="feature">
        <span class="feature-icon">📁</span>
        <span>支持多级文件夹结构</span>
    </div>
    <div class="feature">
        <span class="feature-icon">🖼️</span>
        <span>支持多种图片格式（jpg, png, gif, webp等）</span>
    </div>
    <div class="feature">
        <span class="feature-icon">⚡</span>
        <span>Vercel自动检测仓库信息</span>
    </div>
    <div class="feature">
        <span class="feature-icon">📊</span>
        <span>支持JSON格式返回详细信息</span>
    </div>

    <h2>📝 JSON响应示例</h2>
    <div class="code">
{
  "success": true,
  "image": {
    "name": "image1.jpg",
    "url": "https://raw.githubusercontent.com/user/repo/main/aaa/image1.jpg",
    "size": 123456,
    "path": "aaa/image1.jpg"
  },
  "folder": "aaa",
  "totalImages": 5
}
    </div>

    <h2>🛠️ 部署说明</h2>
    <p>1. <strong>在本仓库根目录创建文件夹并上传图片</strong></p>
    <p>2. 将整个仓库（包含图片）部署到Vercel</p>
    <p>3. Vercel会自动检测仓库信息，通常无需配置环境变量</p>
    <p>4. 访问 your-domain.vercel.app/folder_name 即可使用</p>
    
    <h2>📁 仓库结构示例</h2>
    <div class="code">
github-random-image-api/
├── api/           # API代码
├── aaa/           # 图片文件夹
│   ├── img1.jpg
│   └── img2.png
├── bbb/           # 另一个图片文件夹
│   └── photo.gif
└── README.md
    </div>

    <div class="footer">
        <p>GitHub随机图片API | 部署在 <a href="https://vercel.com" target="_blank">Vercel</a></p>
    </div>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}