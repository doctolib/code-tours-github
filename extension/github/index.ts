import { onMainPage } from './on-main-page'
import { onCodeTourList } from './on-code-tour-list'
import { addCodeTour } from './add-code-tour'
import { Actions, BackgroundMessage } from '../types/background-messages'

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

  const node = document.querySelector('a[href$="/.tours"]')
  if (node && node.getAttribute('href')) return PageType.RepositoryMainPage

  if (/^\/[^/]+\/[^/]+\/?$/.test(currentUrl)) return PageType.RepositoryMainPage
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

document.addEventListener('DOMContentLoaded', () => {
  main()
})

chrome.runtime.onMessage.addListener(function (request: BackgroundMessage) {
  if (request.action === Actions.UrlChanged) {
    setTimeout(main, 1000)
  }
})
