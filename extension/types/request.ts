import { CodeTour } from './code-tour'

export interface StartRequest {
  action: 'START'
  codeTour: CodeTour
}

export interface GoToRequest {
  action: 'GO_TO'
  codeTour: CodeTour
}

export interface GetStepRequest {
  action: 'GET_STEP'
  codeTourTitle: string
  codeTourStep: number
}

export type Request = StartRequest | GoToRequest | GetStepRequest
