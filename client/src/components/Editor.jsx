import React, { useState } from "react";
// import { MonacoEditor } from "@monaco-editor/react";
import MonacoEditor from '@monaco-editor/react';


function Editor() {
  const [language, setLanguage] = useState("cpp"); // Default language: C++
  const [code, setCode] = useState("// Write your code here!");

  const handleEditorChange = (value) => {
    setCode(value); // Update code state on editor change
  };

  return (
    <div className="p-4">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="cpp">C++</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>

      <div className="h-screen  rounded overflow-hidden">
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          defaultValue={code}
          theme="vs-dark" // Dark theme for the editor
          onChange={handleEditorChange} // Handle changes to the editor content
          options={{
            fontSize: 14,
            automaticLayout: true, // Adjust editor layout dynamically
            minimap: { enabled: false }, // Disable minimap for simplicity
          }}
        />
      </div>
    </div>
  );
}

export default Editor;
