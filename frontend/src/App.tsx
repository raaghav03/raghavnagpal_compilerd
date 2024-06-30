import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-java";
import "prismjs/components/prism-ruby";
import "prismjs/themes/prism-tomorrow.css";
import { XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown";
import { Button } from "./components/ui/button";
import { Javascript, Java, Python, CPP, C, Ruby } from "./assets/Icons";

if (typeof window !== "undefined") {
  Prism.manual = true;
}

const languageMap: { [key: string]: string } = {
  nodejs: "javascript",
  python: "python",
  cpp: "cpp",
  clike: "c",
  java: "java",
  ruby: "ruby",
};

const OnlineCompiler = () => {
  const [highlightLanguage, setHighlightLanguage] = useState("javascript");
  const [compileLanguage, setCompileLanguage] = useState("nodejs");
  const [script, setScript] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef(null);
  const [position, setPosition] = React.useState("bottom");
  const preRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [script, highlightLanguage]);

  const handleCompileLanguageChange = (lang: string) => {
    setCompileLanguage(lang);
    setHighlightLanguage(languageMap[lang]);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/api/execute", {
        language: compileLanguage,
        script,
      });
      setOutput(response.data.output);
    } catch (error) {
      setError("Error executing the script");
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setScript(value);
  };

  const clearOutput = () => {
    setOutput("");
    setError("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 p-4 flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Online Compiler</h1>
        {/* <DropdownMenu
          value={compileLanguage}
          onChange={handleCompileLanguageChange}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{compileLanguage}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex flex-row gap-2" v>
              <Javascript />
              Javascript
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-row gap-2">
              <Java />
              Java
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-row gap-2">
              <Python />
              Python
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-row gap-2">
              <CPP />
              C++
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-row gap-2">
              <C />C
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-row gap-2">
              <Ruby />
              Ruby
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <form onSubmit={handleSubmit} className="mb-4">
          <label
            htmlFor="compileLanguage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Compilation Language:
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{compileLanguage}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="flex flex-row gap-2" onClick={() => handleCompileLanguageChange('nodejs')}>
                <Javascript />
                Node.js
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row gap-2" onClick={() => handleCompileLanguageChange('java')}>
                <Java />
                Java
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row gap-2" onClick={() => handleCompileLanguageChange('python')}>
                <Python />
                Python
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row gap-2" onClick={() => handleCompileLanguageChange('cpp')}>
                <CPP />
                C++
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row gap-2" onClick={() => handleCompileLanguageChange('clike')}>
                <C />
                C
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row gap-2" onClick={() => handleCompileLanguageChange('ruby')}>
                <Ruby />
                Ruby
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Run
          </button>
        </form>
        <div className="relative flex-grow overflow-hidden rounded-md shadow-sm">
          <pre
            ref={preRef}
            className={`language-${highlightLanguage} absolute top-0 left-0 m-0 w-full h-full overflow-auto`}
          >
            <code>{script}</code>
          </pre>
          <textarea
            ref={textareaRef}
            value={script}
            onChange={handleScriptChange}
            className="absolute top-0 left-0 w-full h-full resize-none bg-transparent text-transparent caret-black font-mono p-4 z-10 outline-none"
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "rgba(0,0,0,0.0)",
              caretColor: "black",
            }}
            spellCheck="false"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
      </div>
      <div className="w-1/2 p-4 bg-gray-200 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Output</h2>
          <button
            onClick={clearOutput}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle size={24} />
          </button>
        </div>
        <pre className="flex-grow p-4 bg-white rounded-md shadow-inner overflow-auto">
          {error && <div className="text-red-500">{error}</div>}
          {output}
        </pre>
      </div>
    </div>
  );
};

export default OnlineCompiler;
