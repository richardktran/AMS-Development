import React from 'react'
import { Modal } from 'antd'

const { confirm, error, success, info } = Modal

const showMessage = (type, title, message) => {
  const propsModal = {
    title: title,
    content: <span>{message}</span>,
    okText: 'Close',
    okButtonProps: {
      type: 'default',
    },
  }

  switch (type) {
    case 'success':
      success(propsModal)
      break
    case 'error':
      error(propsModal)
      break
    case 'confirm':
      confirm(propsModal)
      break
    default:
      info(propsModal)
      break
  }
}

export default showMessage
