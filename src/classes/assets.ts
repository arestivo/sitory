import * as fs from 'fs-extra'

import { Configuration } from './configuration'
import { PublicManager } from './public '

export class AssetManager {
  static folder = 'assets'

  config : Configuration

  constructor(config: Configuration) {
    this.config = config
  }

  async copyToPublic() {
    console.log(`Copied assets from ${AssetManager.folder} to ${PublicManager.folder}`)
    return fs.copy(AssetManager.folder, PublicManager.folder)
  }
}