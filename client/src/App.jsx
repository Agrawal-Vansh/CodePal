import React from 'react'
import {Navigate,Routes,Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import ErrorPage from './pages/ErrorPage'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Navigate to="/home"/>}/>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/editor/:roomId' element={<EditorPage/>}/>
      <Route path='*' element={<ErrorPage/>}/>
    </Routes>
    </>
  )
}

export default App
