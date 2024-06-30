import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-ruby';
import 'prismjs/themes/prism-tomorrow.css';

if (typeof window !== 'undefined') {
  Prism.manual = true;
}

const OnlineCompiler: React.FC = () => {
  const [language, setLanguage] = useState<string>('javascript');
  const [script, setScript] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [script, language]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/execute', { language, script });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error executing the script');
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setScript(value);

    // Sync scroll position
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = script.substring(0, start) + '  ' + script.substring(end);
      setScript(newValue);

      // Set cursor position after inserting tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Online Compiler</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="javascript">Node.js</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="clike">C</option>
            <option value="java">Java</option>
            <option value="ruby">Ruby</option>
          </select>
        </div>
        <div>
          <label htmlFor="script" className="block text-sm font-medium text-gray-700">
            Script:
          </label>
          <div className="mt-1 relative rounded-md shadow-sm overflow-hidden" style={{ height: '300px' }}>
            <pre ref={preRef} className={`language-${language} absolute top-0 left-0 m-0 w-full h-full overflow-auto`}>
              <code>{script}</code>
            </pre>
            <textarea
              ref={textareaRef}
              id="script"
              value={script}
              onChange={handleScriptChange}
              onKeyDown={handleKeyDown}
              className="absolute top-0 left-0 w-full h-full resize-none bg-transparent text-transparent caret-white font-mono p-4 z-10 outline-none"
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                color: 'rgba(0,0,0,0.0)',
                caretColor: 'white',
              }}
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Run
        </button>
      </form>
      <div className="mt-4">
        <h2 className="text-lg font-medium text-gray-900">Output:</h2>
        <pre className="mt-2 p-4 bg-gray-800 text-white rounded-md overflow-x-auto">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default OnlineCompiler;