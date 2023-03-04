import tinify from 'tinify'
import ora from 'ora'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import { IMAGE_SOURCE_ROOT } from '../../lib/constant'

tinify.key = '37BGzDLrtCjRtwgSYqwX6brdRb3kVpWY'
const spinner = ora()

const minify = async () => {
  spinner.start(chalk.blue('Try to read images'))

  const imageNameList = await fs.readdir(IMAGE_SOURCE_ROOT)
  spinner.text = chalk.blue('Try to compress images')

  const compressed = await Promise.all(imageNameList.map(async (imageName) => {
    if (!/\.(jpg|jpeg|png)$/gi.test(imageName)) return null

    const filePath = `${IMAGE_SOURCE_ROOT}/${imageName}`
    await tinify.fromFile(filePath).toFile(filePath)

    return imageName
  }))

  spinner.info(`"${compressed.filter(name => !!name).join('", "')}" was compressed.`)
  spinner.succeed(chalk.green('Minify Finished'))
  spinner.stop()
}

export default minify
