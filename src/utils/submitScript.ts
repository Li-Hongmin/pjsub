import * as vscode from "vscode";
import * as path from "path";

// 提交脚本
export function submitScript(shFilePath: string): void {
    const fileDir = path.dirname(shFilePath);
    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Pjsub Terminal');
    terminal.show();
    terminal.sendText(`cd "${fileDir}" && pjsub "${shFilePath}"`);
}