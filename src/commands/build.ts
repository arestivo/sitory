import { AssetManager } from '../classes/assets'
import { TemplateManager } from '../classes/templates'
import { ConfigurationManager } from '../classes/configuration'
import { PublicManager } from '../classes/public '
import { ContentManager } from '../classes/contents'

export async function build(config: string = 'config.yaml') {
  const configuration : ConfigurationManager = await new ConfigurationManager().mergeFile(config)

  const output : PublicManager = new PublicManager(configuration.config)
  const assets : AssetManager = new AssetManager(configuration.config)
  const templates : TemplateManager = new TemplateManager(configuration.config)
  const content : ContentManager = new ContentManager(configuration)

  output.emptyPublic()
    .then(() => templates.loadPartials())
    .then(() => templates.registerHelpers(configuration.config))
    .then(() => assets.copyToPublic())
    .then(() => content.generateAll())
    .catch(e => console.log(`\x1B[31m${e}`))
}