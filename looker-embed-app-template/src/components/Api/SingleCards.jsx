import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
// import { sdk } from '../../hooks/useLookerSdk'
import { lookerConfig } from '../../lookerConfig'
import Tile from 'components/Tile/Tile'
import reports from 'assets/reports.svg'

function SdkCustomView({sdk}) {
  const [events, setEvents] = useState([])

  const getEvents = useCallback(() => {
    sdk
      .run_query({
        query_id: lookerConfig.singleCards,
        result_format: "json",
      })
      .then((resp) => {
        setEvents(resp.value)
      })
  },[sdk])

  useEffect(() => {
    getEvents()
  }, [])

  return (
    <>
    {events.length > 0 ? (
        Object.entries(events[0]).map((event,index) => {
          if(index > 0) {
            return (
              <Tile title={event[0].split(".")[1]}>
                <div class="w-full h-full flex flex-row flex-start items-center">
                  <div class="rounded-full bg-black size-8 items-center justify-center flex mr-2">
                    <img
                      class="size-5 shrink-0 "
                      src={reports}
                      alt={"icon"}
                    />
                  </div>
                  <span class="text-lg font-bold">{index === 0 ? "$" + event[1].toLocaleString('en-US', { style: 'decimal', maximumFractionDigits : 0, minimumFractionDigits: 0, useGrouping: true }) : event[1] }</span>
                </div>
              </Tile>
            )
          }
        })
      ) : (
        <p>No Data</p>
    )}
    </>
  )
}

export default SdkCustomView