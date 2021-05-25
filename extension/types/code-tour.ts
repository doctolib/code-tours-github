interface CodeTourStepPosition {
  line: number
  character: number
}

interface CodeTourFileStep {
  description: string
  file: string
  line?: number
  selection?: {
    start: CodeTourStepPosition
    end: CodeTourStepPosition
  }
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
  slang: string
  step: number
  steps: CodeTourStep[]
  ref: string
  repository: string
}
