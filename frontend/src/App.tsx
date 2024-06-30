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
  DropdownMenuTrigger,
} from "./components/ui/dropdown";
import { Button } from "./components/ui/button";
import { Javascript, Java, Python, CPP, C, Ruby } from "./assets/Icons";

if (typeof window !== "undefined") {
  Prism.manual = true;
}

const languageMap: { [key: string]: { name: string; icon: React.ReactNode } } = {
  nodejs: { name: 'Node.js', icon: <Javascript /> },
  python: { name: 'Python', icon: <Python /> },
  cpp: { name: 'C++', icon: <CPP /> },
  c: { name: 'C', icon: <C /> },
  java: { name: 'Java', icon: <Java /> },
  ruby: { name: 'Ruby', icon: <Ruby /> },
};

const placeholderMap: { [key: string]: string } = {
  nodejs: 'console.log("Hello, World!");',
  python: 'print("Hello, World!")',
  cpp: '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  ruby: 'puts "Hello, World!"',
};

const OnlineCompiler = () => {
  const [highlightLanguage, setHighlightLanguage] = useState("javascript");
  const [compileLanguage, setCompileLanguage] = useState("nodejs");
  const [script, setScript] = useState(placeholderMap["nodejs"]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [script, highlightLanguage]);

  const handleCompileLanguageChange = (lang: string) => {
    setCompileLanguage(lang);
    setHighlightLanguage(languageMap[lang].name.toLowerCase());
    setScript(placeholderMap[lang]);
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
        <form onSubmit={handleSubmit} className="mb-4">
          <div>
            <label
              htmlFor="compileLanguage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Compilation Language:
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-fit flex items-center justify-between">
                  <span className="flex items-center">
                    <div className="flex flex-row gap-2 items-center">
                      {languageMap[compileLanguage].icon}
                      {languageMap[compileLanguage].name}
                    </div>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit">
                {Object.entries(languageMap).map(([key, { name, icon }]) => (
                  <DropdownMenuItem
                    key={key}
                    className="flex flex-row px-4 py-2 w-full"
                    onClick={() => handleCompileLanguageChange(key)}
                  >
                    <div className="flex flex-row gap-4 text-lg items-center w-full">
                      {icon}
                      {name}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-row gap-4 w-full">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Run
            </button>
          </div>
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
            placeholder="start typing your code"
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
