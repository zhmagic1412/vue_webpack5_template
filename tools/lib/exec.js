import { spawn } from 'child_process';
import * as path from 'path';
import { MODULE_ROOT } from './constant';
import spinner from './spinner';
import { access as fsAccess } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import chalk from 'chalk';
export default async function (module, script, args) {
    const entry = path.resolve(MODULE_ROOT, module, script);
    const isShellScript = /\.sh$/.test(script);
    if (!isShellScript) {
        try {
            await fsAccess(entry, fsConstants.X_OK);
        }
        catch (e) {
            return Promise.reject(`${e} is not executable`);
        }
    }
    return new Promise((resolve, reject) => {
        let execProcess;
        if (isShellScript) {
            spinner.info(`> sh ${[entry, ...args].join(' ')}\n`);
            execProcess = spawn('sh', [entry, ...args]);
        }
        else {
            spinner.info(`> ${entry} ${args.join(' ')}\n`);
            execProcess = spawn(entry, args);
        }
        spinner.start('Script Running...');
        execProcess.stdout.on('data', buffer => {
            spinner.info(`${chalk.bgBlueBright('Process stdout:\n')} ${buffer}`);
            spinner.start('Script Running...');
        });
        execProcess.stderr.on('data', error => {
            spinner.warn(`${chalk.bgYellow('Process stderr:\n')} ${error}`);
            spinner.start('Script Running...');
        });
        execProcess.on('close', code => {
            if (code) {
                return reject(new Error(`Process failed with code ${code}\n`));
            }
            spinner.succeed('Process execution succeed\n');
            resolve(code);
        });
    });
}
