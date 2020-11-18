import { CodeTour, Request } from './request'
import { Response } from './response'

function forwardRequest(request: Request): Promise<Response> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request, (response: Response) => {
      if (!response) return reject(chrome.runtime.lastError)
      return resolve(response)
    })
  })
}

function executeOrder(order: Response) {
  switch (order.action) {
    case 'REDIRECT':
      window.location.href = order.url
      break
  }
}

function onMainPage() {
  const currentUrl = window.location.pathname
  const codeTourFolderUrl = `${currentUrl}/tree/master/.tours`

  console.log(document.querySelector(`a[href="${codeTourFolderUrl}"]`))
}

function onCodeTourList() {
  document.querySelectorAll('div[role=row] > div[role="rowheader"] > span > a').forEach(async (value: Element) => {
    let title = value.getAttribute('title')
    let href = value.getAttribute('href')
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

function main() {
  const currentUrl = window.location.pathname
  if (currentUrl.endsWith('.tours')) return onCodeTourList()
  // TODO handle any other page :joy:
  return onMainPage()
}

setTimeout(main, 1000)
