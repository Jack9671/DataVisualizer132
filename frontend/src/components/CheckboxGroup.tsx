"use client"

import type React from "react"
import "../styles/CheckboxGroup.css"

interface CheckboxGroupProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, selected, onChange }) => {
  const handleChange = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="checkbox-group">
      {options.map((option) => (
        <label key={option} className="checkbox-item">
          <input type="checkbox" checked={selected.includes(option)} onChange={() => handleChange(option)} />
          <span className="checkbox-label">{option}</span>
        </label>
      ))}
    </div>
  )
}

export default CheckboxGroup
