export function onMainPage(): void {
  const node = document.querySelector('a[href$="/.tours"]')
  if (!node) return

  const codeTourFolderUrl = node.getAttribute('href')
  if (!codeTourFolderUrl) return

  const codeTourButton = document.createElement('a')
  codeTourButton.classList.add('btn')
  codeTourButton.classList.add('ml-2')
  codeTourButton.classList.add('d-none')
  codeTourButton.classList.add('d-md-block')
  codeTourButton.setAttribute('href', codeTourFolderUrl)
  codeTourButton.innerHTML = 'Code Tours'

  document.querySelector('.file-navigation')?.insertBefore(codeTourButton, document.querySelector('a[data-hotkey="t"]'))
}
