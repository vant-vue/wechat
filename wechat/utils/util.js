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
  date = new Date(date.getTime() + 7 * 24 * 3600 * 1000);
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

const compareDate = (d1, d2) =>{
  return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

module.exports = {
  formatTime: formatTime,
  formatTime7: formatTime7,
  formatTimeYes: formatTimeYes,
  compareDate: compareDate
}