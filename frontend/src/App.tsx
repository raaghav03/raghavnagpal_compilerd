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
import { XCircle, ChevronDown, Play, Loader2 } from "lucide-react";
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

type CompileLanguage = "nodejs" | "python" | "cpp" | "c" | "java" | "ruby";
type SyntaxLanguage = "javascript" | "python" | "cpp" | "c" | "java" | "ruby";

interface LanguageInfo {
  name: string;
  icon: React.ReactNode;
  syntaxLanguage: SyntaxLanguage;
}

const languageMap: Record<CompileLanguage, LanguageInfo> = {
  nodejs: { name: "Node.js", icon: <Javascript />, syntaxLanguage: "javascript" },
  python: { name: "Python", icon: <Python />, syntaxLanguage: "python" },
  cpp: { name: "C++", icon: <CPP />, syntaxLanguage: "cpp" },
  c: { name: "C", icon: <C />, syntaxLanguage: "c" },
  java: { name: "Java", icon: <Java />, syntaxLanguage: "java" },
  ruby: { name: "Ruby", icon: <Ruby />, syntaxLanguage: "ruby" },
};

const placeholderMap: Record<CompileLanguage, string> = {
  nodejs: 'console.log("Hello, World!");',
  python: 'print("Hello, World!")',
  cpp: '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  ruby: 'puts "Hello, World!"',
};

const OnlineCompiler: React.FC = () => {
  const [compileLanguage, setCompileLanguage] = useState<CompileLanguage>("nodejs");
  const [syntaxLanguage, setSyntaxLanguage] = useState<SyntaxLanguage>("javascript");
  const [script, setScript] = useState<string>(placeholderMap["nodejs"]);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [script, syntaxLanguage]);

  const handleCompileLanguageChange = (lang: CompileLanguage) => {
    setCompileLanguage(lang);
    setSyntaxLanguage(languageMap[lang].syntaxLanguage);
    setScript(placeholderMap[lang]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("/api/execute", {
        language: compileLanguage,
        script,
      });
      setOutput(response.data.output);
    } catch (error) {
      setError("Error executing the script");
    } finally {
      setLoading(false);
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
  };

  const clearOutput = () => {
    setOutput("");
    setError("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kalvium Online Compiler</h1>
        <h1 className="hover:underline text-gray-800 hover:font-medium transition-all"><a href="mailto:raghavnagpal2003@gmail.com">built by raghav nagpal</a></h1>
      </header>
      <main className="flex-grow flex flex-col p-4 space-y-4 overflow-hidden">
        <div className="flex items-center space-x-2 h-12">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-48 h-full">
                <span className="flex items-center justify-between w-full">
                  <span className="flex items-center space-x-2">
                    {languageMap[compileLanguage].icon}
                    <span>{languageMap[compileLanguage].name}</span>
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {Object.entries(languageMap).map(([key, { name, icon }]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleCompileLanguageChange(key as CompileLanguage)}
                >
                  <span className="flex items-center space-x-2">
                    {icon}
                    <span>{name}</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={handleSubmit}
            className="w-48 h-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Running...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Run Code</span>
              </span>
            )}
          </Button>
        </div>
        <div className="flex-grow flex space-x-4">
          <div className="w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">Code Editor</h2>
            </div>
            <div className="relative h-[calc(100%-40px)]">
              <pre
                ref={preRef}
                className={`language-${syntaxLanguage} absolute inset-0 m-0 overflow-auto`}
              >
                <code>{script}</code>
              </pre>
              <textarea
                ref={textareaRef}
                value={script}
                onChange={handleScriptChange}
                className="absolute inset-0 resize-none bg-transparent text-transparent caret-black font-mono p-4 z-10 outline-none"
                style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  caretColor: "black",
                }}
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>
          </div>
          <div className="w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">Output</h2>
              <Button
                onClick={clearOutput}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-200"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Clear Output
              </Button>
            </div>
            <pre className="p-4 h-[calc(100%-40px)] overflow-auto">
              {error && <div className="text-red-500 font-semibold mb-2">{error}</div>}
              {output}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnlineCompiler;