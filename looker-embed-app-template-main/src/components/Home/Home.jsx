import React from 'react'
import Tile from '../Tile/Tile'
import EmbedDashboard from './EmbedDashboard'

const Home = () => {
  return (
    <>
      <div class="flex flex-col gap-2 p-4 overflow-y-scroll size-full">
        <Tile title="Market analysis">
          <EmbedDashboard />
        </Tile>
      </div>
    </>
  )
}

export default Home
