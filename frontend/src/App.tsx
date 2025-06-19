"use client"

import type React from "react"
import { useState, useEffect } from "react"
import FilterSection from "./components/FilterSection"
import SummarySection from "./components/SummarySection"
import ChartSection from "./components/ChartSection"
import Footer from "./components/Footer"
import "./styles/App.css"

interface FilterState {
  yearRange: [number, number]
  selectedCountries: string[]
  selectedTechDomains: string[]
}

interface UniqueValues {
  years: number[]
  countries: string[]
  techDomains: string[]
}

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    yearRange: [2016, 2020],
    selectedCountries: [],
    selectedTechDomains: [],
  })

  const [uniqueValues, setUniqueValues] = useState<UniqueValues>({
    years: [],
    countries: [],
    techDomains: [],
  })

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    yearRange: [2016, 2020],
    selectedCountries: [],
    selectedTechDomains: [],
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUniqueValues()
  }, [])

  const fetchUniqueValues = async () => {
    try {
      const [yearsRes, countriesRes, techDomainsRes] = await Promise.all([
        fetch("http://localhost:8000/api/getUniqueValuesForYear"),
        fetch("http://localhost:8000/api/getUniqueValuesForCountry"),
        fetch("http://localhost:8000/api/getUniqueValuesForTechnologyDomain"),
      ])

      const yearsData = await yearsRes.json()
      const countriesData = await countriesRes.json()
      const techDomainsData = await techDomainsRes.json()

      setUniqueValues({
        years: yearsData.unique_years,
        countries: countriesData.unique_countries,
        techDomains: techDomainsData.unique_tech_domains,
      })

      // Set initial filters
      setFilters((prev) => ({
        ...prev,
        yearRange: [Math.min(...yearsData.unique_years), Math.max(...yearsData.unique_years)],
      }))
    } catch (error) {
      console.error("Error fetching unique values:", error)
    }
  }

  const handleApplyFilters = () => {
    setLoading(true)
    setAppliedFilters({ ...filters })
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Patent Data Visualizer</h1>
      </header>

      <main className="app-main">
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          uniqueValues={uniqueValues}
          onApply={handleApplyFilters}
          loading={loading}
        />

        <SummarySection filters={appliedFilters} loading={loading} />

        <ChartSection filters={appliedFilters} loading={loading} />
      </main>

      <Footer />
    </div>
  )
}

export default App
