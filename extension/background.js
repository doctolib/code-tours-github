
const codeTourMap = {}

class CodeTour {
  constructor(body) {
    this.body = body
  }

  goTo(step) {

  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch(request.action) {
    case 'REGISTER':
      if (codeTourMap[request.codeTour.title]) return
      codeTourMap[request.codeTour.title] = new CodeTour(request.codeTour)
      break
    case 'GO_TO':
      if (!codeTourMap[request.codeTour.title]) return
      if (!request.codeTour.step) return
      // what?
      codeTourMap[request.codeTour.title].goTo(step)
  }
})

