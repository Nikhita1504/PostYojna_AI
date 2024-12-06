import { useState } from 'react'


import './App.css'
import Sidebar from './components/sidebar/SideBar'

import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Sidebar/>
     <Header/>
     <Outlet/>
    </>
  )
}

export default App
