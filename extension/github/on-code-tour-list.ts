import { Response } from '../types/response'
import { CodeTour } from '../types/code-tour'
import { forwardRequest } from './forward-request'

function executeOrder(order: Response): void {
  console.log(order)
  switch (order.action) {
    case 'REDIRECT':
      window.location.href = order.url
      break
  }
}

export function onCodeTourList(): void {
  const currentRepositoryMatches = /^\/([^/]+\/[^/]+)\//.exec(window.location.pathname)
  if (!currentRepositoryMatches) return

  const currentRepository = currentRepositoryMatches[1]

  document.querySelectorAll('div[role=row] > div[role="rowheader"] > span > a').forEach(async (value: Element) => {
    const title = value.getAttribute('title')
    const href = value.getAttribute('href')
    if (!title || !href) return
    const name = /^(.*).tour$/.exec(title)?.[1]
    if (!name) return

    const tourContent: CodeTour = {
      ...(await fetch(href.replace('blob', 'raw')).then((response) => response.json())),
      repository: currentRepository,
    } as CodeTour

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
