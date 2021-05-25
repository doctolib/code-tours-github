import { Request } from '../types/request'
import { Response } from '../types/response'

export function forwardRequest(request: Request): Promise<Response> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request, (response: Response) => {
      if (!response) return reject(chrome.runtime.lastError)
      return resolve(response)
    })
  })
}
