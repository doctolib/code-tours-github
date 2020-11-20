import { onMainPage } from './on-main-page'
import { onCodeTourList } from './on-code-tour-list'
import { addCodeTour } from './add-code-tour'

enum PageType {
  NoWhere,
  RepositoryMainPage,
  CodeTourDirectory,
  CodeTourInProgress,
}

function getPageType(): PageType {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('code-tour')) return PageType.CodeTourInProgress
  const currentUrl = window.location.pathname
  if (currentUrl.endsWith('.tours')) return PageType.CodeTourDirectory
  if (/^\/[^/]+\/[^/]+$/.test(currentUrl)) return PageType.RepositoryMainPage
  return PageType.NoWhere
}

function main(): void {
  switch (getPageType()) {
    case PageType.RepositoryMainPage: {
      return onMainPage()
    }
    case PageType.CodeTourInProgress: {
      void addCodeTour()
      return undefined
    }
    case PageType.CodeTourDirectory: {
      return onCodeTourList()
    }
  }
  return undefined
}

setTimeout(main, 1000)
