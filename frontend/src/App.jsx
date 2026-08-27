import React, { useState, useEffect, useRef } from 'react';
import { getDocumentById, updateDocument, createDocument, shareDocument } from './api';

function App() {
  const [docId, setDocId] = useState(2); // Backend me bane document ki ID
  const [title, setTitle] = useState('');
  const [shareUserId, setShareUserId] = useState('');
  const [status, setStatus] = useState('');
  const editorRef = useRef(null);

  // Load Document Content
  useEffect(() => {
    if (docId) {
      getDocumentById(docId)
        .then((res) => {
          setTitle(res.data.title || '');
          if (editorRef.current) {
            editorRef.current.innerHTML = res.data.content || '';
          }
        })
        .catch(() => setStatus('Document fetch error ❌'));
    }
  }, [docId]);

  // Formatting Helper (Bold, Italic, Headings, Lists)
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // Save Document
  const handleSave = async () => {
    const currentContent = editorRef.current ? editorRef.current.innerHTML : '';
    try {
      await updateDocument(docId, { title, content: currentContent });
      setStatus('Document Saved Successfully! ✅');
    } catch (err) {
      setStatus('Save Failed ❌');
    }
  };

  // File Upload Handling (.txt / .md)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        try {
          const res = await createDocument({
            title: file.name.replace(/\.[^/.]+$/, ""),
            content: `<pre>${fileContent}</pre>`,
            owner_id: 1
          });
          setDocId(res.data.id);
          setStatus(`File imported as Doc ID: ${res.data.id} ✅`);
        } catch (err) {
          setStatus('File upload error ❌');
        }
      };
      reader.readAsText(file);
    }
  };

  // Share Document
  const handleShare = async () => {
    if (!shareUserId) return;
    try {
      await shareDocument(docId, parseInt(shareUserId));
      setStatus(`Shared with User ID ${shareUserId} ✅`);
    } catch (err) {
      setStatus('Sharing Failed ❌');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>Ajaia Docs - Rich Text Editor</h2>

      {/* File Import */}
      <div style={{ marginBottom: '15px', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
        <label><b>Import (.txt / .md File): </b></label>
        <input type="file" accept=".txt,.md" onChange={handleFileUpload} />
      </div>

      {/* Document Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '18px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
        placeholder="Document Title"
      />

      {/* Rich Text Toolbar */}
      <div style={{ border: '1px solid #ccc', borderBottom: 'none', padding: '8px', background: '#e9e9e9', borderRadius: '4px 4px 0 0', display: 'flex', gap: '8px' }}>
        <button type="button" onClick={() => executeCommand('bold')}><b>B</b></button>
        <button type="button" onClick={() => executeCommand('italic')}><i>I</i></button>
        <button type="button" onClick={() => executeCommand('underline')}><u>U</u></button>
        <button type="button" onClick={() => executeCommand('formatBlock', '<h1>')}>H1</button>
        <button type="button" onClick={() => executeCommand('formatBlock', '<h2>')}>H2</button>
        <button type="button" onClick={() => executeCommand('insertUnorderedList')}>• Bullet List</button>
        <button type="button" onClick={() => executeCommand('insertOrderedList')}>1. Numbered List</button>
      </div>

      {/* Editable Canvas */}
      <div
        ref={editorRef}
        contentEditable
        style={{
          border: '1px solid #ccc',
          minHeight: '250px',
          padding: '15px',
          borderRadius: '0 0 4px 4px',
          marginBottom: '20px',
          background: '#fff',
          outline: 'none'
        }}
      />

      {/* Actions */}
      <button onClick={handleSave} style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px' }}>
        Save Document
      </button>

      {/* Sharing Section */}
      <div style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '15px' }}>
        <h3>Share Document</h3>
        <input
          type="number"
          placeholder="User ID (e.g. 2)"
          value={shareUserId}
          onChange={(e) => setShareUserId(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleShare} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Share
        </button>
      </div>

      {status && <p style={{ marginTop: '15px', color: status.includes('❌') ? 'red' : 'green', fontWeight: 'bold' }}>{status}</p>}
    </div>
  );
}

export default App;