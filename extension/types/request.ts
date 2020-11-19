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

export interface GetCodeTour {
  action: 'GET_CODE_TOUR'
  url: string
}

export type Request = StartRequest | GoToRequest | GetStepRequest | GetCodeTour
