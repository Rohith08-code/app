"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Play, BookOpen, Target, Lightbulb } from "lucide-react"

interface WelcomeGuideProps {
  onClose: () => void
}

export function WelcomeGuide({ onClose }: WelcomeGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button variant="ghost" size="sm" className="absolute right-2 top-2" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl">Welcome to CodeMaster Academy</CardTitle>
          <CardDescription>
            Your journey to becoming a skilled programmer starts here. Let's get you oriented!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Step-by-Step Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Follow our structured tutorials on the left sidebar. Each lesson builds on the previous one.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Play className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Interactive Code Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Write code in the center panel and see results immediately. No setup required!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Practice Exercises</h3>
                <p className="text-sm text-muted-foreground">
                  Complete coding challenges in the right panel to reinforce your learning.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Smart Code Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant feedback, error detection, and improvement suggestions as you code.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Beginner Tip</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Don't worry if you make mistakes - that's part of learning! Our system will help you understand and fix
              errors. Take your time and experiment with the code.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Skip Tour
            </Button>
            <Button onClick={onClose}>Start Learning</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
