import { LookerEmbedSDK } from '@looker/embed-sdk'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { lookerConfig } from '../../lookerConfig'
import React from 'react'

const EmbedDashboard = ({id}) => {
  const navigate = useNavigate()
  const filterName = 'Traffic Source'
  const filterOptions = ['Display','Email','Organic','Search']
  const initialFilter = filterOptions[0]
  const [dashboardStatus, setDashboardStatus] = useState('Loading...')
  const [dashboard, setDashboard] = useState(undefined)
  const [selectedFilter, setSelectedFilter] = useState(initialFilter)

  const onDashboardSetup = (d) => {
    setDashboard(d)
  }

  useEffect(() => {
    if (dashboard) {
      dashboard.updateFilters({ [filterName]: selectedFilter })
      dashboard.run()
    }
  }, [dashboard, selectedFilter])

  const setupDashboard = useCallback(
    (div) => {
      if (!div) {
        return
      }
      div.innerHTML = "";
      LookerEmbedSDK.createDashboardWithId(id)
        .withAllowAttr('fullscreen')
        .appendTo(div)
        .withTheme("EmbedAppTemplate")
        // Listen to messages to display progress
        .on('dashboard:loaded', () => setDashboardStatus('Loaded'))
        .on('dashboard:run:start', (e) => {
          // console.log("Dashboard Run: ", e)
          setDashboardStatus('Running')
        })
        .on('dashboard:run:complete', () => setDashboardStatus('Done'))
        .on('dashboard:edit:start', () => setDashboardStatus('Editing'))
        .on('dashboard:filters:changed', (e) => {
          // console.log("Filters Changed: ", e)
          setSelectedFilter(e.dashboard.dashboard_filters[filterName])
        })
        .on('dashboard:edit:cancel', () =>
          setDashboardStatus('Editing cancelled')
        )
        .on('dashboard:save:complete', () => setDashboardStatus('Saved'))
        .on('dashboard:delete:complete', () => setDashboardStatus('Deleted'))

        // Listen to session status
        .on('session:status', (event) => {
          if (event.expired) {
            setDashboardStatus('Session expired')
          } else if (event.interrupted) {
            setDashboardStatus('Session interrupted')
          }
        })
        // Give the embedded content a class for styling purposes
        .withClassName('looker-embed')
        .withFilters({ [filterName]: initialFilter })
        .build()
        .connect()
        .then(onDashboardSetup)
        .catch((error) => {
          setDashboardStatus('Connection error')
          console.error('Connection error', error)
          navigate("/login")
        })
    },
    [setDashboardStatus, initialFilter, navigate, id]
  )
  return (
    <>
      {/* <label>
        Dashboard filter: {selectedFilter}
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {filterOptions.map((o) => (
            <option value={o}>{o}</option>
          ))}
        </select>
      </label> */}
      <div id="dashboard-state" className="loading-message">
        {dashboardStatus}
      </div>
      <div id="dashboard" ref={setupDashboard}></div>
    </>
  )
}

export default EmbedDashboard
