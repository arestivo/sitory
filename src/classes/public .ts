import * as fs from 'fs-extra'

import { Configuration } from "./configuration"

export class PublicManager {
  static folder = 'public'

  config: Configuration

  constructor(config: Configuration) {
    this.config = config
  }

  async emptyPublic() {
    return fs.rmdir(PublicManager.folder, { recursive: true })
             .then(() => fs.promises.mkdir(PublicManager.folder))
  }  
}