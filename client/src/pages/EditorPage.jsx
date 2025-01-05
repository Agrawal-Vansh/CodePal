import React from 'react'
import Dashboard from '../components/Dashboard'
import Editor from '../components/Editor'
function EditorPage() {
  return (
    <>
   <div className="flex h-screen w-screen">
      {/* Member Section */}
      <div className="w-1/5 bg-gray-800">
        <Dashboard />
      </div>

      {/* Editor Section */}
      <div className="w-4/5 bg-gray-50">
        <Editor />
      </div>
    </div>
    </>
  )
}

export default EditorPage
