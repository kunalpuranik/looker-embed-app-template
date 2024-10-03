import Tile from '../Tile/Tile'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { useCallback, useState } from 'react'
import { lookerConfig } from '../../lookerConfig'

function App() {
  const [exploreStatus, setExploreStatus] = useState('Loading...')

  const setupExplore = useCallback(
    (div) => {
      if (!div) {
        return
      }
      LookerEmbedSDK.createExploreWithId(lookerConfig.exploreId)
        .withAllowAttr('fullscreen')
        .withTheme("EmbedAppTemplate")
        .appendTo(div)

        // Listen to messages to display progress
        .on('explore:ready', () => setExploreStatus('Loaded'))
        .on('explore:run:start', () => setExploreStatus('Running'))
        .on('explore:run:complete', () => setExploreStatus('Done'))

        // Listen to session status
        .on('session:status', (event) => {
          if (event.expired) {
            setExploreStatus('Session expired')
          } else if (event.interrupted) {
            setExploreStatus('Session interrupted')
          }
        })
        // Give the embedded content a class for styling purposes
        .withClassName('looker-embed')
        .withParams({
          fields: [
            'order_items.status',
            'order_items.count',
          ],
          limit: 500
        })
        .build()
        .connect()
        .catch((error) => {
          setExploreStatus('Connection error')
          console.error('Connection error', error)
        })
    },
    [setExploreStatus]
  )

  return (
    <>
      <Tile title="Embedded Explore">
        <div>
          <div id="explore-state" className="loading-message">
            {exploreStatus}
          </div>
        </div>
        <div id="explore" ref={setupExplore}></div>
      </Tile>
    </>
  )
}

export default App
