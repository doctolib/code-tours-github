function forwardRequest(request) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      request,
      (response) => {
        if (!response) return reject(chrome.runtime.lastError)
        return resolve(response)
      }
    )
  })
}

console.log('running')

// On man page -> know if code tour exist
setTimeout(() => {
  return
  const currentUrl = window.location.pathname
  const codeTourFolderUrl = `${currentUrl}/tree/master/.tours`

  console.log(document.querySelector(`a[href="${codeTourFolderUrl}"]`))
}, 1000)

// On codetour page -> get list of tour
setTimeout( () => {
  document.querySelectorAll('div[role=row] > div[role="rowheader"] > span > a').forEach(async (value, key) => {
    const name = /^(.*).tour$/.exec(value.title)[1]

    const prettyName = name.replaceAll('-', ' ').replace(/\s+/g, ' ')
    const tourContent = await fetch(value.href.replace('blob', 'raw')).then(response => response.json())
    forwardRequest({ action: 'REGISTER' })

    const newChild = document.createElement('a')
    newChild.innerHTML = 'RUN'
    newChild.onclick = () => {
      console.log(`clicked ${prettyName}`)
    }

    value.parentNode.parentNode.insertBefore(newChild, null)
  })

}, 1000)
