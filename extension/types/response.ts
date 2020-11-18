import { EnhancedCodeTourStep } from './code-tour'

export interface RedirectResponse {
  action: 'REDIRECT'
  url: string
}

export interface StepResponse {
  action: 'STEP'
  step: EnhancedCodeTourStep
}

export type Response = RedirectResponse | StepResponse
