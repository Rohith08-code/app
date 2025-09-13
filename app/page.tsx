"use client"

import { useState } from "react"
import { CodeEditor } from "@/components/code-editor"
import { ExercisePanel } from "@/components/exercise-panel"
import { TutorialSidebar } from "@/components/tutorial-sidebar"
import { AnalysisPanel } from "@/components/analysis-panel"
import { Header } from "@/components/header"
import { WelcomeGuide } from "@/components/welcome-guide"

export default function HomePage() {
  const [currentCode, setCurrentCode] = useState("")
  const [showWelcome, setShowWelcome] = useState(true)

  const handleCodeChange = (code: string) => {
    setCurrentCode(code)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {showWelcome && <WelcomeGuide onClose={() => setShowWelcome(false)} />}

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Tutorial Sidebar */}
        <TutorialSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Code Editor Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border bg-card/30">
              <h2 className="text-lg font-semibold text-foreground">Interactive Code Editor</h2>
              <p className="text-sm text-muted-foreground">
                Write your code below and see results instantly. Don't worry about making mistakes - that's how we
                learn!
              </p>
            </div>
            <div className="flex-1 p-4">
              <CodeEditor onCodeChange={handleCodeChange} />
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-96 border-l border-border flex flex-col">
            <ExercisePanel />
            <AnalysisPanel code={currentCode} />
          </div>
        </div>
      </div>
    </div>
  )
}
