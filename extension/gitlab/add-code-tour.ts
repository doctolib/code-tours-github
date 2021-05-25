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

function buttonTo(text: string, url?: string): Element {
  const classes = url ? 'btn btn-primary' : 'btn btn-primary disabled'
  const button = document.createElement('a')
  button.setAttribute('class', classes)
  button.setAttribute('style', 'margin-top: 10px; margin-right: 5px;')
  button.setAttribute('href', url || '')
  button.text = text

  return button
}

function getCodeLineDOM(currentLine: number) {
  return document.querySelector(`#LC${currentLine}.blob-code`)
}

export function highlightRows(step: EnhancedCodeTourStep): void {
  if (!('file' in step)) return

  const startLine = step.selection?.start.line ?? step.line
  const endLine = step.selection?.end.line ?? step.line

  if (startLine && endLine) {
    for (let codeLine = startLine; codeLine <= endLine; codeLine += 1) {
      const node = getCodeLineDOM(codeLine)
      node?.classList.add('highlighted')
    }
  }
}

export function getParent(currentStep: EnhancedCodeTourStep): Element | null {
  if ('file' in currentStep) {
    const currentLine = currentStep.line ?? currentStep.selection?.end.line

    if (currentLine) {
      return getCodeLineDOM(currentLine)
    }
  }
  return document.querySelector('div.repository-content')
}

function formatAndSanitizeDescription(rawText: string): string {
  return filterXSS(converter.makeHtml(rawText))
}

export function buildTitleRow(currentStep: EnhancedCodeTourStep, stepNumber: number): HTMLParagraphElement {
  const titleRow = document.createElement('p')
  titleRow.setAttribute('style', 'display: flex; align-items: center;')

  const img = document.createElement('img')
  img.setAttribute('src', chrome.extension.getURL('code-tour.png'))
  img.setAttribute('style', 'height: 2em; margin-right: 1em;')

  const codeTour = document.createElement('b')
  codeTour.textContent = 'CodeTour'

  const hr = document.createElement('hr')

  const currentTourInfo = document.createElement('span')
  currentTourInfo.textContent = ` Step ${stepNumber + 1} of ${currentStep.tour.steps.length} (${
    currentStep.tour.title
  })`

  titleRow.append(img, codeTour, currentTourInfo, hr)
  return titleRow
}

export function buildSection(currentStep: EnhancedCodeTourStep, step: number): HTMLDivElement {
  const currentDescription = formatAndSanitizeDescription(currentStep.description)

  const previousButton = buttonTo('Previous', currentStep.previousUrl)
  const nextButton = buttonTo('Next', currentStep.nextUrl)

  const section = document.createElement('div')
  section.setAttribute('class', 'dl-doctolib-code-tour-comment')

  const tourInfo = buildTitleRow(currentStep, step)

  const span = document.createElement('span')
  span.innerHTML = currentDescription

  const br = document.createElement('br')

  section.append(tourInfo, span, br, previousButton, nextButton)

  section.setAttribute(
    'style',
    `
    padding: 14px;
    margin: 14px;
    border: 1px lightgrey solid;
    background-color: white;
    border-radius: 1em;
    font-family: sans-serif;
    `,
  )
  return section
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
  const section = buildSection(currentStep, step)

  const parent = getParent(currentStep)
  if (!parent) return
  if ('file' in currentStep) {
    highlightRows(currentStep)

    parent.append(section)
    parent.scrollIntoView({ behavior: 'auto', block: 'center' })
  } else {
    parent.prepend(section)
  }
}
