"use client"

import type React from "react"
import "../styles/RangeSlider.css"

interface RangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, value, onChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number.parseInt(e.target.value)
    onChange([newMin, Math.max(newMin, value[1])])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number.parseInt(e.target.value)
    onChange([Math.min(value[0], newMax), newMax])
  }

  return (
    <div className="range-slider">
      <div className="range-inputs">
        <input type="range" min={min} max={max} value={value[0]} onChange={handleMinChange} className="range-input" />
        <input type="range" min={min} max={max} value={value[1]} onChange={handleMaxChange} className="range-input" />
      </div>
      <div className="range-values">
        <span>{value[0]}</span>
        <span>-</span>
        <span>{value[1]}</span>
      </div>
    </div>
  )
}

export default RangeSlider
