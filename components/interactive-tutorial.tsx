"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TutorialEngine, TutorialProgressTracker, type Tutorial } from "@/lib/tutorial-system"
import { ChevronLeft, ChevronRight, Play, CheckCircle, Clock, Trophy, BookOpen, Lightbulb } from "lucide-react"

interface InteractiveTutorialProps {
  tutorialId?: string
}

export function InteractiveTutorial({ tutorialId = "js-basics" }: InteractiveTutorialProps) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userCode, setUserCode] = useState("")
  const [output, setOutput] = useState("")
  const [showHints, setShowHints] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [stepCompleted, setStepCompleted] = useState(false)

  useEffect(() => {
    const tutorials = TutorialEngine.getAllTutorials()
    const selectedTutorial = tutorials.find((t) => t.id === tutorialId)
    if (selectedTutorial) {
      setTutorial(selectedTutorial)
      // Initialize or load progress
      let progress = TutorialProgressTracker.getProgress(tutorialId)
      if (!progress) {
        progress = TutorialProgressTracker.startTutorial(tutorialId)
      }
      setCurrentStepIndex(progress.currentStep)
    }
  }, [tutorialId])

  useEffect(() => {
    if (tutorial && tutorial.steps[currentStepIndex]) {
      const step = tutorial.steps[currentStepIndex]
      setUserCode(step.code || "")
      setOutput("")
      setShowHints(false)
      setQuizAnswers([])
      setStepCompleted(false)
    }
  }, [tutorial, currentStepIndex])

  const currentStep = tutorial?.steps[currentStepIndex]
  const progress = tutorial ? (currentStepIndex / tutorial.steps.length) * 100 : 0

  const runCode = async () => {
    if (!currentStep || currentStep.type !== "code") return

    try {
      // Simple code execution simulation
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.join(" "))
      }

      eval(userCode)
      console.log = originalLog

      const result = logs.join("\n") || "Code executed successfully"
      setOutput(result)

      // Validate the code
      if (currentStep.validation) {
        const validation = currentStep.validation(userCode)
        if (validation.isValid) {
          setStepCompleted(true)
          TutorialProgressTracker.updateProgress(tutorial!.id, currentStepIndex, 10)
        } else {
          setOutput(validation.message)
        }
      }
    } catch (error) {
      setOutput(`Error: ${error}`)
    }
  }

  const submitQuiz = () => {
    if (!currentStep || currentStep.type !== "quiz") return

    const validation = currentStep.validation?.(quizAnswers.join(","))
    if (validation) {
      setOutput(validation.message)
      if (validation.isValid) {
        setStepCompleted(true)
        TutorialProgressTracker.updateProgress(tutorial!.id, currentStepIndex, 20)
      }
    }
  }

  const nextStep = () => {
    if (tutorial && currentStepIndex < tutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else if (tutorial) {
      // Tutorial completed
      TutorialProgressTracker.completeTutorial(tutorial.id)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  if (!tutorial || !currentStep) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading tutorial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Tutorial Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{tutorial.title}</h1>
            <p className="text-muted-foreground">{tutorial.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {tutorial.estimatedTime}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Trophy className="w-3 h-3" />
              {tutorial.completionReward} pts
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Step {currentStepIndex + 1} of {tutorial.steps.length}: {currentStep.title}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Instructions */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">{currentStep.title}</h2>
              {stepCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>

            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentStep.content.replace(/\n/g, "<br>") }} />
            </div>

            {currentStep.hints.length > 0 && (
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => setShowHints(!showHints)} className="gap-2">
                  <Lightbulb className="w-4 h-4" />
                  {showHints ? "Hide" : "Show"} Hints
                </Button>

                {showHints && (
                  <Card className="p-4 bg-muted/30">
                    <div className="space-y-2">
                      {currentStep.hints.map((hint, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                          <p className="text-sm text-muted-foreground">{hint}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Right Panel - Interactive Content */}
        <Card className="p-6">
          {currentStep.type === "code" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Code Editor</h3>
                <Button onClick={runCode} size="sm" className="gap-2">
                  <Play className="w-4 h-4" />
                  Run Code
                </Button>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-64 p-4 font-mono text-sm bg-muted/30 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Write your code here..."
              />

              {output && (
                <Card className="p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">Output:</h4>
                  <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
                </Card>
              )}
            </div>
          )}

          {currentStep.type === "quiz" && (
            <div className="space-y-4">
              <h3 className="font-medium">Quiz Questions</h3>

              <div className="space-y-4">
                {/* This is a simplified quiz - in a real app, parse questions from content */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Question 1: Which keyword is best for declaring a constant?</p>
                  <RadioGroup
                    value={quizAnswers[0]}
                    onValueChange={(value) => {
                      const newAnswers = [...quizAnswers]
                      newAnswers[0] = value
                      setQuizAnswers(newAnswers)
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="q1a" />
                      <Label htmlFor="q1a">var</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="q1b" />
                      <Label htmlFor="q1b">let</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="q1c" />
                      <Label htmlFor="q1c">const</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Question 2: How do you add an item to the end of an array?</p>
                  <RadioGroup
                    value={quizAnswers[1]}
                    onValueChange={(value) => {
                      const newAnswers = [...quizAnswers]
                      newAnswers[1] = value
                      setQuizAnswers(newAnswers)
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="q2a" />
                      <Label htmlFor="q2a">array.add()</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="q2b" />
                      <Label htmlFor="q2b">array.push()</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="q2c" />
                      <Label htmlFor="q2c">array.append()</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={submitQuiz} className="w-full">
                  Submit Quiz
                </Button>

                {output && (
                  <Card className="p-4 bg-muted/30">
                    <p className="text-sm">{output}</p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStepIndex === 0} className="gap-2 bg-transparent">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {tutorial.steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index <= currentStepIndex ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <Button onClick={nextStep} disabled={!stepCompleted && currentStep.type !== "explanation"} className="gap-2">
          {currentStepIndex === tutorial.steps.length - 1 ? "Complete" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
