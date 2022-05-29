import React from 'react'
import { TextHeader } from '../components/general'
import { HomeList } from '../components/home'
import { generalLayoutCol } from '../constants'

function Home() {
  return (
    <div style={generalLayoutCol}>
      <TextHeader content="My Assignment" />
      <div className="mb-4" />
      <HomeList />
    </div>
  )
}

export default Home
