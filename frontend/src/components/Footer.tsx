import type React from "react"
import "../styles/Footer.css"

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Created by <strong>Nguyen Xuan Duy Thai</strong>
        </p>
        <p>Patent Data Visualization Dashboard</p>
      </div>
    </footer>
  )
}

export default Footer
