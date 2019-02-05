import React, { useState } from 'react'
import './App.scss'
import names from './data/names.json'

type TTone = 'ngang' | 'huyen' | 'sac' | 'hoi' | 'nga' | 'nang' | ''
type TGetRandomBrandnamProps = { length?: number; toneData?: TTone[] }

function sample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function filterByTone(names: string[][], tone: TTone) {
  if (!tone) return names
  return names.filter(name => {
    return name[2] === tone
  })
}

function getRandomBrandname({ length = 2, toneData = ['', ''] }: TGetRandomBrandnamProps = {}) {
  const elements = Array.from({ length }, (v, k) => {
    return sample(filterByTone(names, toneData[k]))
  })
  const words = elements.map(element => element[0]).join(' ')
  const meaning = elements.map(element => element[1]).join(' ')
  return { words, meaning, elements }
}

function App() {
  const [brandnameData, updateBrandnameData] = useState(getRandomBrandname())
  const [toneData, updateToneData] = useState(['', ''] as TTone[])

  return (
    <div className="container">
      <h1 className="header">Brandname Generator</h1>
      <div className="card brandname-container">
        <p className="brandname">{brandnameData.words}</p>
        <p className="meaning">{brandnameData.meaning}</p>
        <button
          className="generate-button"
          onClick={() => {
            updateBrandnameData(getRandomBrandname({ toneData }))
          }}
        >
          Generate
        </button>
      </div>

      <div className="card settings-container">
        <form>
          {toneData.map((v, k) => (
            <div key={k} className="option-field">
              <label className="label-tone">Tone {k + 1}</label>
              <select
                className="select-tone"
                value={v}
                onChange={e => {
                  toneData[k] = e.target.value as TTone
                  updateToneData(toneData)
                }}
              >
                <option value="ngang">Ngang</option>
                <option value="huyen">Huyền</option>
                <option value="sac">Sắc</option>
                <option value="hoi">Hỏi</option>
                <option value="nga">Ngã</option>
                <option value="nang">Nặng</option>
                <option value="">Bất kỳ</option>
              </select>
            </div>
          ))}
        </form>
      </div>
    </div>
  )
}

export default App
