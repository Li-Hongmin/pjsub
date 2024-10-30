# backend/utils/pjstat_parser.py
import subprocess

def parse_pjstat_output():
    # 模拟pjstat命令的输出解析
    result = subprocess.run(['pjstat'], stdout=subprocess.PIPE)
    output = result.stdout.decode('utf-8')
    # 解析输出
    return {
        "nodes": {
            "short-a": "50%",
            "regular-a": "70%",
            "share-interactive": "30%"
        },
        "gpus": {
            "gpu1": "60%",
            "gpu2": "80%"
        }
    }