import { CodeTour, EnhancedCodeTourStep } from './code-tour'

export interface RedirectResponse {
  action: 'REDIRECT'
  url: string
}

export interface StepResponse {
  action: 'STEP'
  step: EnhancedCodeTourStep
}

export interface CodeTourResponse {
  action: 'CODE_TOUR'
  codeTour: CodeTour
}

export type Response = RedirectResponse | StepResponse | CodeTourResponse
