import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import TimeLogCalculator from './App.jsx'
import WorkHoursGuide from './WorkHoursGuide.jsx'
import About from './About.jsx'
import Contact from './Contact.jsx'
import PrivacyPolicy from './PrivacyPolicy.jsx'
import ScrollToTop from './components/Scroll.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<TimeLogCalculator />} />
        <Route path="/work-hours-guide" element={<WorkHoursGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </StrictMode>,
)