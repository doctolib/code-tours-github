export interface Redirect {
  action: 'REDIRECT'
  url: string
}

export type Response = Redirect
