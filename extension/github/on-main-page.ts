export function onMainPage(): void {
  const currentUrl = window.location.pathname
  const codeTourFolderUrl = `${currentUrl}/tree/master/.tours`

  console.log(document.querySelector(`a[href="${codeTourFolderUrl}"]`))
}
