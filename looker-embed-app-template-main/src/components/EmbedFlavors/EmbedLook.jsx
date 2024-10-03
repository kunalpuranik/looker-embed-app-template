import { LookerEmbedSDK } from '@looker/embed-sdk'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { lookerConfig } from '../../lookerConfig'
import React from 'react'

const EmbedLook = ({id}) => {
  const navigate = useNavigate()
  const [lookStatus, setLookStatus] = useState('Loading...')
  const [look, setLook] = useState(undefined)

  const onLookSetup = (d) => {
    setLook(d)
  }

  const setupLook = useCallback(
    (div) => {
      if (!div) {
        return
      }
      // div.innerHTML = "";
      LookerEmbedSDK.createLookWithId(id)
        .withAllowAttr('fullscreen')
        .appendTo(div)
        .withTheme("EmbedAppTemplate")
        // Listen to messages to display progress

        // Listen to session status
        .on('session:status', (event) => {
          if (event.expired) {
            setLookStatus('Session expired')
          } else if (event.interrupted) {
            setLookStatus('Session interrupted')
          }
        })
        // Give the embedded content a class for styling purposes
        .withClassName('looker-embed')
        .build()
        .connect()
        .then(onLookSetup)
        .catch((error) => {
          setLookStatus('Connection error')
          console.error('Connection error', error)
          navigate("/login")
        })
    },
    [navigate, id]
  )
  return (
    <>
      {/* <div id="dashboard-state" className="loading-message">
        {dashboardStatus}
      </div> */}
      <div id="look" ref={setupLook}></div>
    </>
  )
}

export default EmbedLook
