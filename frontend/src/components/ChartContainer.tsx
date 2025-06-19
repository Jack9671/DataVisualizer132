"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Plot from "react-plotly.js"
import "../styles/ChartContainer.css"

interface ChartContainerProps {
  title: string
  endpoint: string
  payload: any
  loading: boolean
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, endpoint, payload, loading }) => {
  const [chartData, setChartData] = useState<any>(null)
  const [chartLoading, setChartLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (payload.selected_countries?.length > 0 || payload.selected_tech_domains?.length > 0)) {
      fetchChartData()
    }
  }, [loading, payload])

  const fetchChartData = async () => {
    setChartLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch chart data")
      }

      const data = await response.json()
      setChartData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setChartLoading(false)
    }
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        {chartLoading ? (
          <div className="chart-loading">Loading chart...</div>
        ) : error ? (
          <div className="chart-error">Error: {error}</div>
        ) : chartData ? (
          <Plot
            data={chartData.data}
            layout={{
              ...chartData.layout,
              autosize: true,
              margin: { l: 50, r: 50, t: 50, b: 50 },
            }}
            config={{ responsive: true }}
            style={{ width: "100%", height: "400px" }}
          />
        ) : (
          <div className="chart-placeholder">Select filters and click Apply to view chart</div>
        )}
      </div>
    </div>
  )
}

export default ChartContainer
