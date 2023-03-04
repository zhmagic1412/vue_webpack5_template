import {
  DIST_ROOT,
  PROJECT_GAME,
  PROJECT_NAME
} from './constant'
import path from 'path'

const parseUrl = (baseurl) => {
  const url = new URL(baseurl)
  url.pathname += `/${PROJECT_NAME}/`
  return url.href
}

const cdn = (game) => {

  const cdnStore = {
    ff: {
      host: 'garena.upload.akamai.com',
      port: 21,
      user: 'ffwebadmin',
      password: 'hei8zoop5LiQuog8Iey2',
      connTimeout: 10000,
      pasvTimeout: 10000,
      keepalive: 10000,
      domain: 'https://dl.dir.freefiremobile.com/',
      uploadDir: '/116476/mgames/ffmhk/common/web_event',
      testImg: '/images/favicon.png',
      sourceDir: DIST_ROOT,
      targetDir: path.resolve('/116476/mgames/ffmhk/common/web_event/', PROJECT_NAME),
      cdnPath: parseUrl('https://dl.dir.freefiremobile.com/common/web_event'),
    },

    bmg: {
      host: 'garena.upload.akamai.com',
      port: 21,
      user: 'bmg_resource_web',
      password: '2ZG4Tscu77C9P8Mf',
      connTimeout: 10000,
      pasvTimeout: 10000,
      keepalive: 10000,
      domain: 'https://resource.blockmanmobile.com/',
      uploadDir: '/116476/mgames/bmg/web',
      testImg: '/images/favicon.png',
      sourceDir: DIST_ROOT,
      targetDir: path.resolve('/116476/mgames/bmg/web', PROJECT_NAME),
      cdnPath: parseUrl('https://resource.blockmanmobile.com/web'),
    }
  }

  return cdnStore[game] || cdnStore['ff']
}

export default cdn(PROJECT_GAME)