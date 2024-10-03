import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './index.css'
import SelfService from './components/SelfService/SelfService.jsx'
import Home from './components/Home/Home.jsx'
import Root from './Root.jsx'
import Login from './components/Login/Login.jsx'
import ApiPage from 'components/Api/ApiPage.jsx'
import TabbedEmbed from 'components/EmbedFlavors/EmbedFlavors.jsx'
import { initLookerSdk } from './hooks/useLookerEmbedSdk.js'
import { Authenticated } from './components/Authenticated.jsx'
import { AuthProvider } from './hooks/useAuth'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Authenticated>
                <Root />
              </Authenticated>
            }
          >
            <Route path="" name="Overview" element={<Home />} />
            <Route path="reports" element={<TabbedEmbed />} />
            <Route path="custom" element={<ApiPage />} />
            <Route path="explore" element={<SelfService />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
initLookerSdk()
