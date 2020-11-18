export function onMainPage(): void {
  const currentUrl = window.location.pathname
  const codeTourFolderUrl = `${currentUrl}/tree/master/.tours`
  console.log(codeTourFolderUrl)

  const codeTourButton = document.createElement('a')
  codeTourButton.setAttribute('href', codeTourFolderUrl)

  document.querySelector('ul.pagehead-actions')?.prepend(codeTourButton)
}
