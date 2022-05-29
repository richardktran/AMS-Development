import React from 'react'
import { Typography } from 'antd'

const { Text } = Typography

function TextHeader({ content }) {
  return (
    <Text style={{ color: '#CF2338' }} strong>
      {content}
    </Text>
  )
}

export default TextHeader
