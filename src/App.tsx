import React, { useState, useEffect, Dispatch, SetStateAction, Fragment } from 'react'
import './App.scss'
import names from './data/names.json'
import store from 'store'

type TTone = 'ngang' | 'huyen' | 'sac' | 'hoi' | 'nga' | 'nang' | ''
type TGetRandomBrandnamProps = { length?: number; toneData?: TTone[] }
type TBrandname = {
  words: string
  meaning: string
  elements: string[][]
}

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

function useStoredBrandnames(): [TBrandname[], any] {
  const [storedBrandnames, updateStoredBrandnames] = useState([] as TBrandname[])
  useEffect(() => {
    const brandnames: TBrandname[] | undefined = store.get('brandnames')
    if (brandnames && brandnames.length) {
      updateStoredBrandnames(brandnames)
    }
  })

  function handleUpdateStoredBrandnames(brandnames: TBrandname[]) {
    updateStoredBrandnames(brandnames)
    store.set('brandnames', brandnames)
  }
  return [storedBrandnames, handleUpdateStoredBrandnames]
}

function addBrandname(
  storedBrandnames: TBrandname[],
  updateStoredBrandnames: Dispatch<SetStateAction<TBrandname[]>>,
  brandname: TBrandname
) {
  const matchBrandname = storedBrandnames.find(_brandname => {
    return _brandname.words === brandname.words && _brandname.meaning === brandname.meaning
  })
  if (!matchBrandname) {
    const newBrandnames = storedBrandnames.concat(brandname)
    updateStoredBrandnames(newBrandnames)
  }
}

function removeBrandname(
  storedBrandnames: TBrandname[],
  updateStoredBrandnames: Dispatch<SetStateAction<TBrandname[]>>,
  brandname: TBrandname
) {
  const newBrandnames = storedBrandnames.filter(_brandname => {
    return !(_brandname.words === brandname.words && _brandname.meaning === brandname.meaning)
  })
  updateStoredBrandnames(newBrandnames)
}

function App() {
  const [brandnameData, updateBrandnameData] = useState(getRandomBrandname())
  const [toneData, updateToneData] = useState(['', ''] as TTone[])
  const [storedBrandnames, updateStoredBrandnames] = useStoredBrandnames()

  return (
    <div className="container">
      <h1 className="header">Brandname Generator</h1>
      <div className="card brandname-container">
        <a
          className="heart"
          onClick={() => {
            addBrandname(storedBrandnames, updateStoredBrandnames, brandnameData)
          }}
        >
          ❤️
        </a>
        <div className="brandname-layout">
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

      {storedBrandnames.length > 0 && (
        <div className="container-stored-brandnames">
          <hr className="divider" />
          <h2 className="header">Stored Brandnames</h2>
          <ul className="list-brandname">
            {storedBrandnames.map(brandname => (
              <li key={brandname.words + ' ' + brandname.meaning} className="item-brandname">
                <span className="words">{brandname.words}</span>
                <span className="meaning">{brandname.meaning}</span>
                <a
                  className="link-remove"
                  onClick={() => {
                    removeBrandname(storedBrandnames, updateStoredBrandnames, brandname)
                  }}
                >
                  remove
                </a>
              </li>
            ))}
          </ul>
          <div className="clear-all">
            <a
              onClick={() => {
                updateStoredBrandnames([])
              }}
            >
              Clear all
            </a>
          </div>
        </div>
      )}

      <footer>
        <a href="https://twitter.com/jokyspy" target="_blank">
          Follow me on Twitter
        </a>
        .{' '}
        <a href="https://github.com/hieptuanle/brandname-generator" target="_blank">
          Fork on Github
        </a>
        .
      </footer>
    </div>
  )
}

export default App
