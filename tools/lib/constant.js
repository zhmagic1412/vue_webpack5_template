import * as path from 'path';
// @ts-ignore
import * as dotenv from 'dotenv'

dotenv.config()
// @ts-ignore
const __dirname = global.__dirname || new URL(import.meta.url).pathname

export const TOOL_ROOT = path.resolve(__dirname, '../../')

export const PROJECT_ROOT = path.resolve(TOOL_ROOT, '..')

export const BASE_ROOT = path.resolve(PROJECT_ROOT, '../..')

export const MOCK_ROOT = path.resolve(PROJECT_ROOT, './mock')

export const DIST_ROOT = path.resolve(PROJECT_ROOT, './dist')

export const MODULE_ROOT = path.resolve(TOOL_ROOT, './modules')

export const BUILD_ROOT = path.resolve(TOOL_ROOT, './build')

export const IMAGE_SOURCE_ROOT = path.resolve(TOOL_ROOT, '../src/assets/images')

export const IMAGE_CSS_SOURCE = path.resolve(TOOL_ROOT, '../static/css/images.css')

export const PROJECT_NAME = process.env['VITE_APP_PROJECT_NAME'] || ''

export const PROJECT_GAME = process.env['VITE_APP_GAME'] || 'ff'

export const TRANSIFY_ID = process.env['VITE_APP_TRANSIFY_ID']
