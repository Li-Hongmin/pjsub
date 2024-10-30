# backend/install_and_run.py
import subprocess
import os

def install_dependencies():
    # 安装所需的Python包
    subprocess.check_call([os.sys.executable, '-m', 'pip', 'install', 'fastapi', 'uvicorn'])

def start_monitoring_service():
    # 启动FastAPI服务
    subprocess.Popen([os.sys.executable, 'server.py'])

if __name__ == "__main__":
    install_dependencies()
    start_monitoring_service()