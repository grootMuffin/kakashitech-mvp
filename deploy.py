#!/usr/bin/env python3
import os
import sys
import shutil
import subprocess

from string import Template

# ==================== 配置区 ====================
SERVER_USER = "ec2-user"                  # 服务器 SSH 用户名
SERVER_IP = "35.76.32.196"                 # 服务器公网 IP
SERVER_PATH = "/home/ec2-user/kakashitech-mvp"      # 服务器站点根目录
SSH_KEY = os.path.expanduser("/Users/grootzhang/Documents/key/my-porfile-key.pem")  # SSH 私钥路径
# SSH_KEY = os.path.expanduser("~/.ssh/id_ed25519.pub")  # SSH 私钥路径
SSH_PORT = "22"                            # SSH 端口
PM2_APP_NAME = "kakashitech-mvp"               # PM2 应用名称
NEXT_PORT = "3000"                         # Next.js 内部运行端口
# DOMAIN_OR_IP = "www.tanelink.com"         # 你的域名或公网 IP（用于 Nginx 配置）
# ================================================

def run_cmd(cmd, shell=True, check=True):
    """执行本地命令并打印日志"""
    print(f"🛠️ 执行: {cmd}")
    res = subprocess.run(cmd, shell=shell, check=check, text=True)
    return res

def run_remote_cmd(ssh_cmd_str):
    """通过 SSH 执行远端服务器命令"""
    ssh_base = f'ssh -i "{SSH_KEY}" -p {SSH_PORT} {SERVER_USER}@{SERVER_IP}'
    full_cmd = f'{ssh_base} "{ssh_cmd_str}"'
    return run_cmd(full_cmd)

def main():
    try:
        print("\n🚀 [1/5] 本地构建打包 (npm run build)...")
        run_cmd("npm run build")

        print("\n📁 [2/5] 整理 Standalone 产物目录...")
        standalone_dir = os.path.join(".next", "standalone")
        
        # 1. 复制 .next/static -> .next/standalone/.next/static
        target_static = os.path.join(standalone_dir, ".next", "static")
        os.makedirs(target_static, exist_ok=True)
        shutil.copytree(os.path.join(".next", "static"), target_static, dirs_exist_ok=True)

        # 2. 复制 public -> .next/standalone/public
        target_public = os.path.join(standalone_dir, "public")
        if os.path.exists("public"):
            shutil.copytree("public", target_public, dirs_exist_ok=True)

        # 3. 如果有 ecosystem.config.js 复制过去
        if os.path.exists("ecosystem.config.js"):
            shutil.copy("ecosystem.config.js", standalone_dir)

        print("\n📡 [3/5] 使用 rsync 指定私钥增量同步文件至服务器...")
        rsync_cmd = (
            f'rsync -avz --delete '
            f'-e "ssh -i {SSH_KEY} -p {SSH_PORT}" '
            f'{standalone_dir}/ '
            f'{SERVER_USER}@{SERVER_IP}:{SERVER_PATH}/'
        )
        run_cmd(rsync_cmd)

        print("\n🌐 [4/5] 清除DNS缓存")
        run_cmd("aws cloudfront create-invalidation --distribution-id E10NS07EAF5KAI --paths '/*' --no-cli-pager")
          
        print("\n🔄 [5/5] 重启/平滑重载 PM2 进程...")
        remote_pm2_script = f'''
        mkdir -p {SERVER_PATH}
        cd {SERVER_PATH}
        if [ -f "ecosystem.config.js" ]; then
            pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
        else
            pm2 reload {PM2_APP_NAME} || PORT={NEXT_PORT} pm2 start server.js --name "{PM2_APP_NAME}"
        fi
        pm2 save
        '''
        run_remote_cmd(remote_pm2_script)

        print("\n🎉 ==========================================")
        print("✅ 部署完成！Next.js PM2 已成功运行。")
        print("==========================================\n")

    except subprocess.CalledProcessError as e:
        print(f"\n❌ 部署终止：命令执行失败 (exit code: {e.returncode})")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 部署出错: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()