import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initOutlook } from './services/outlook'

const root = createRoot(document.getElementById('root'))
const render = () => root.render(<StrictMode><App /></StrictMode>)

// Only wait on MSAL when we're actually returning from a Microsoft sign-in
// redirect (so the router can't strip the auth code first). On every normal
// load, render immediately and initialise Outlook in the background — the app
// must never hang waiting on MSAL.
const url = window.location.hash + window.location.search
const returningFromAuth = url.includes('code=') || url.includes('error=') || url.includes('id_token=')

if (returningFromAuth) {
  initOutlook().finally(render)
} else {
  render()
  initOutlook()
}
