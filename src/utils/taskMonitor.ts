const vscode = require("vscode");
const { exec } = require("child_process");

let taskCountStatusBarItem;
let taskMonitorInterval;

function startTaskMonitor() {
    if (!taskCountStatusBarItem) {
        taskCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        taskCountStatusBarItem.text = "Tasks: Loading...";
        taskCountStatusBarItem.show();
    }

    // 定义一个函数来检查任务状态
    const checkTaskStatus = () => {
        exec("pjstat", (error, stdout) => {
            if (error) {
                console.error(`Error executing pjstat: ${error.message}`);
                taskCountStatusBarItem.text = "Tasks: Error";
                return;
            }
            const taskCount = parseTaskCount(stdout);
            taskCountStatusBarItem.text = `Tasks: ${taskCount}`;
        });
    };

    // 先执行一次任务检查
    checkTaskStatus();

    // 定时监视任务，每隔1分钟执行一次
    taskMonitorInterval = setInterval(checkTaskStatus, 60000);
}

function stopTaskMonitor() {
    if (taskMonitorInterval) {
        clearInterval(taskMonitorInterval);
        taskMonitorInterval = null;
    }
    if (taskCountStatusBarItem) {
        taskCountStatusBarItem.hide();
    }
}

function parseTaskCount(output) {
    // 过滤任务行（假设有效任务行以JOB_ID或数字开头）
    const taskLines = output.split("\n").filter(line => /^\d+/.test(line.trim()));
    return taskLines.length;
}

module.exports = {
    startTaskMonitor,
    stopTaskMonitor
};
