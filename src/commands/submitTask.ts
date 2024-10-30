import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { parseTaskId } from '../utils/parseOutput';

export function submitTask() {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'shellscript') {
        const filePath = editor.document.fileName;
        const fileDir = path.dirname(filePath);
        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Pjsub Terminal');
        terminal.show();
        terminal.sendText(`cd "${fileDir}" && pjsub "${filePath}"`, true);

        // 获取任务ID
        terminal.processId.then(pid => {
            exec(`pjsub "${filePath}"`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error submitting task: ${stderr}`);
                    return;
                }
                const taskId = parseTaskId(stdout);
                if (taskId === 'unknown') {
                    vscode.window.showErrorMessage('Failed to parse task ID.');
                    return;
                }
                vscode.window.showInformationMessage(`Task submitted with ID: ${taskId}`);

                // 启动定时器，每隔1分钟检查任务状态
                const interval = setInterval(() => {
                    exec(`pjstat ${taskId}`, (error, stdout, stderr) => {
                        if (error || stdout.includes('No such job')) {
                            clearInterval(interval);
                            vscode.window.showWarningMessage(`Task ${taskId} has stopped.`);
                        }
                    });
                }, 60000); // 每隔1分钟检查一次

                // 10分钟后停止检查任务状态
                setTimeout(() => {
                    clearInterval(interval);
                    vscode.window.showInformationMessage(`Stopped monitoring task: ${taskId}`);
                }, 600000); // 10分钟后停止
            });
        });
    } else {
        vscode.window.showErrorMessage("This file is not supported for PJ Sub submission.");
    }
}