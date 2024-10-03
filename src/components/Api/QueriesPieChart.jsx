import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  Colors,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Pie } from 'react-chartjs-2'
// import { sdk } from '../../hooks/useLookerSdk'

ChartJS.register(CategoryScale, Colors, Tooltip, Legend, PointElement)

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 10
        },
        padding: 10
      }
      }
    },
    layout: {
      padding: 20
    }
}

function SdkCustomView({sdk}) {
  const [apiUsage, setApiUsage] = useState([])

  const apiUsageChart = useMemo(
    () => {
      const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(40, 159, 64, 0.7)',
        'rgba(210, 199, 199, 0.7)',
      ]
      return {
        labels: apiUsage.map((e) => e['portfolio_performance.sector']),
        datasets: [
          {
            label: 'Distribution',
            data: apiUsage.map((e) => e['portfolio_performance.count']),
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.7', '1')),
            borderWidth: 1,
            hoverOffset: 10,
            cutout: '80%'
          }
        ]
      }
    }, [apiUsage]
  )

  const getApiUsage = useCallback(() => {
    sdk
      .run_inline_query({
        result_format: 'json',
        limit: 500,
        body: {
          model: 'financial_market_demo',
          view: 'portfolio_performance',
          fields: ['portfolio_performance.sector', 'portfolio_performance.count'],
          sorts: ['portfolio_performance.count desc 0']
        }
      })
      .then((resp) => {
        setApiUsage(resp.value)
      })
  },[sdk])

  useEffect(() => {
    getApiUsage()
  }, [])

  return (
    <>{apiUsage.length > 0 ? <Pie data={apiUsageChart} options={options}/> : <p>No Data</p>}</>
  )
}

export default SdkCustomView
