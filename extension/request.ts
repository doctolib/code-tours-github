export interface CodeTour {
  title: string
  step: number
}

export interface StartRequest {
  action: 'START'
  codeTour: CodeTour
}

export interface GoToRequest {
  action: 'GO_TO'
  codeTour: CodeTour
}

export type Request = StartRequest | GoToRequest
