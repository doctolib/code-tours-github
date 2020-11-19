import { Request } from '../types/request'
import { Response } from '../types/response'
import { CodeTour, EnhancedCodeTourStep } from '../types/code-tour'
import MessageSender = chrome.runtime.MessageSender

const codeTourMap: Record<string, CodeTourGenerator> = {}

class CodeTourGenerator {
  constructor(private body: CodeTour) {}

  goTo(step: number): string {
    const newStep = this.body.steps[step]
    if (!newStep) throw new Error('Unknown step')

    return `http://github.com/${this.body.repository}/blob/${this.body.ref}/${newStep.file}?step=${step}&code-tour=${this.body.title}`
  }

  getStep(stepId: number): EnhancedCodeTourStep {
    console.log(stepId)
    console.log(this.body)
    const requestedStep = this.body.steps[stepId]
    if (!requestedStep) throw new Error('step does not exist')

    let previousUrl
    try {
      previousUrl = this.goTo(stepId - 1)
    } catch (error) {
      // no impacts
    }
    let nextUrl
    try {
      nextUrl = this.goTo(stepId + 1)
    } catch (error) {
      // no impacts
    }
    return {
      ...requestedStep,
      nextUrl,
      previousUrl,
    }
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
    case 'GET_STEP': {
      const step = codeTourMap[request.codeTourTitle]?.getStep(request.codeTourStep)
      if (!step) return
      sendResponse({ action: 'STEP', step })
    }
  }
})
