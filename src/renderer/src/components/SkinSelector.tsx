import { useState, useEffect } from 'react'

import { useAlert } from '@renderer/hooks/Alert'
import ImageLoader from '@renderer/components/ImageLoader'
import BackIcon from '@renderer/components/svgs/BackIcon'

export type SkinSelectorProps = {
  champion: Champion | null
  setChampion: (champ: Champion | null) => void
}

type ChromaSelectorProps = {
  skin: Skin
}

function ChromaSelector({ skin }: ChromaSelectorProps): JSX.Element {
  const { setAlert } = useAlert()

  if (!skin.chromas.length || !skin.chromas.every((skin) => skin.colors.length)) return <></>

  return (
    <div className="chroma-container">
      {skin.chromas
        .filter((chroma) => chroma.colors.length)
        .map((chroma, i) => (
          <div
            key={chroma.id}
            className="chroma-circle"
            style={{ background: `linear-gradient(to top right, ${chroma.colors.join(', ')})` }}
            tabIndex={0}
            role="button"
            onClick={(e) => {
              e.stopPropagation()
              window.api.setSkin(chroma)
              setAlert(`${skin.name} chroma #${i + 1} selected successfully!`)
            }}
          />
        ))}
    </div>
  )
}

export default function SkinSelector({ champion, setChampion }: SkinSelectorProps): JSX.Element {
  const [allSkins, setAllSkins] = useState<Skin[]>([])
  const { setAlert } = useAlert()

  // Fetch initial skins
  useEffect(() => {
    ;(async (): Promise<void> => {
      setAllSkins(await window.api.listSkins())
    })()
  }, [])

  const display = champion === null ? 'none' : 'block'

  const championSkins =
    champion === null ? [] : allSkins.filter((skin) => skin.championId === champion.id)

  if (championSkins.length === 0)
    return <h2 style={{ display }}> No skins found for this champion. </h2>

  return (
    <div style={{ display }}>
      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}
      >
        <button className="back-button" onClick={() => setChampion(null)}>
          <BackIcon />
        </button>
        <h2> {championSkins[0].championName} </h2>
      </div>

      {/* Skin Cards */}
      <div className="skin-container">
        {championSkins.map((skin) => (
          <div
            key={skin.id}
            className="skin-card"
            tabIndex={0}
            role="button"
            onClick={() => {
              window.api.setSkin(skin)
              setAlert(`${skin.name} selected successfully!`)
            }}
          >
            <ImageLoader src={skin.image} alt={skin.name} />
            <ChromaSelector skin={skin} />
          </div>
        ))}
      </div>
    </div>
  )
}
