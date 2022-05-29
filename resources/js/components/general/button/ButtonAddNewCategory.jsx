import React from 'react'
import { Typography } from 'antd'

const { Link } = Typography
export default function ButtonAddNewCategory({ handleShowCategoryForm }) {
  return (
    <div className="w-100 mx-3 my-2">
      <Link
        style={{
          color: '#CF2338',
          fontStyle: 'italic',
          textDecoration: 'underline',
        }}
        onClick={handleShowCategoryForm}
      >
        Add new category
      </Link>
    </div>
  )
}
