import React from 'react'
import Tile from '../Tile/Tile'
import EventsLineGraph from './EventsLineGraph'
import QueriesPieChart from './QueriesPieChart'
import SingleCards from './SingleCards'
import { sdk } from '../../hooks/useLookerSdk'

const ApiPage = () => {
  return (
    <>
      <div class="flex flex-col gap-3 p-4 overflow-y-scroll h-[90%] w-[95%]">
        <div class="flex flex-row gap-3 h-1/5">
          <SingleCards sdk={sdk}/>
        </div>
        {/* <div class="flex flex-row gap-3 h-1/3">
          <Tile title="Stock Price Overtime">
            <EventsLineGraph sdk={sdk}/>
          </Tile>
          <Tile title="Portfolio Distribution by Sector">
            <QueriesPieChart sdk={sdk}/>
          </Tile>
        </div> */}
        <Tile title="Stock Price Overtime">
          <EventsLineGraph sdk={sdk}/>
        </Tile>
      </div>
    </>
  )
}

export default ApiPage