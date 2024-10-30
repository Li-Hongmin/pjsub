# backend/server.py
from fastapi import FastAPI
from utils.pjstat_parser import parse_pjstat_output

app = FastAPI()

@app.get("/api/resource-usage")
def get_resource_usage():
    # 调用pjstat命令并解析输出
    output = parse_pjstat_output()
    return output

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)