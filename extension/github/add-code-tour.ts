interface Step {
  line: number
  description: string
  nextUrl?: string
  previousUrl?: string
}

function getStep(name: string, step: number): Step {
  return {
    line: step,
    description: name,
  }
}

export function addCodeTour(): void {
  const searchParams = new URLSearchParams(window.location.search)
  const name = searchParams.get('code-tour')
  const step = parseInt(searchParams.get('step') ?? '', 10) || 0

  if (!name) return

  const currentStep = getStep(name, step)
  const currentLine = currentStep.line
  const currentDescription = currentStep.description
  const nextButton = currentStep.nextUrl ? `<a href="${currentStep.nextUrl}">Next</a>` : ''
  const previousButton = currentStep.previousUrl ? `<a href="${currentStep.previousUrl}">Next</a>` : ''

  const section = document.createElement('div')
  section.setAttribute('class', 'dl-doctolib-code-tour-comment')
  section.appendChild(document.createTextNode(`${currentDescription}<br/>${previousButton} ${nextButton}`))
  section.append(`
    <style>
    .dl-doctolib-code-tour-comment {
      padding: 14px;
      margin: 14px;
      background-color: white;
    }
    </style>`)
  document.querySelector(`#LC${currentLine}.blob-code`)?.append(section)
}
