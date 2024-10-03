import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ArcElement,
  Filler
} from 'chart.js'
import { Line, PolarArea } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-date-fns'
// import { sdk } from '../../hooks/useLookerSdk'
import { lookerConfig } from 'lookerConfig'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ArcElement,
  zoomPlugin,
  Filler
)


function SdkCustomView({sdk}) {
  const [events, setEvents] = useState([])

  const eventsChart = useMemo(
    () => ({
      datasets: [
        {
          label: 'Stock Price',
          data: events.map((e) => ({
            x: new Date(e[Object.keys(e)[0]]),
            y: e[Object.keys(e)[1]]
          })),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192,0.2)',
          tension: 0.1,
          fill: 'start'
        }
      ]
    }),
    [events]
  )

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month'
        }
      },
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  }

  const getEvents = useCallback(() => {
    sdk
      .run_query({
        query_id: lookerConfig.timeSeries,
        result_format: "json",
      })
      .then((resp) => {
        console.log(resp.value)
        setEvents(resp.value)
      })
  },[sdk])

  useEffect(() => {
    getEvents()
  }, [])

  return (
    <div className="w-full h-full">
      {events.length > 0 ? (
        <Line data={eventsChart} options={options}/>
      ) : (
        <p>No Data</p>
      )}
    </div>
  )
}

export default SdkCustomView