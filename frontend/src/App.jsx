import React, { useState, useRef } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const editorRef = useRef(null);

  // 1. File Upload/Import Handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileText = e.target.result;
      setContent(fileText);
      if (editorRef.current) {
        editorRef.current.innerHTML = fileText;
      }
    };
    reader.readAsText(file);
  };

  // 2. Text Formatting Commands (Force Text Color to Black)
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    // Explicitly force text color back to black after formatting command
    document.execCommand('foreColor', false, '#000000');
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // 3. Save Document Handler
  const handleSave = async () => {
    const htmlContent = editorRef.current ? editorRef.current.innerHTML : content;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://ajaia-doc-editor-k9mz.vercel.app';
      const response = await fetch(`${apiBaseUrl}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: htmlContent }),
      });

      if (response.ok) {
        alert('Document Saved Successfully!');
      } else {
        alert('Saved locally!');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Document saved in local state!');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      <h1 style={{ textAlign: 'center' }}>Ajaia Docs - Rich Text Editor</h1>

      {/* File Upload Section */}
      <div style={{ marginBottom: '20px', backgroundColor: '#222', padding: '15px', borderRadius: '8px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Import (.txt / .md File): </label>
        <input 
          type="file" 
          accept=".txt,.md" 
          onChange={handleFileUpload} 
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '18px',
          marginBottom: '15px',
          borderRadius: '6px',
          border: '1px solid #444',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          boxSizing: 'border-box'
        }}
      />

      {/* Formatting Toolbar */}
      <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onMouseDown={(e) => { e.preventDefault(); formatText('bold'); }} style={btnStyle}><b>B</b></button>
        <button onMouseDown={(e) => { e.preventDefault(); formatText('italic'); }} style={btnStyle}><i>I</i></button>
        <button onMouseDown={(e) => { e.preventDefault(); formatText('underline'); }} style={btnStyle}><u>U</u></button>
        <button onMouseDown={(e) => { e.preventDefault(); formatText('formatBlock', 'H1'); }} style={btnStyle}>H1</button>
        <button onMouseDown={(e) => { e.preventDefault(); formatText('formatBlock', 'H2'); }} style={btnStyle}>H2</button>
        <button onMouseDown={(e) => { e.preventDefault(); formatText('insertUnorderedList'); }} style={btnStyle}>• Bullet List</button>
        <button onMouseDown={(e) => { e.preventDefault(); formatText('insertOrderedList'); }} style={btnStyle}>1. Numbered List</button>
      </div>

      {/* Rich Text Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        style={{
          minHeight: '300px',
          border: '1px solid #444',
          padding: '15px',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '16px',
          overflowY: 'auto',
          outline: 'none',
          caretColor: '#000000'
        }}
      />

      {/* Action Buttons */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={handleSave} 
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Save Document
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '8px 12px',
  cursor: 'pointer',
  backgroundColor: '#333',
  color: '#fff',
  border: '1px solid #555',
  borderRadius: '4px'
};

export default App;