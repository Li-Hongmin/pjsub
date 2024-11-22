import * as vscode from "vscode";

// 生成 .sh 文件内容
export function generateShFileContent(workspaceFolder: string, pythonFileName: string): string {
    const resourceGroup = vscode.workspace.getConfiguration().get("pjsub.resourceGroup", "default-group");
    const nodeCount = vscode.workspace.getConfiguration().get("pjsub.nodeCount", "1");
    const elapsedTime = vscode.workspace.getConfiguration().get("pjsub.elapsedTime", "2:00:00");
    const projectGroup = vscode.workspace.getConfiguration().get("pjsub.projectGroup", "default-project");
    const joinOutput = vscode.workspace.getConfiguration().get("pjsub.joinOutput", true);

    const mplConfigDir = vscode.workspace.getConfiguration().get("pjsub.mplConfigDir", "/data/scratch/gg53/d58004/matplotlib");
    const wandbConfigDir = vscode.workspace.getConfiguration().get("pjsub.wandbConfigDir", "/data/scratch/gg53/d58004/wandb");
    const transformersCache = vscode.workspace.getConfiguration().get("pjsub.transformersCache", "/data/scratch/gg53/d58004/transformers");
    const binDir = vscode.workspace.getConfiguration().get("pjsub.binDir", "/data/scratch/gg53/d58004/bin");
    const mambaforgeBinDir = vscode.workspace.getConfiguration().get("pjsub.mambaforgeBinDir", "/work/gs58/d58004/mambaforge/bin");

    return `#!/bin/sh

#------ pjsub option --------# 
#PJM -L rscgrp=${resourceGroup}
#PJM -L node=${nodeCount}
#PJM -L elapse=${elapsedTime}
#PJM -g ${projectGroup}
${joinOutput ? "#PJM -j" : ""}

#------- Program execution -------#

export MPLCONFIGDIR="${mplConfigDir}"
export WANDB_CONFIG_DIR="${wandbConfigDir}"
export TRANSFORMERS_CACHE="${transformersCache}"
rm -rf ${binDir}
cp -r ${mambaforgeBinDir} ${binDir}
export PATH="${binDir}:$PATH"
export PATH="${mambaforgeBinDir}:$PATH"
export TF_ENABLE_ONEDNN_OPTS=0
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
cd ${workspaceFolder}
python ${pythonFileName}`;
}