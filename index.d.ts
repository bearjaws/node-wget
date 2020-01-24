import { EventEmitter } from 'events'
import { ClientRequest } from 'http'

declare const wget: {
  download(src: string, output: string, options?: wget.DownloadOptions): EventEmitter
  request(options: wget.RequestOptions, callback?: (res: Response) => void): ClientRequest
}

declare namespace wget {
  type RequestOptions = {
    gunzip?: boolean,
  } | DownloadOptions

  type DownloadOptions = {
    proxy?: {
      protocol?: string,
      host?: string,
      port?: number,
      proxyAuth?: string,
      headers?: Record<string, string>,
      method?: string,
      path?: string,
      proxy?: string,
    } | string
  }
}

export = wget
