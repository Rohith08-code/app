"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Target, Trophy, Lightbulb, HelpCircle, Zap } from "lucide-react"

const currentExercise = {
  id: 1,
  title: "Build Your First Greeting Function",
  difficulty: "Beginner Friendly",
  timeEstimate: "5-8 minutes",
  description:
    "Let's create a friendly function that greets people by name. This exercise will help you understand how functions work and how to handle different types of input.",
  learningGoals: [
    "Understand how to create functions in JavaScript",
    "Learn to work with function parameters",
    "Practice string formatting with template literals",
    "Handle edge cases gracefully",
  ],
  requirements: [
    "Create a function named 'createGreeting'",
    "The function should accept one parameter called 'name'",
    "Return a greeting message: 'Hello, [name]! Welcome to CodeMaster Academy!'",
    "If no name is provided, use 'Guest' as the default",
  ],
  hints: [
    "💡 Use template literals (backticks) to easily insert variables into strings",
    "💡 Check if the name exists using: if (!name || name.trim() === '')",
    "💡 You can provide a default value: name = name || 'Guest'",
  ],
  testCases: [
    { input: "Alice", expected: "Hello, Alice! Welcome to CodeMaster Academy!" },
    { input: "", expected: "Hello, Guest! Welcome to CodeMaster Academy!" },
    { input: undefined, expected: "Hello, Guest! Welcome to CodeMaster Academy!" },
  ],
  points: 50,
}

export function ExercisePanel() {
  const [showHints, setShowHints] = useState(false)
  const [completedRequirements, setCompletedRequirements] = useState<number[]>([])

  const toggleRequirement = (index: number) => {
    setCompletedRequirements((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const progress = (completedRequirements.length / currentExercise.requirements.length) * 100

  return (
    <div className="flex-1 border-b border-border">
      <div className="p-4 border-b border-border bg-card/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Practice Challenge</h2>
          </div>
          <Badge variant="outline" className="gap-1">
            <Trophy className="w-3 h-3" />
            {currentExercise.points} points
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Apply what you've learned with hands-on coding</p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">{currentExercise.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{currentExercise.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="gap-1 text-foreground bg-background">
              <Zap className="w-3 h-3" />
              {currentExercise.difficulty}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {currentExercise.timeEstimate}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedRequirements.length}/{currentExercise.requirements.length} completed
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            {progress === 100 && (
              <p className="text-xs text-emerald-600 font-medium">🎉 All requirements completed! Ready to submit.</p>
            )}
          </div>
        </div>

        <Tabs defaultValue="requirements" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requirements" className="text-xs">
              What to Do
            </TabsTrigger>
            <TabsTrigger value="hints" className="text-xs">
              Need Help?
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs">
              Test Cases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="space-y-3">
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Learning Goals:</h4>
              <div className="space-y-1">
                {currentExercise.learningGoals.map((goal, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            <h4 className="text-sm font-medium">Requirements Checklist:</h4>
            {currentExercise.requirements.map((req, index) => (
              <Card key={index} className="p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleRequirement(index)} className="mt-0.5">
                    {completedRequirements.includes(index) ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-muted-foreground rounded-full hover:border-primary transition-colors" />
                    )}
                  </button>
                  <span
                    className={`text-sm leading-relaxed ${
                      completedRequirements.includes(index) ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {req}
                  </span>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="hints" className="space-y-3">
            {!showHints ? (
              <Card className="p-4 text-center">
                <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-1">Stuck? That's Normal!</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Every programmer gets stuck sometimes. Click below for some friendly hints to guide you.
                </p>
                <Button variant="outline" size="sm" onClick={() => setShowHints(true)}>
                  Show Helpful Hints
                </Button>
              </Card>
            ) : (
              <>
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-emerald-600 mb-1">💡 Helpful Hints</h4>
                  <p className="text-xs text-muted-foreground">
                    These hints will guide you step by step. Take your time and don't worry about getting it perfect!
                  </p>
                </div>
                {currentExercise.hints.map((hint, index) => (
                  <Card key={index} className="p-3 bg-emerald-50/50 border-emerald-200/50">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground leading-relaxed">{hint}</span>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="tests" className="space-y-3">
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1">Test Your Solution</h4>
              <p className="text-xs text-muted-foreground">
                Your function will be tested with these inputs. Make sure it handles all cases correctly.
              </p>
            </div>
            {currentExercise.testCases.map((test, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Test Case {index + 1}</span>
                  </div>
                  <div className="text-sm space-y-1 pl-6">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground min-w-[60px]">Input:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {test.input === undefined ? "undefined" : `"${test.input}"`}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground min-w-[60px]">Expected:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">"{test.expected}"</code>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Button className="w-full" size="sm" disabled={progress < 100}>
            {progress < 100 ? "Complete Requirements First" : "Submit Your Solution"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Don't worry if it's not perfect - you can always try again!
          </p>
        </div>
      </div>
    </div>
  )
}
