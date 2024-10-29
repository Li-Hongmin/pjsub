import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

// 提交任务的函数
export function submitTask() {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'shellscript') {
        const filePath = editor.document.fileName;
        const fileDir = path.dirname(filePath);

        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Pjsub Terminal');
        terminal.show();
        terminal.sendText(`cd "${fileDir}" && pjsub "${filePath}"`);
        vscode.window.showInformationMessage(`Submitting task: pjsub ${filePath}`);

        // 设置3秒延迟后执行pjstat命令
        setTimeout(() => {
            terminal.sendText(`pjstat`);
        }, 3000);
    } else {
        vscode.window.showErrorMessage("This file is not supported for PJ Sub submission.");
    }
}
