module.exports = {
  apps: [
    {
      // 应用名称，对应你 Python 脚本中的 PM2_APP_NAME
      name: 'kakashitech-mvp',

      // Next.js Standalone 模式的启动入口文件
      script: 'server.js',

      // 运行目录（在 standalone 架构下填当前目录即可）
      cwd: './',

      // 实例数量：
      // - 'max' 或 0: 开启 Cluster 模式，利用所有 CPU 核心（高并发首选）
      // - 1: 单实例 fork 模式（适合小内存 EC2，如 t2.micro/t3.micro）
      instances: 1,
      exec_mode: 'fork', // 如果 instances > 1，请将 exec_mode 改为 'cluster'

      // 环境变量设置
      env: {
        NODE_ENV: 'production',
        PORT: 3000,          // 对应你 Python 脚本中的 NEXT_PORT
        HOSTNAME: '0.0.0.0', // 监听所有网卡接口，确保 Nginx/外部可访问
      },

      // 日志配置（可选）
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',

      // 性能与稳定性控制
      max_memory_restart: '1G', // 内存超过 1G 自动重启防内存泄漏
      autorestart: true,        // 崩溃自动重启
      watch: false,             // 生产环境关闭文件监听
    },
  ],
};