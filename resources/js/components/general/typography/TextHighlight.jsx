import React from 'react'
import Highlighter from 'react-highlight-words'
import TextRow from './TextRow'

function TextHeader({
  searchKeywords,
  content,
  isHighlight,
  isDate,
  capitalizeFirst,
}) {
  if (searchKeywords !== null && content !== '' && isHighlight) {
    return (
      <Highlighter
        className="row-text"
        highlightStyle={{ backgroundColor: '#ffa69e', padding: 0 }}
        searchWords={[searchKeywords]}
        autoEscape
        textToHighlight={content ? content.toString() : ''}
      />
    )
  }
  return (
    <TextRow
      content={content}
      capitalizeFirst={capitalizeFirst}
      isDate={isDate}
    />
  )
}

export default TextHeader
