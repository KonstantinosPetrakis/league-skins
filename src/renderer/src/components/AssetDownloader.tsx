import { useState, useEffect } from 'react'

import UpdateButton from '@renderer/components/UpdateButton'
import OffCanvas from '@renderer/components/OffCanvas'
import Loader from '@renderer/components/Loader'

export default function AssetDownloader({
  downloading,
  setDownloading
}: {
  downloading: boolean
  setDownloading: (downloading: boolean) => void
}): JSX.Element {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async (): Promise<void> => {
      try {
        await window.api.downloadLolSkins()
        setDownloading(false)
      } catch {
        setError("Couldn't download assets. Please try again later.")
      }
    })()
  }, [setDownloading])

  const handleUpdateSkins = async (): Promise<void> => {
    setDownloading(true)
    await window.api.downloadLolSkins(true)
    setDownloading(false)
  }

  return (
    <>
      <OffCanvas active={downloading} setActive={setDownloading} compact displayExitButton={false}>
        {error ? (
          <h4> {error} </h4>
        ) : (
          <>
            <h4> Please wait for binaries and assets to be downloaded. </h4>
            <p> This might take a while... </p>
            <Loader />
          </>
        )}
      </OffCanvas>
      <UpdateButton onUpdate={handleUpdateSkins} />
    </>
  )
}
