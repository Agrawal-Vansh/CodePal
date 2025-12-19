import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";

function Editor({ socketRef, roomId, isSocketReady }) {
  const editorRef = useRef(null);
  const debounceRef = useRef(null);
  
  const versionRef = useRef(0);
  const isInitializedRef = useRef(false);
  const isSyncingRef = useRef(false);
  const isApplyingRemoteRef = useRef(false);
  
  const [language, setLanguage] = useState("cpp");
  const DEBOUNCE_MS = 250;

  const log = (...args) => console.log("[EDITOR]", ...args);

  /* --------------------------------------------------
     SAFE EMIT
  -------------------------------------------------- */
  const emitCodeChange = (code) => {
    if (!socketRef.current) return;
    if (!isInitializedRef.current || isSyncingRef.current) return;

    log("EMIT", { version: versionRef.current, length: code.length });

    socketRef.current.emit("codeChange", {
      roomId,
      code,
      language,
      version: versionRef.current,
    });

    versionRef.current += 1;
  };

  /* --------------------------------------------------
     MONACO CHANGE (USER ONLY)
  -------------------------------------------------- */
  const handleEditorChange = (value) => {
    if (isApplyingRemoteRef.current) {
      log("IGNORED change (remote)");
      return;
    }

    const code = value ?? "";

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      emitCodeChange(code);
    }, DEBOUNCE_MS);
  };

  /* --------------------------------------------------
     APPLY REMOTE STATE DIRECTLY TO MONACO
  -------------------------------------------------- */
  const applyRemoteState = ({ code, language, version }) => {
    if (!editorRef.current) return;

    log("APPLY REMOTE", { version, length: code.length });

    isApplyingRemoteRef.current = true;
    isSyncingRef.current = false;

    versionRef.current = version;
    setLanguage(language);

    const model = editorRef.current.getModel();
    if (model && model.getValue() !== code) {
      model.pushEditOperations(
        [],
        [{ range: model.getFullModelRange(), text: code }],
        () => null
      );
    }

    setTimeout(() => {
      isApplyingRemoteRef.current = false;
    }, 0);
  };

  /* --------------------------------------------------
     SOCKET LISTENERS
  -------------------------------------------------- */
  useEffect(() => {
    if (!isSocketReady || !socketRef.current) return;

    const socket = socketRef.current;
    log("Socket ready → listeners attached");

    socket.on("initializeCode", (data) => {
      log("INITIALIZE", data.version);
      isInitializedRef.current = true;
      applyRemoteState(data);
    });

    socket.on("codeUpdate", (data) => {
      log("SERVER UPDATE", data.version);
      applyRemoteState(data);
    });

    socket.on("syncRequired", (data) => {
      log("SYNC REQUIRED", data.version);
      isSyncingRef.current = true;
      applyRemoteState(data);
    });

    return () => {
      socket.off("initializeCode");
      socket.off("codeUpdate");
      socket.off("syncRequired");
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [isSocketReady]);

  /* --------------------------------------------------
     LANGUAGE CHANGE
  -------------------------------------------------- */
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);

    if (!editorRef.current) return;
    emitCodeChange(editorRef.current.getValue());
  };

  /* --------------------------------------------------
     RENDER
  -------------------------------------------------- */
  return (
    <div className="p-4 h-full flex flex-col">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="mb-2 p-2 border rounded"
      >
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>

      <div className="flex-1 border rounded overflow-hidden">
        <MonacoEditor
          height="100%"
          defaultValue=""
          language={language}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={(editor) => {
            editorRef.current = editor;
            log("Monaco mounted");
          }}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

export default Editor;
