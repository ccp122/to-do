import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes'
import { generalVariables, cssVariables }  from './variables/variables'
import { StuffProvider } from './context/StuffContext'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    document.title = generalVariables.name
    const tabIcon = document.querySelector('link[rel="icon')
    if (tabIcon) {
      tabIcon.setAttribute('href', generalVariables.logo)
    }

    Object.entries(cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value)
    })
  }, [])

  return (
    <StuffProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </StuffProvider>
  )
}

export default App
