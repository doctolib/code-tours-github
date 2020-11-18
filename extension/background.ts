import { CodeTour, Request } from './request'
import MessageSender = chrome.runtime.MessageSender
import { Response } from './response'

const codeTourMap: Record<string, CodeTourGenerator> = {}

class CodeTourGenerator {
  constructor(private body: CodeTour) {}

  goTo(step: number): string {
    return step < 0 ? 'https://github.com/doctolib/doctolib/blob/master/.tours/concerns.tour' : ''
  }
}

chrome.runtime.onMessage.addListener(function (
  request: Request,
  sender: MessageSender,
  sendResponse: (answer: Response) => void,
) {
  console.log(request)
  switch (request.action) {
    case 'START':
      codeTourMap[request.codeTour.title] = new CodeTourGenerator(request.codeTour)
      sendResponse({ action: 'REDIRECT', url: codeTourMap[request.codeTour.title].goTo(0) })
      break
    case 'GO_TO':
      if (!codeTourMap[request.codeTour.title]) return
      if (!request.codeTour.step) return
      sendResponse({ action: 'REDIRECT', url: codeTourMap[request.codeTour.title].goTo(request.codeTour.step) })
      break
  }
})
