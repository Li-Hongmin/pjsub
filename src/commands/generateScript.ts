import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { generateShFileContent } from '../utils/generateShFile';
import { createOrUpdateScript } from '../utils/createOrUpdateScript';
import { submitScript } from '../utils/submitScript';

export async function generateShScript(shouldSubmit: boolean) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'python') {
        vscode.window.showErrorMessage("Open a Python file to generate PJ Sub script.");
        return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("Open a workspace first.");
        return;
    }

    const pythonFileName = path.basename(editor.document.fileName);
    const pjsubScriptsFolder = path.join(workspaceFolder, 'pjsub_scripts');

    if (!fs.existsSync(pjsubScriptsFolder)) {
        fs.mkdirSync(pjsubScriptsFolder);
    }

    const nextIndex = String(fs.readdirSync(pjsubScriptsFolder)
    .filter(file => file.endsWith('.sh') && !file.includes('.out')) // 过滤掉 .out 文件
    .length + 1).padStart(2, '0');

    const shFileName = `${nextIndex}_${pythonFileName.replace('.py', '')}.sh`;
    const shFilePath = path.join(pjsubScriptsFolder, shFileName);


    const shFileContent = generateShFileContent(workspaceFolder, pythonFileName);
    const finalFilePath = createOrUpdateScript(shFilePath, shFileContent, pjsubScriptsFolder, pythonFileName.replace('.py', ''));

    if (shouldSubmit && finalFilePath) {
        submitScript(finalFilePath);
    }
}
