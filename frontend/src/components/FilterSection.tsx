"use client"

import type React from "react"
import { useState } from "react"
import RangeSlider from "./RangeSlider"
import CheckboxGroup from "./CheckboxGroup"
import SearchBar from "./SearchBar"
import "../styles/FilterSection.css"

interface FilterSectionProps {
  filters: {
    yearRange: [number, number]
    selectedCountries: string[]
    selectedTechDomains: string[]
  }
  setFilters: React.Dispatch<React.SetStateAction<any>>
  uniqueValues: {
    years: number[]
    countries: string[]
    techDomains: string[]
  }
  onApply: () => void
  loading: boolean
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, setFilters, uniqueValues, onApply, loading }) => {
  const [countrySearch, setCountrySearch] = useState("")
  const [techDomainSearch, setTechDomainSearch] = useState("")

  const filteredCountries = uniqueValues.countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase()),
  )

  const filteredTechDomains = uniqueValues.techDomains.filter((domain) =>
    domain.toLowerCase().includes(techDomainSearch.toLowerCase()),
  )

  const handleSelectAllCountries = () => {
    setFilters((prev) => ({
      ...prev,
      selectedCountries: [...uniqueValues.countries],
    }))
  }

  const handleClearAllCountries = () => {
    setFilters((prev) => ({
      ...prev,
      selectedCountries: [],
    }))
  }

  const handleSelectAllTechDomains = () => {
    setFilters((prev) => ({
      ...prev,
      selectedTechDomains: [...uniqueValues.techDomains],
    }))
  }

  const handleClearAllTechDomains = () => {
    setFilters((prev) => ({
      ...prev,
      selectedTechDomains: [],
    }))
  }

  return (
    <section className="filter-section">
      <h2>Filters</h2>

      <div className="filter-grid">
        <div className="filter-group">
          <h3>Year Range</h3>
          <RangeSlider
            min={Math.min(...uniqueValues.years)}
            max={Math.max(...uniqueValues.years)}
            value={filters.yearRange}
            onChange={(value) => setFilters((prev) => ({ ...prev, yearRange: value }))}
          />
        </div>

        <div className="filter-group">
          <h3>Countries</h3>
          <SearchBar placeholder="Search countries..." value={countrySearch} onChange={setCountrySearch} />
          <div className="button-group">
            <button onClick={handleSelectAllCountries} className="select-all-btn">
              Select All
            </button>
            <button onClick={handleClearAllCountries} className="clear-all-btn">
              Clear All
            </button>
          </div>
          <CheckboxGroup
            options={filteredCountries}
            selected={filters.selectedCountries}
            onChange={(selected) => setFilters((prev) => ({ ...prev, selectedCountries: selected }))}
          />
        </div>

        <div className="filter-group">
          <h3>Technology Domains</h3>
          <SearchBar
            placeholder="Search technology domains..."
            value={techDomainSearch}
            onChange={setTechDomainSearch}
          />
          <div className="button-group">
            <button onClick={handleSelectAllTechDomains} className="select-all-btn">
              Select All
            </button>
            <button onClick={handleClearAllTechDomains} className="clear-all-btn">
              Clear All
            </button>
          </div>
          <CheckboxGroup
            options={filteredTechDomains}
            selected={filters.selectedTechDomains}
            onChange={(selected) => setFilters((prev) => ({ ...prev, selectedTechDomains: selected }))}
          />
        </div>
      </div>

      <div className="apply-section">
        <button onClick={onApply} className="apply-btn" disabled={loading}>
          {loading ? "Applying..." : "Apply Filters"}
        </button>
      </div>
    </section>
  )
}

export default FilterSection
