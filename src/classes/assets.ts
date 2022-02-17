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
    return fs.copy(AssetManager.folder, PublicManager.folder)
  }
}