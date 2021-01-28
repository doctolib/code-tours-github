interface CodeTourFileStep {
  description: string
  file: string
  line: number
}

export interface CodeTourDirectoryStep {
  description: string
  directory: string
}

export type CodeTourStep = CodeTourFileStep | CodeTourDirectoryStep

export type EnhancedCodeTourStep = CodeTourStep & {
  nextUrl?: string
  previousUrl?: string
  tour: CodeTour
}

export interface CodeTour {
  title: string
  step: number
  steps: CodeTourStep[]
  ref: string
  repository: string
}
