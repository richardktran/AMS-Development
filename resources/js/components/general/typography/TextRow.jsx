import React from 'react'
import { Typography } from 'antd'
import { formatDate, formatCapitalizeFirst } from '../../../utils'

const { Text } = Typography

function TextRow({ content, capitalizeFirst, isDate }) {
  const isValidContent =
    content !== null && content !== undefined && content !== ''
  return (
    <Text className="row-text">
      {capitalizeFirst
        ? formatCapitalizeFirst(content)
        : isValidContent && isDate
        ? formatDate(content)
        : content}
    </Text>
  )
}

export default TextRow
