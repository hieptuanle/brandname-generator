import React, { useState } from 'react'
import './App.scss'
import names from './data/names.json'

function sample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomBrandname({ length = 2 } = {}) {
  const elements = Array.from({ length }, () => sample(names))
  const words = elements.map(element => element[0]).join(' ')
  const meaning = elements.map(element => element[1]).join(' ')
  console.log({ words, meaning, elements })
  return { words, meaning, elements }
}

function App() {
  const [brandnameData, updateBrandnameData] = useState(getRandomBrandname())

  return (
    <div className="container">
      <h1 className="header">Brandname Generator</h1>
      <div className="brandname-container">
        <p className="brandname">{brandnameData.words}</p>
        <p className="meaning">{brandnameData.meaning}</p>
        <button
          className="generate-button"
          onClick={() => {
            updateBrandnameData(getRandomBrandname())
          }}
        >
          Generate
        </button>
      </div>
    </div>
  )
}

export default App
