import * as fs from 'fs-extra'

import _ from 'lodash'
import yaml from 'js-yaml'
import { DataManager } from './data'

export type Configuration = { 
  baseUrl: string,
  template: string
}

export class ConfigurationManager {
  static defaults : Configuration = { 
    baseUrl: '/',
    template: 'default'
  }

  config : Configuration

  constructor(config: Configuration = ConfigurationManager.defaults) {
    this.config = config
  }

  async process(config: any) {
    const data : DataManager = new DataManager()

    for (const key in config) {
      if (typeof config[key] === 'object') config[key] = await this.process(config[key])
      else {
        const match = config[key].match(/=(.*)=/)
        if (match) config[key] = await data.load(match[1])
      }
    }
    return config
  }

  async mergeFile(file: string) {
    const clone = _.clone(this.config)

    try {
      const contents = await fs.readFile(file, 'utf8')
      const loaded = await this.process(yaml.load(contents))

      return new ConfigurationManager(_.merge(clone, loaded))
    } catch(e: any) { 
      if (typeof e === 'string') throw e
      if (e.mark !== undefined) throw `Error parsing ${file}`
    }

    return new ConfigurationManager(clone)
  }

  async mergePreamble(preamble: string) {
    const clone = _.clone(this.config)

    try {
      const loaded = await this.process(yaml.load(preamble))

      return new ConfigurationManager(_.merge(clone, loaded))
    } catch(e: any) { 
      if (typeof e === 'string') throw e
      if (e.mark !== undefined) throw `Error parsing preamble`
    }

    return new ConfigurationManager(clone)
  }

}