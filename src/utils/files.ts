import * as fs from 'fs-extra'
import yaml from 'js-yaml'

import { Configuration } from '../classes/configuration'
import { ContentManager } from '../classes/contents'
import { PublicManager } from '../classes/public '

export async function copyContentToPublic(config: Configuration, path: string, file: string) {
  console.log(`Copied ${ContentManager.folder}${path}${file}`)
  return fs.copyFile(`${ContentManager.folder}${path}${file}`, `${PublicManager.folder}/${path}${file}`)
}

export function getExtension(file: string) {
  return file.split('.').pop() || ''
}

export function removeExtension(file: string) {
  const parts = file.split('.')
  parts.pop()
  return parts.join('.')
}

export function replaceExtension(file: string, extension: string) {
  const parts = file.split('.')
  parts.pop()
  parts.push(extension)
  return parts.join('.')
}

export function removeExtraSlashes(path: string) {
  return path.replace(/([^:]\/)\/+/g, "$1")
}