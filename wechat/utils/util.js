const formatTime = (date, type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (type == "year") {
    return [year].map(formatNumber).join('-')
  } else if (type == "month") {
    return [year, month].map(formatNumber).join('-')
  } else if (type == "day") {
    return [year, month, day].map(formatNumber).join('-')
  }
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime7 = (date, type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() + 7
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (type == "year") {
    return [year].map(formatNumber).join('-')
  } else if (type == "month") {
    return [year, month].map(formatNumber).join('-')
  } else if (type == "day") {
    return [year, month, day].map(formatNumber).join('-')
  }
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTimeYes = (date, type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() -1
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (type == "year") {
    return [year].map(formatNumber).join('-')
  } else if (type == "month") {
    return [year, month].map(formatNumber).join('-')
  } else if (type == "day") {
    return [year, month, day].map(formatNumber).join('-')
  }
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatTime7: formatTime7,
  formatTimeYes: formatTimeYes,
}