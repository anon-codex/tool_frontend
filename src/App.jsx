import React from 'react'
import Navbar from './components/Navbar'
import Subdomain from './pages/Subdomain'
import PortScan from './pages/PortScan'
import { Routes,Route } from 'react-router-dom'
import Crawl from './pages/Crawl'

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
    <Route path='/' element={<Subdomain />} />
    <Route path='/portScan' element={<PortScan />} />
    <Route path='/crawl' element={<Crawl />} />
    </Routes>
    </>
  )
}

export default App