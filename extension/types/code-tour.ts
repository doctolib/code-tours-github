export interface CodeTourStep {
  file: string
  line: number
  description: string
}

export type EnhancedCodeTourStep = CodeTourStep & {
  nextUrl?: string
  previousUrl?: string
}

export interface CodeTour {
  title: string
  step: number
  steps: CodeTourStep[]
  ref: string
  repository: string
}
