import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TimeLogCalculator from './App.jsx'
import WorkHoursGuide from './WorkHoursGuide.jsx'
import About from './About.jsx'
import Contact from './Contact.jsx'
import PrivacyPolicy from './PrivacyPolicy.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TimeLogCalculator />} />
        <Route path="/work-hours-guide" element={<WorkHoursGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
