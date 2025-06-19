"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "../styles/SummarySection.css"

interface SummarySectionProps {
  filters: {
    yearRange: [number, number]
    selectedCountries: string[]
    selectedTechDomains: string[]
  }
  loading: boolean
}

const SummarySection: React.FC<SummarySectionProps> = ({ filters, loading }) => {
  const [totalPatents, setTotalPatents] = useState(0)

  useEffect(() => {
    const getYearsArray = () => {//this is used to get the years array from the year range
      const years = []
      for (let i = filters.yearRange[0]; i <= filters.yearRange[1]; i++) {
        years.push(i)
      }
      return years
    }
    // Calculate total patents based on filters
    const calculateTotalPatents = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/getTotalPatentsFromSelectedYearsCountriesAndTechnologyDomains", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selected_years: getYearsArray(),
            selected_countries: filters.selectedCountries,
            selected_tech_domains: filters.selectedTechDomains,
          }),
        })
        if (!response.ok) {
          throw new Error("Failed to fetch total patents")
        }
        const data = await response.json()
        setTotalPatents(data.total_patents || 0)
      } catch (error) {
        console.error("Error fetching total patents:", error)
        setTotalPatents(0)
      }
    }
    if (!loading && (filters.selectedCountries.length > 0 || filters.selectedTechDomains.length > 0)) {
      calculateTotalPatents()
    }
  }, [filters, loading])

  return (
    <section className="summary-section">
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Patents</h3>
          <div className="summary-value">{loading ? "..." : totalPatents.toLocaleString()}</div>
          <div className="summary-subtitle">For selected criteria</div>
        </div>

        <div className="summary-card">
          <h3>Selection Summary</h3>
          <div className="summary-details">
            <div className="detail-item">
              <span className="detail-label">Years:</span>
              <span className="detail-value">
                {filters.yearRange[0]} - {filters.yearRange[1]}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Countries:</span>
              <span className="detail-value">{filters.selectedCountries.length} selected</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tech Domains:</span>
              <span className="detail-value">{filters.selectedTechDomains.length} selected</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SummarySection
