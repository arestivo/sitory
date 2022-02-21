import * as fs from 'fs-extra'
import { AssetManager } from './assets'

import { Configuration } from "./configuration"
import { ContentManager } from './contents'

export class PublicManager {
  static folder = 'public'

  config: Configuration

  constructor(config: Configuration) {
    this.config = config
  }

  async emptyPublic() {
    if (!fs.pathExistsSync(ContentManager.folder)) throw `This doesn't seem a sitory folder`
    if (!fs.statSync(ContentManager.folder).isDirectory()) throw `This doesn't seem a sitory folder`

    if (!fs.pathExistsSync(AssetManager.folder)) throw `This doesn't seem a sitory folder`
    if (!fs.statSync(AssetManager.folder).isDirectory()) throw `This doesn't seem a sitory folder`

    return fs.rmdir(PublicManager.folder, { recursive: true })
             .then(() => fs.promises.mkdir(PublicManager.folder))
  }  
}