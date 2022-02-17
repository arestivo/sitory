import * as fs from 'fs-extra'

import _ from 'lodash'
import yaml from 'js-yaml'

export class DataManager {
  static folder = 'data'

  async load(file: string) {
    const filename = `${DataManager.folder}/${file}`
    
    const content = await fs.readFile(filename, 'utf8')
                            .catch(e => {throw `Can't read data in ${filename}`})

    return yaml.load(content)
  }
}