export const formatDate = (date) => {
  const dateArr = date.split('-')
  return dateArr[2] + '/' + dateArr[1] + '/' + dateArr[0]
}

export const formatCapitalizeFirst = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatToLowerCase = (text) => {
  return text.toLowerCase()
}

export const formatNameFormUser = (text) => {
  return (text.charAt(0).toLowerCase() + text.slice(1)).replace(/\s+/g, '')
}

export const formatSnakeCase = (text) => {
  return text.toLowerCase().replace(/\s+/g, '')
}
