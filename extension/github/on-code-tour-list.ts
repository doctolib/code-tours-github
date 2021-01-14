import { Response } from '../types/response'
import { CodeTour } from '../types/code-tour'
import { forwardRequest } from './forward-request'

function executeOrder(order: Response): void {
  switch (order.action) {
    case 'REDIRECT':
      window.location.href = order.url
      break
  }
}

interface Operation {
  row: Node & ParentNode
  newChild: HTMLAnchorElement
}

export function onCodeTourList(): void {
  const currentRepositoryMatches = /^\/([^/]+\/[^/]+)\//.exec(window.location.pathname)
  if (!currentRepositoryMatches) return
  const currentBranchMatches = /^\/[^/]+\/[^/]+\/tree\/([^/]+)\//.exec(window.location.pathname)
  if (!currentBranchMatches) return

  const currentRepository = currentRepositoryMatches[1]
  const currentBranch = currentBranchMatches[1]

  const insertPreparation = Array.from(
    document.querySelectorAll('div[role=row] > div[role="rowheader"] > span > a').values(),
  ).map(
    async (parentElement: Element): Promise<Operation | undefined> => {
      try {
        const title = parentElement.getAttribute('title')
        const href = parentElement.getAttribute('href')
        if (!title || !href) return undefined
        const name = /^(.*).tour$/.exec(title)?.[1]
        if (!name) return undefined

        const prettyName = name.replace(/-/g, ' ').replace(/\s/g, ' ')

        const codeTourUrl = href.replace('blob', 'raw')
        const response = await forwardRequest({ action: 'GET_CODE_TOUR', url: codeTourUrl })
        if (response.action !== 'CODE_TOUR' || !response.codeTour) return undefined

        const tourContent: CodeTour = {
          ...response.codeTour,
          repository: currentRepository,
        } as CodeTour

        if (!tourContent.ref) {
          tourContent.ref = currentBranch
        }

        const newChild = document.createElement('a')
        newChild.classList.add('btn')
        newChild.innerHTML = `Learn ${prettyName}`
        newChild.onclick = async () => {
          const result = await forwardRequest({ action: 'START', codeTour: tourContent })
          executeOrder(result)
        }
        const row = parentElement.parentNode?.parentNode
        if (!row) return undefined
        return {
          row,
          newChild,
        }
      } catch (error) {
        // no code tour for you!
        return undefined
      }
    },
  )

  void Promise.all(insertPreparation).then((operations) => {
    operations.forEach((operation) => {
      if (!operation) return
      const { newChild, row } = operation
      row.append(newChild)
    })
  })
}
