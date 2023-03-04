import { spawn } from 'child_process';
import * as path from 'path';
import { MODULE_ROOT, BUILD_ROOT } from './constant';
import spinner from './spinner';
import chalk from 'chalk';
export default function (module) {
    return new Promise((resolve, reject) => {
        const MODULE_ENTRY = path.resolve(MODULE_ROOT, `${module}/index.ts`);
        const argument = [
          '--moduleResolution', 'node',
          '--allowSyntheticDefaultImports',
          '--outDir', BUILD_ROOT,
          '--rootDir', MODULE_ROOT,
          '--pretty',
          '--module', 'esnext',
          '--target', 'esnext',
          MODULE_ENTRY
        ];
        spinner.start(`> tsc ${argument.join(' ')}\n`);
        const tsc = spawn('tsc', argument);
        tsc.stdout.on('data', data => console.log(`${chalk.red('TSC:')}\n ${data}`));
        // tsc.stderr.on('data', data => console.error(`${chalk.red('TSC ERROR:')} ${data}`))
        tsc.on('close', code => {
            if (code) {
                spinner.fail(chalk.red('Compile failed'));
                return reject(new Error(`Compile process exited with code ${code}`));
            }
            spinner.succeed('Compile succeed');
            resolve(code);
        });
        // tsc.on('error', (err) => {
        //   spinner.fail(chalk.red(`Compile failed due to:\n`))
        //   console.log(err)
        //
        //   reject(err)
        // })
    });
}
