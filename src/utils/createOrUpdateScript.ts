import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// 创建或更新脚本文件，返回最终文件路径
export function createOrUpdateScript(
    shFilePath: string,
    content: string,
    folderPath: string,
    baseFileName: string
): string {
    const existingScript = fs.readdirSync(folderPath)
        .filter((file: string) => file.endsWith('.sh') && !file.includes('.out'))
        .find((file: string) => file.includes(`_${baseFileName}.sh`));

    const existingFilePath = existingScript ? path.join(folderPath, existingScript) : null;

    if (existingFilePath && fs.readFileSync(existingFilePath, 'utf8') === content) {
        vscode.window.showInformationMessage(`Using existing script with matching content: ${existingScript}`);
        return existingFilePath;
    }

    const filePathToWrite = existingFilePath || shFilePath;
    fs.writeFileSync(filePathToWrite, content, 'utf8');
    vscode.window.showInformationMessage(`${existingFilePath ? "Updated" : "Generated"} script: ${path.basename(filePathToWrite)}`);
    return filePathToWrite;
}