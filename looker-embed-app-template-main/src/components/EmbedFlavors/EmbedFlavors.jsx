import React, { useEffect, useMemo, useState, useRef } from 'react'
import Tile from 'components/Tile/Tile'
import EmbedDashboard from 'components/EmbedFlavors/EmbedDashboard'
import EmbedLook from './EmbedLook'
import { lookerConfig } from 'lookerConfig'

function TabbedEmbed() {
  const [tab, setTab] = useState(1)
  const [selectedLook, setSelectedLook] = useState(209)

  const tabbedReportLoader = useMemo(() => {
    if(tab === 1) {
      return lookerConfig.tab1DashboardId
    }
    
    return lookerConfig.tab2DashboardId
  },[tab])

  const looks = [
    { id: lookerConfig.tab1LookId, question: "What's the performance by Product Category?" },
    { id: lookerConfig.tab2LookId, question: "How is our Revenue over time?" },
    { id: lookerConfig.tab3LookId, question: "Density of Loyal Users Regionally" }
  ];

  const loadLooks = () => {
    return (
      <div className="flex h-[95%] w-full flex-row p-0 relative">
      <div className="relative flex size-full w-1/3">
        <div className="mr-6 mt-8 flex h-full flex-col">
          {looks.map((look) => (
            <div
              key={look.id}
              onClick={() => setSelectedLook(look.id)}
              className={`flex cursor-pointer justify-between gap-5 border-t border-[#B1B1BD]/40 px-2 py-6 text-[17px] leading-tight antialiased last:border-b ${
                selectedLook === look.id
                  ? "text-primary-blue font-medium"
                  : "font-normal text-[#51515B]"
              }`}
            >
              <span>{look.question}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 8 13"
                fill="none"
                className="w-2 min-w-2 shrink-0"
              >
                <path
                  d="M1 12L6 6.5L1 1"
                  stroke={selectedLook === look.id ? "#2092fd" : "#51515B"}
                  strokeOpacity="0.5"
                  strokeWidth="2"
                ></path>
              </svg>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 relative overflow-hidden">
        {looks.map((look) => (
          <div
            key={look.id}
            className={`scrollitem absolute w-full h-full transition-all duration-500 ease-in-out ${
              selectedLook === look.id ? 'active' : ''
            }`}
          >
            <EmbedLook id={look.id} />
          </div>
        ))}
      </div>
    </div>
  )}

  return (
    <>
        <Tile styles="h-full w-full flex flex-col">
          <div class="w-[10vw] pl-4">
            <div class="mb-4 flex flex-row gap-3 text-[14px]">
              <div class="flex-1" onClick={() => setTab(1)}>
                <div class="group flex cursor-pointer flex-col border-b-4 py-2 pl-0 pt-5 text-left duration-300 ease-in-out text-[#9f9fa8] border-[#cfcfd9] hover:text-[#51515b]">
                <span class="flex-0 whitespace-nowrap px-3 antialiased">Overview</span>
                </div>
              </div>
              <div class="flex-1" onClick={() => setTab(2)}>
                <div class="group flex cursor-pointer flex-col border-b-4 py-2 pl-0 pt-5 text-left duration-300 ease-in-out text-[#9f9fa8] border-[#cfcfd9] hover:text-[#51515b]">
                  <span class="flex-0 whitespace-nowrap px-3 antialiased">Advanced</span>
                </div>
              </div>
              <div class="flex-1" onClick={() => setTab(3)}>
                <div class="group flex cursor-pointer flex-col border-b-4 py-2 pl-0 pt-5 text-left duration-300 ease-in-out border-primary-blue text-[#51515b]">
                  <span class="flex-0 whitespace-nowrap px-3 antialiased">Guided</span>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full pl-4 pr-4 h-[92%]">
            {tab !== 3 && <EmbedDashboard id={tabbedReportLoader} />}
            {tab === 3 && loadLooks()}
          </div>
        </Tile>
    </>
  )
}

export default TabbedEmbed