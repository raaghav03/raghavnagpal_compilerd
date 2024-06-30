import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './components/ui/button'



function App() {
  const [language, setLanguage] = useState<string>('nodejs');
  const [script, setScript] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/execute', { language, script });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error executing the script');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <Button>click me</Button>

        <h1>Online Compiler</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Language:
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="nodejs">Node.js</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="ruby">Ruby</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Script:
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={10} // Changed from string to number
                cols={50} // Changed from string to number
              />
            </label>
          </div>
          <button type="submit">Run</button>
        </form>
        <div>
          <h2>Output:</h2>
          <pre>{output}</pre>
        </div>
      </main>
    </div>
  );
}

export default App;
