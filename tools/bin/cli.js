#!/usr/bin/env node --experimental-specifier-resolution=node
/**
 * 形式：
 * cli [options] <module> [module options]
 * cli options:
 *    -h --help     打印帮助信息
 *    --rebuild     重新编译
 *    --clean       删除 build 文件夹 ( 如果与 --build flag 同时出现，则只会在编译前删除 build 文件夹 )
 *
 * 会试图直接运行 build 文件夹里的内容，如果没有找到则会进行编译。
 */
import chalk from 'chalk'
import * as fsPromises from 'fs/promises'
import { constants as fsConstant } from 'fs'
import * as path from 'path'

import spinner from '../lib/spinner'
import compile from '../lib/compile'
import execModule from '../lib/module-execute'
import { BUILD_ROOT, MODULE_ROOT } from '../lib/constant'
import runScript from '../lib/exec'

const handleToolFlags = async (flags, module = '') => {
  const invalidFlags = []
  for (const flag of flags) {
    if (flag === '--clean' || flag === '--rebuild' || flag === '--rm')
      continue
    invalidFlags.push(flag)
  }

  if (invalidFlags.length) spinner.warn(chalk.yellow(`Unknown arguments "${invalidFlags.join('", "')}"`))
  if (flags.includes('--clean')) {
    try {
      spinner.start('Deleting build dictionary')
      await fsPromises.rm(BUILD_ROOT, { recursive: true, force: true })
      spinner.succeed('Build dictionary deleted.')
    } catch (e) {
      spinner.warn(chalk.yellow('Error occurred when try to delete build dictionary:\n' + e))
    }
  }

  if (flags.includes('--rebuild')) {
    if (!module) return Promise.reject(new Error('No module was specified, exit.'))
    await compile(module)
  }
  return Promise.resolve()
}
const dispatcher = async (args) => {

  if (!args.length) {
    throw new Error('No arguments provided, exit.')
  }

  if (args.length === 1 && (args[0] === '-h' || args[0] === '--help')) {
    console.log(`
Usage:
cli [options] <module> [module options]

Options:
    -h, --help      打印此帮助信息并退出
    --rebuild       重新编译 ( 当且仅当模块文件夹中有 index.ts 时，此选项才会生效 )
    --clean         删除 build 文件夹 ( 如果与 --build flag 同时出现，则只会在编译前删除 build 文件夹 )
    --rm            运行后删除 build 文件夹

Module:
    想要运行的模块名称

Module Options:
    模块执行时需要的参数
`)
    process.exit(0)
    // return Promise.resolve()
  }

  const moduleArgIndex = args.findIndex(str => str[0] !== '-')

  if (moduleArgIndex < 0) {
    return await handleToolFlags(args)
  }

  const flag = args.slice(0, moduleArgIndex)
  const moduleName = args[moduleArgIndex]
  const moduleFlags = args.slice(moduleArgIndex + 1)

  await fsPromises.access(path.resolve(MODULE_ROOT, moduleName))
    .catch(() => { throw new Error(`Module "${chalk.bold(moduleName)}" is not exist`) })
  /**
   * 如果在模块文件夹中找到 run-script 就直接执行
   * 否则找到 index.[m|c]js 就直接执行 (可能会报模块类型引用错误)
   * 否则找有没有已经编译完成的文件
   * 否则如果找到 index.ts 就编译后执行
   */

  const moduleFiles = await fsPromises.readdir(path.resolve(MODULE_ROOT, moduleName))
  // 尝试寻找并运行 run-script 文件
  const runScriptFile = moduleFiles.filter(name => /^run-script.*/gi.test(name))
  if (runScriptFile.length) {
    spinner.info(`"${runScriptFile[0]}" was found, executing...`)
    return await runScript(moduleName, runScriptFile[0], moduleFlags)
  }

  // 尝试寻找并运行 index.js 文件
  const jsEntryFile = moduleFiles.filter(name => /^index.[cm]?js$/.test(name))
  if (jsEntryFile.length) {
    spinner.info(`${jsEntryFile[0]} was found, running...`)
    return await execModule(path.resolve(MODULE_ROOT, moduleName, jsEntryFile[0]), moduleFiles)
  }

  // 如果没有找到 index.ts 文件，则说明模块违法
  const tsEntryFile = moduleFiles.filter(name => /^index.ts$/.test(name))
  if (!tsEntryFile.length) {
    return Promise.reject(new Error('Module must contain one of following files: "index.ts", "index.(c|m)?js", "run-script.*"'))
  }

  // 尝试寻找并运行有没有打包运行的文件
  // 如果有 --rebuild 选项，则需要先重新编译再执行，因此在此执行这个方法
  if (flag.length)
    await handleToolFlags(flag, moduleName)

  try {
    await fsPromises.access(path.resolve(BUILD_ROOT, moduleName, 'index.js'), fsConstant.F_OK)
    if (!args.includes('--rebuild'))
      spinner.info(`Build for ${moduleName} was found, running`)
  } catch (e) {
    spinner.warn('Failed to find build for this module, begin to compile...')
    await compile(moduleName)
  }

  try {
    await execModule(path.resolve(BUILD_ROOT, moduleName), moduleFlags)
  } catch (e) {
    throw e
  } finally {
    if (flag.length && flag.includes('--rm')) {
      await fsPromises.rm(path.resolve(BUILD_ROOT, moduleName), { recursive: true, force: true })
      spinner.succeed('Build file removed')
    }
  }

}
dispatcher(process.argv.slice(2))
  .then(() => spinner.succeed('Process successfully finished'))
  .catch(err => spinner.fail(chalk.red('Failed to finish process due to error: \n' + err.message)))
  .finally(() => spinner.stop())
