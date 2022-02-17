import * as fs from 'fs-extra'
import * as hb from 'handlebars'

import _ from 'lodash'

import { marked } from 'marked'
import hljs from 'highlight.js'

import { Configuration, ConfigurationManager } from './configuration'

import { copyContentToPublic, getExtension, removeExtension, replaceExtension } from '../utils/files'
import { TemplateManager } from './templates'
import { PublicManager } from './public '

export class ContentManager {
  static folder = 'content'

  context: ConfigurationManager
  
  constructor(context: ConfigurationManager) {
    this.context = context
  }
 
  static markdown(md: string, base: string) {
    return marked.parse(md, { baseUrl: base, highlight: (code, lang) => hljs.highlight(code, {language: lang}).value})
  }

  async readPreamble(content: string) {
    const trimmed = content.trim();
    const re = new RegExp('---(.*)---(.*)', 'sm')

    const match = trimmed.match(re)
    if (match) return [match[1], match[2]]

    return [undefined, trimmed]
  }

  async generateOne(context: ConfigurationManager, path: string, file: string) {
    const [preamble, markdown] = await 
      fs.readFile(`${ContentManager.folder}${path}${file}`, 'utf8')
        .then(content => this.readPreamble(content))

    if (preamble) context = await context.mergePreamble(preamble)

    const filename = `${TemplateManager.folder}/pages/${context.config.template}.hbs`

    const layout = await fs.readFile(filename, 'utf8')
      .catch(_ => {throw `Can't read layout file ${filename}`})

    const base = (context.config.baseUrl + path + (file === 'index.md' ? '' : (removeExtension(file) + '/'))).replace('//', '/')

    const empty = hb.compile(markdown, { noEscape: true })
    const content = ContentManager.markdown(empty({}), base)
    const template = hb.compile(layout)

    const rendered = template({ content, data: context.config })

    this.writeToPublic(context.config, path, replaceExtension(file, 'html'), rendered)

    console.log(`Generated ${ContentManager.folder}${path}${file}`)
  }

  async generateAll(path: string = '/') {
    const merged = await this.context.mergeFile(`${ContentManager.folder}${path}config.yaml`)

    await fs.ensureDir(`${PublicManager.folder}${path}`)

    const files = await fs.readdir(`${ContentManager.folder}${path}`)

    for (const file of files) {
      if ((await fs.lstat(`${ContentManager.folder}/${path}${file}`)).isDirectory()) 
        await new ContentManager(merged).generateAll(`${path}${file}/`)
      else {
        if (file.endsWith('.md')) await this.generateOne(merged, path, file)
        else await copyContentToPublic(merged.config, path, file)  
      }
    }
  }

  async writeToPublic(config: Configuration, path: string, file: string, content: string) {
    if (file === 'index.html') file = ''
    else file = removeExtension(file)

    await fs.ensureDir(`${PublicManager.folder}${path}${file}`)

    fs.writeFile(`${PublicManager.folder}/${path}${file}/index.html`, content)
  }
}