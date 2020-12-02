import 'showdown-prettify'
import * as showdown from 'showdown'
import { filterXSS } from 'xss'
import { forwardRequest } from './forward-request'
import { EnhancedCodeTourStep } from '../types/code-tour'

const converter = new showdown.Converter({ extensions: ['prettify'] })
converter.setFlavor('github')

async function getStep(title: string, step: number): Promise<EnhancedCodeTourStep> {
  const response = await forwardRequest({ action: 'GET_STEP', codeTourStep: step, codeTourTitle: title })
  if (response.action !== 'STEP') throw new Error('should return a step')
  return response.step
}

function buttonTo(text: string, url?: string) {
  const classes = url ? 'btn' : 'btn disabled'
  return `<a class="${classes}" style="margin-top: 10px;" href="${url || ''}">${text}</a>`
}

function getParent(currentStep: EnhancedCodeTourStep) {
  if ('file' in currentStep) {
    const currentLine = currentStep.line
    return document.querySelector(`#LC${currentLine}.blob-code`)
  }
  return document.querySelector('div.repository-content')
}

export async function addCodeTour(): Promise<void> {
  const sheet = document.createElement('style')
  sheet.innerHTML = `
  pre {
    border: 1px black solid;
    padding: 1em;
  }
  `
  document.body.prepend(sheet)

  const searchParams = new URLSearchParams(window.location.search)
  const name = searchParams.get('code-tour')
  const step = parseInt(searchParams.get('step') ?? '', 10) || 0

  if (!name) return

  const currentStep = await getStep(name, step)
  const currentDescription = filterXSS(converter.makeHtml(currentStep.description))
  const previousButton = buttonTo('Previous', currentStep.previousUrl)
  const nextButton = buttonTo('Next', currentStep.nextUrl)

  const section = document.createElement('div')
  section.setAttribute('class', 'dl-doctolib-code-tour-comment')

  section.innerHTML = `<span>${currentDescription}</span><br/>${previousButton} ${nextButton}`
  section.setAttribute(
    'style',
    `
    padding: 14px;
    margin: 14px;
    border: 1px lightgrey solid;
    background-color: white;
    border-radius: 1em;
    `,
  )

  const parent = getParent(currentStep)
  if (!parent) return
  if ('file' in currentStep) {
    parent.append(section)
    parent.classList.add('highlighted')
    parent.scrollIntoView({ behavior: 'auto', block: 'center' })
  } else {
    parent.prepend(section)
  }
}
