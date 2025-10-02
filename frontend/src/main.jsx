// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import './index.css' // We will create this next

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)