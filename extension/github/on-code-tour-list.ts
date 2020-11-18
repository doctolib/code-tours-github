import { CodeTour, Request } from '../types/request'
import { Response } from '../types/response'

function forwardRequest(request: Request): Promise<Response> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request, (response: Response) => {
      if (!response) return reject(chrome.runtime.lastError)
      return resolve(response)
    })
  })
}

function executeOrder(order: Response): void {
  switch (order.action) {
    case 'REDIRECT':
      window.location.href = order.url
      break
  }
}

export function onCodeTourList(): void {
  document.querySelectorAll('div[role=row] > div[role="rowheader"] > span > a').forEach(async (value: Element) => {
    const title = value.getAttribute('title')
    const href = value.getAttribute('href')
    if (!title || !href) return
    console.log(title)
    const name = /^(.*).tour$/.exec(title)?.[1]
    if (!name) return

    const tourContent: CodeTour = (await fetch(href.replace('blob', 'raw')).then((response) =>
      response.json(),
    )) as CodeTour

    const newChild = document.createElement('a')
    newChild.innerHTML = 'RUN'
    newChild.onclick = async () => {
      const result = await forwardRequest({ action: 'START', codeTour: tourContent })
      executeOrder(result)
    }
    const row = value?.parentNode?.parentNode
    if (!row) return
    row.insertBefore(newChild, null)
  })
}
