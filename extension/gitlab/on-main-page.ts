export function onMainPage(): void {
  console.log('onMainPage')
  const node = document.querySelector('a[href$="/.tours"]')
  if (!node) return
  console.log(node)

  const codeTourFolderUrl = node.getAttribute('href')
  if (!codeTourFolderUrl) return
  console.log(codeTourFolderUrl)

  const codeTourButton = document.createElement('a')
  codeTourButton.setAttribute('href', codeTourFolderUrl)
  codeTourButton.innerHTML = 'Code Tours'

  const leftBarActiveMenu = document.querySelector('li.home.active > ul')
  const li = document.createElement('li')
  li.append(codeTourButton)

  leftBarActiveMenu?.append(li)
}

