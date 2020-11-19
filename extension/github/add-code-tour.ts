import { forwardRequest } from './forward-request'
import { EnhancedCodeTourStep } from '../types/code-tour'

async function getStep(title: string, step: number): Promise<EnhancedCodeTourStep> {
  const response = await forwardRequest({ action: 'GET_STEP', codeTourStep: step, codeTourTitle: title })
  if (response.action !== 'STEP') throw new Error('should return a step')
  return response.step
}

function buttonTo(text: string, url?: string) {
  const classes = url ? 'btn' : 'btn disabled'
  return `<a class="${classes}" style="margin-top: 10px;" href="${url || ''}">${text}</a>`
}

export async function addCodeTour(): Promise<void> {
  console.log('ADDING CODE TOUR')
  const searchParams = new URLSearchParams(window.location.search)
  const name = searchParams.get('code-tour')
  const step = parseInt(searchParams.get('step') ?? '', 10) || 0

  if (!name) return

  const currentStep = await getStep(name, step)
  console.log(step)
  const currentLine = currentStep.line
  const currentDescription = currentStep.description
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
      background-color: white;
    `,
  )
  document.querySelector(`#LC${currentLine}.blob-code`)?.append(section)
}
