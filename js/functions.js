
// HTML parsing
const HTML = (function () {
  return {
    parse(htmlString) {
      const tmpDiv = document.createElement('div')
      tmpDiv.innerHTML = htmlString
      return tmpDiv.childNodes.length === 0 ? '' : tmpDiv.childNodes[0].nodeValue
    },
    main: document.getElementById('main'),
  }
}())


// UTC time handling, very usefull when dealing with elasticsearch
var Time = (function () {
  return {
    utc() {
      return Math.floor(_.now() / 1000)
    },

    toUTC(timeString) {
      const parts = timeString.split(/[a-zA-Z]+/)
      let times = 1

      // Number before the time (e.g. 2years or 12hour)
      if (parts.length === 2 && parts[0] !== '') {
        times = _.parseInt(parts[0])
      }

      if (_.includes(timeString, 'hour')) 	return times * 3600
      if (_.includes(timeString, 'day')) 		return times * 86400
      if (_.includes(timeString, 'week')) 	return times * 604800
      if (_.includes(timeString, 'month')) 	return times * 2592000
      if (_.includes(timeString, 'year')) 	return times * 31536000

      return Time.utc()
    },

    difference(timeString) {
      return Time.utc() - Time.toUTC(timeString)
    },
  }
}())
