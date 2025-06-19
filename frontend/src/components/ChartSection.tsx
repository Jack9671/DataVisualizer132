import type React from "react"
import ChartContainer from "./ChartContainer"
import "../styles/ChartSection.css"

interface ChartSectionProps {
  filters: {
    yearRange: [number, number]
    selectedCountries: string[]
    selectedTechDomains: string[]
  }
  loading: boolean
}

const ChartSection: React.FC<ChartSectionProps> = ({ filters, loading }) => {
  const getYearsArray = () => {
    const years = []
    for (let i = filters.yearRange[0]; i <= filters.yearRange[1]; i++) {
      years.push(i)
    }
    return years
  }

  const chartConfigs = [
    {
      title: "Single Bar Chart",
      endpoint: "/api/getBarChartForNumberOfPatentsWithRespectToCountry",
      payload: {
        selected_years: getYearsArray(),
        selected_countries: filters.selectedCountries,
        selected_tech_domains: filters.selectedTechDomains,
      },
    },
    {
      title: "Single Bar Chart",
      endpoint: "/api/getBarChartForNumberOfPatentsWithRespectToTechnologyDomain",
      payload: {
        selected_years: getYearsArray(),
        selected_countries: filters.selectedCountries,
        selected_tech_domains: filters.selectedTechDomains,
      },
    },
    {
      title: "Group Bar Chart",
      endpoint: "/api/getGroupBarChartForNumberOfPatentsPerCountryWithRespectToYear",
      payload: {
        selected_years: getYearsArray(),
        selected_countries: filters.selectedCountries,
        selected_tech_domains: filters.selectedTechDomains,
      },
    },
    {
      title: "Group Bar Chart",
      endpoint: "/api/getGroupBarChartForNumberOfPatentsPerTechnologyDomainWithRespectToYear",
      payload: {
        selected_years: getYearsArray(),
        selected_countries: filters.selectedCountries,
        selected_tech_domains: filters.selectedTechDomains,
      },
    },
    {
      title: "Single Line Graph",
      endpoint: "/api/getLineGraphForNumberOfPatentsWithRespectToYear",
      payload: {
        selected_years: getYearsArray(),
        selected_countries: filters.selectedCountries,
        selected_tech_domains: filters.selectedTechDomains,
      },
    },
    {
      title: "Multi Line Graph",
      endpoint: "/api/getMultipleLineGraphForNumberOfPatentsPerTechnologyDomainWithRespectToYear",
      payload: {
        selected_years: getYearsArray(),
        selected_countries: filters.selectedCountries,
        selected_tech_domains: filters.selectedTechDomains,
      },
    },
  ]

  return (
    <section className="chart-section">
      <h2>Visualizations</h2>
      <div className="charts-grid">
        {chartConfigs.map((config, index) => (
          <ChartContainer
            key={index}
            title={config.title}
            endpoint={config.endpoint}
            payload={config.payload}
            loading={loading}
          />
        ))}
      </div>
    </section>
  )
}

export default ChartSection
