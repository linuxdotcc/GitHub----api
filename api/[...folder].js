// GitHub随机图片API
// 支持访问 https://xxx.vercel.app/folder_name 来随机返回指定文件夹内的图片
// 图片从本仓库根目录获取

export default async function handler(req, res) {
  try {
    // 获取文件夹路径
    const { folder } = req.query;
    const folderPath = Array.isArray(folder) ? folder.join('/') : folder;
    
    // 调试信息
    console.log('req.query:', req.query);
    console.log('folder:', folder);
    console.log('folderPath:', folderPath);
    
    if (!folderPath) {
      return res.status(400).json({
        error: '请指定文件夹路径',
        usage: 'https://your-domain.vercel.app/folder_name',
        debug: {
          query: req.query,
          folder: folder,
          url: req.url
        }
      });
    }

    // 自动获取当前仓库信息
    const VERCEL_GIT_REPO_OWNER = process.env.VERCEL_GIT_REPO_OWNER;
    const VERCEL_GIT_REPO_SLUG = process.env.VERCEL_GIT_REPO_SLUG;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // 可选，用于私有仓库或提高API限制
    
    // 如果没有Vercel环境变量，使用手动配置
    const GITHUB_OWNER = VERCEL_GIT_REPO_OWNER || process.env.GITHUB_OWNER || 'linuxdotcc';
    const GITHUB_REPO = VERCEL_GIT_REPO_SLUG || process.env.GITHUB_REPO || 'GitHub----api';

    // 调试信息
    console.log('VERCEL_GIT_REPO_OWNER:', VERCEL_GIT_REPO_OWNER);
    console.log('VERCEL_GIT_REPO_SLUG:', VERCEL_GIT_REPO_SLUG);
    console.log('GITHUB_OWNER:', GITHUB_OWNER);
    console.log('GITHUB_REPO:', GITHUB_REPO);

    // 构建GitHub API URL - 从本仓库根目录获取
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${folderPath}`;
    console.log('GitHub API URL:', apiUrl);
    
    // 设置请求头
    const headers = {
      'User-Agent': 'Random-Image-API',
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // 获取文件夹内容
    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('GitHub API Error Response:', errorText);
      
      if (response.status === 404) {
        return res.status(404).json({
          error: `无法访问文件夹 '${folderPath}'`,
          repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
          note: GITHUB_TOKEN ?
            '请确保在仓库根目录下创建了对应的文件夹并上传了图片' :
            '如果这是私有仓库，请在 Vercel 环境变量中添加 GITHUB_TOKEN',
          solutions: [
            '1. 将 GitHub 仓库设为公开（推荐）',
            '2. 在 Vercel 项目设置中添加环境变量 GITHUB_TOKEN（GitHub Personal Access Token）'
          ],
          debug: {
            apiUrl: apiUrl,
            status: response.status,
            hasToken: !!GITHUB_TOKEN,
            response: errorText,
            headers: Object.fromEntries(response.headers.entries())
          }
        });
      }
      throw new Error(`GitHub API错误: ${response.status} - ${errorText}`);
    }

    const files = await response.json();
    
    // 过滤出图片文件
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const imageFiles = files.filter(file =>
      file.type === 'file' &&
      imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      return res.status(404).json({
        error: `文件夹 '${folderPath}' 中没有找到图片文件`,
        supportedFormats: imageExtensions.join(', '),
        note: '请在仓库根目录的对应文件夹中上传图片文件'
      });
    }

    // 随机选择一张图片
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    
    // 获取图片的原始URL
    const imageUrl = randomImage.download_url;
    
    // 检查请求参数，决定返回方式
    const returnType = req.query.type || 'redirect';
    
    if (returnType === 'json') {
      // 返回JSON格式的图片信息
      return res.json({
        success: true,
        image: {
          name: randomImage.name,
          url: imageUrl,
          size: randomImage.size,
          path: randomImage.path
        },
        folder: folderPath,
        totalImages: imageFiles.length,
        repository: `${GITHUB_OWNER}/${GITHUB_REPO}`
      });
    } else {
      // 反代图片内容，而不是重定向
      try {
        const imageResponse = await fetch(imageUrl);
        
        if (!imageResponse.ok) {
          throw new Error(`获取图片失败: ${imageResponse.status}`);
        }
        
        // 获取图片的 Content-Type
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        
        // 设置响应头
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // 禁用缓存确保随机
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('X-Image-Name', randomImage.name);
        res.setHeader('X-Total-Images', imageFiles.length.toString());
        
        // 获取图片数据并返回
        const imageBuffer = await imageResponse.arrayBuffer();
        return res.status(200).send(Buffer.from(imageBuffer));
        
      } catch (proxyError) {
        console.error('反代图片错误:', proxyError);
        return res.status(500).json({
          error: '获取图片失败',
          message: proxyError.message,
          imageUrl: imageUrl
        });
      }
    }

  } catch (error) {
    console.error('API错误:', error);
    return res.status(500).json({
      error: '服务器内部错误',
      message: error.message
    });
  }
}