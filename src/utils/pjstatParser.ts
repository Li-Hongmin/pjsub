import { exec } from 'child_process';

interface TaskInfo {
    jobId: string;
    jobName: string;
    status: string;
    project: string;
    rscGroup: string;
    startDate: string;
    elapse: string;
    token: string;
    node: string;
    gpu: string;
}

interface PjstatInfo {
    scheduledStopTime: string;
    remain: string;
    tasks: TaskInfo[];
}

function parsePjstatOutput(output: string): PjstatInfo {
    const lines = output.split('\n').filter(line => line.trim() !== '');
    const scheduledStopTimeLine = lines[0].split(': ');
    const scheduledStopTime = scheduledStopTimeLine[1].split(' (')[0];
    const remain = scheduledStopTimeLine[2].split(')')[0];
    const tasks: TaskInfo[] = [];

    for (let i = 2; i < lines.length; i++) { // 跳过前两行
        const columns = lines[i].trim().split(/\s+/);
        if (columns.length >= 10) {
            tasks.push({
                jobId: columns[0],
                jobName: columns[1],
                status: columns[2],
                project: columns[3],
                rscGroup: columns[4],
                startDate: columns[5] + ' ' + columns[6],
                elapse: columns[7],
                token: columns[8],
                node: columns[9],
                gpu: columns[10]
            });
        }
    }

    return { scheduledStopTime, remain, tasks };
}

function getPjstatInfo(): Promise<PjstatInfo> {
    return new Promise((resolve, reject) => {
        exec('pjstat', (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing pjstat: ${stderr}`);
                return;
            }
            const pjstatInfo = parsePjstatOutput(stdout);
            resolve(pjstatInfo);
        });
    });
}

export { getPjstatInfo, TaskInfo, PjstatInfo };


// $ pjstat
// Wisteria/BDEC-01 scheduled stop time: 2024/11/22(Fri) 09:00:00 (Remain: 22days 16:58:59)

// JOB_ID       JOB_NAME   STATUS  PROJECT    RSCGROUP          START_DATE        ELAPSE           TOKEN           NODE  GPU
// 5170490      J03_signal RUNNING gg53       short-a           10/30 15:39:41<   00:21:21           8.5              1    8
// $ pjstat
// Wisteria/BDEC-01 scheduled stop time: 2024/11/22(Fri) 09:00:00 (Remain: 22days 16:57:27)

// JOB_ID       JOB_NAME   STATUS  PROJECT    RSCGROUP          START_DATE        ELAPSE           TOKEN           NODE  GPU
// 5170490      J03_signal RUNNING gg53       short-a           10/30 15:39:41<   00:22:53           9.2              1    8
// 5170610      J01_exampl RUNNING gg53       short-a           10/30 16:01:38<   00:00:56           0.4              1    8
// 5170614      J01_exampl QUEUED  gg53       short-a           (10/30 18:00)<    00:00:00        (48.0)              1    8