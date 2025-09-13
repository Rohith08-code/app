"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, Save, Terminal } from "lucide-react"

const initialCode = `// Welcome to CodeLearn!
// Try writing a simple function below

function greetUser(name) {
  return "Hello, " + name + "!";
}

// Test your function
console.log(greetUser("World"));`

const initialHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to web development!</p>
</body>
</html>`

const initialCSS = `/* Style your webpage */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    line-height: 1.6;
}`

interface CodeEditorProps {
  onCodeChange?: (code: string) => void
}

export function CodeEditor({ onCodeChange }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState("javascript")
  const [code, setCode] = useState({
    javascript: initialCode,
    html: initialHTML,
    css: initialCSS,
  })
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code[activeTab as keyof typeof code])
    }
  }, [code, activeTab, onCodeChange])

  const runCode = async () => {
    setIsRunning(true)
    try {
      if (activeTab === "javascript") {
        // Simulate code execution
        const logs: string[] = []
        const originalLog = console.log
        console.log = (...args) => {
          logs.push(args.join(" "))
        }

        // Simple evaluation (in real app, use a sandboxed environment)
        try {
          eval(code.javascript)
          setOutput(logs.join("\n") || "Code executed successfully!")
        } catch (error) {
          setOutput(`Error: ${error}`)
        }

        console.log = originalLog
      } else if (activeTab === "html") {
        setOutput("HTML preview would appear here in a real implementation")
      } else if (activeTab === "css") {
        setOutput("CSS styles applied to preview")
      }
    } catch (error) {
      setOutput(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    const defaults = {
      javascript: initialCode,
      html: initialHTML,
      css: initialCSS,
    }
    setCode({ ...code, [activeTab]: defaults[activeTab as keyof typeof defaults] })
    setOutput("")
  }

  const handleCodeChange = (value: string) => {
    const newCode = { ...code, [activeTab]: value }
    setCode(newCode)
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [code[activeTab as keyof typeof code]])

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetCode}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              variant="outline"
              style={{
                color: "#1f2937",
                backgroundColor: "#f9fafb",
                borderColor: "#10b981",
              }}
              className="font-medium hover:bg-emerald-50 disabled:opacity-50 bg-transparent"
            >
              <Play className="w-4 h-4 mr-2" style={{ color: "#10b981" }} />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          <div className="flex-1 flex flex-col">
            <TabsContent value="javascript" className="flex-1 m-0">
              <CodeEditorTextarea
                value={code.javascript}
                onChange={handleCodeChange}
                language="javascript"
                ref={textareaRef}
              />
            </TabsContent>
            <TabsContent value="html" className="flex-1 m-0">
              <CodeEditorTextarea value={code.html} onChange={handleCodeChange} language="html" ref={textareaRef} />
            </TabsContent>
            <TabsContent value="css" className="flex-1 m-0">
              <CodeEditorTextarea value={code.css} onChange={handleCodeChange} language="css" ref={textareaRef} />
            </TabsContent>
          </div>

          {/* Output Panel */}
          <div className="w-full lg:w-96 border-l border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <h3 className="font-medium">Output</h3>
                <Badge variant="outline" className="ml-auto text-foreground">
                  {activeTab}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <Card className="p-4 min-h-32 bg-muted/30">
                <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                  {output || "Click 'Run' to see output..."}
                </pre>
              </Card>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

interface CodeEditorTextareaProps {
  value: string
  onChange: (value: string) => void
  language: string
}

const CodeEditorTextarea = ({ value, onChange, language }: CodeEditorTextareaProps) => {
  return (
    <div className="relative h-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full p-4 font-mono text-sm bg-card border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 syntax-highlight"
        placeholder={`Write your ${language} code here...`}
        spellCheck={false}
      />
      <div className="absolute top-2 right-2">
        <Badge variant="outline" className="text-xs text-foreground bg-background">
          {language}
        </Badge>
      </div>
    </div>
  )
}
