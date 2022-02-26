import * as hb from 'handlebars'
import * as fs from 'fs-extra'

import { Configuration } from './configuration';
import { getExtension, removeExtension } from '../utils/files';
import { ContentManager } from './contents';

export class TemplateManager {
  static folder = 'layouts'

  config: Configuration

  constructor(config: Configuration) {
    this.config = config
  }

  async loadPartials() {
    const partials = await fs.readdir(`${TemplateManager.folder}/partials`)

    for (const partial of partials) {
      if (getExtension(partial) !== 'hbs') return
      const name = removeExtension(partial)
      hb.registerPartial(name, hb.compile(await fs.readFile(`${TemplateManager.folder}/partials/${partial}`, 'utf8')))
    }
  }

  async registerHelpers(config: Configuration) {
    hb.registerHelper("md", function(markdown: string) {
      const empty = hb.compile(markdown, { noEscape: true })
      const content = ContentManager.markdown(empty({data: config}), config.baseUrl)
  
      return new hb.SafeString(content)
    });
  }
}