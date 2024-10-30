import * as vscode from "vscode";

// 生成 .sh 文件内容
export function generateShFileContent(workspaceFolder: string, pythonFileName: string): string {
    const resourceGroup = vscode.workspace.getConfiguration().get("pjsub.resourceGroup", "default-group");
    const nodeCount = vscode.workspace.getConfiguration().get("pjsub.nodeCount", "1");
    const elapsedTime = vscode.workspace.getConfiguration().get("pjsub.elapsedTime", "2:00:00");
    const projectGroup = vscode.workspace.getConfiguration().get("pjsub.projectGroup", "default-project");
    const joinOutput = vscode.workspace.getConfiguration().get("pjsub.joinOutput", true);

    return `#!/bin/sh

#------ pjsub option --------# 
#PJM -L rscgrp=${resourceGroup}
#PJM -L node=${nodeCount}
#PJM -L elapse=${elapsedTime}
#PJM -g ${projectGroup}
${joinOutput ? "#PJM -j" : ""}

#------- Program execution -------#

export MPLCONFIGDIR="/data/scratch/gg53/d58004/matplotlib"
export WANDB_CONFIG_DIR="/data/scratch/gg53/d58004/wandb"
export TRANSFORMERS_CACHE="/data/scratch/gg53/d58004/transformers"
rm -rf /data/scratch/gg53/d58004/bin
cp -r /work/gs58/d58004/mambaforge/bin/ /data/scratch/gg53/d58004/bin
export PATH="/data/scratch/gg53/d58004/bin:$PATH"
export PATH="/work/gs58/d58004/mambaforge/bin/:$PATH"
export TF_ENABLE_ONEDNN_OPTS=0
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
cd ${workspaceFolder}
python ${pythonFileName}`;
}