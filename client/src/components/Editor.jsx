import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";

function Editor({ socketRef, roomId }) {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here!");
  const [isLocalChange, setIsLocalChange] = useState(false);

  const handleEditorChange = (value) => {
    setIsLocalChange(true);
    setCode(value);
  };

  useEffect(() => {
    if (socketRef.current) {
      const handleCodeUpdate = ({ code, language }) => {
        if (!isLocalChange) {
          setCode(code);
          setLanguage(language);
        }
        setIsLocalChange(false);
      };
      const handleInitializeCode = (data) => {
        // console.log("I am initailizing code");
        console.log("data received is "+ JSON.stringify(data));
        const { code, language }=data;

        
        setCode(code);
        setLanguage(language);
      };

      socketRef.current.emit("codeChange", { roomId, code, language });
      socketRef.current.on("codeUpdate", handleCodeUpdate);
      console.log("Setting up listener for initializeCode");
      socketRef.current.on("initializeCode", handleInitializeCode);


      return () => {
        socketRef.current.off("codeUpdate", handleCodeUpdate);
        socketRef.current.off("initializeCode", handleInitializeCode);

      };
    }
  }, [socketRef, roomId, code, language, isLocalChange]);

  return (
    <div className="p-4">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>

      <div className="h-screen rounded overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}

export default Editor;
