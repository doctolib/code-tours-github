export enum Actions {
  UrlChanged = 'URL_CHANGED',
}

interface Message<T extends Actions> {
  action: T
}

type UrlChangedMessage = Message<Actions.UrlChanged>

export type BackgroundMessage = UrlChangedMessage
