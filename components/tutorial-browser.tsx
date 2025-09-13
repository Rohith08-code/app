"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TutorialEngine, TutorialProgressTracker, type Tutorial, type TutorialProgress } from "@/lib/tutorial-system"
import { BookOpen, Clock, Trophy, CheckCircle, Play } from "lucide-react"
import Link from "next/link"

export function TutorialBrowser() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [progress, setProgress] = useState<Map<string, TutorialProgress>>(new Map())

  useEffect(() => {
    const allTutorials = TutorialEngine.getAllTutorials()
    setTutorials(allTutorials)

    // Load progress for each tutorial
    const progressMap = new Map<string, TutorialProgress>()
    allTutorials.forEach((tutorial) => {
      const tutorialProgress = TutorialProgressTracker.getProgress(tutorial.id)
      if (tutorialProgress) {
        progressMap.set(tutorial.id, tutorialProgress)
      }
    })
    setProgress(progressMap)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Interactive Tutorials</h1>
        <p className="text-muted-foreground">Learn programming step-by-step with hands-on guidance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => {
          const tutorialProgress = progress.get(tutorial.id)
          const completionPercentage = tutorialProgress
            ? (tutorialProgress.completedSteps.length / tutorial.steps.length) * 100
            : 0

          return (
            <Card key={tutorial.id} className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg line-clamp-2">{tutorial.title}</h3>
                  {tutorialProgress?.completed && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{tutorial.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`text-xs ${getDifficultyColor(tutorial.difficulty)}`}>{tutorial.difficulty}</Badge>
                <Badge variant="outline" className="text-xs">
                  {tutorial.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {tutorial.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Trophy className="w-3 h-3" />
                    {tutorial.completionReward} pts
                  </div>
                </div>

                {tutorialProgress && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-muted-foreground">{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  {tutorial.steps.length} steps •{" "}
                  {tutorial.prerequisites.length > 0
                    ? `Requires: ${tutorial.prerequisites.join(", ")}`
                    : "No prerequisites"}
                </div>

                <Link href={`/tutorial/${tutorial.id}`}>
                  <Button className="w-full gap-2">
                    {tutorialProgress?.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Review Tutorial
                      </>
                    ) : tutorialProgress ? (
                      <>
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        Start Tutorial
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
