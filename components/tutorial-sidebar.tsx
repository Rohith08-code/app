"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, CheckCircle, Circle, Play, BookOpen, Star } from "lucide-react"

const tutorials = [
  {
    id: 1,
    title: "Programming Fundamentals",
    description: "Master the building blocks of programming",
    lessons: [
      { id: 1, title: "Understanding Variables", completed: true, duration: "10 min" },
      { id: 2, title: "Working with Functions", completed: true, duration: "15 min" },
      { id: 3, title: "Arrays and Objects Made Simple", completed: false, current: true, duration: "20 min" },
      { id: 4, title: "Making Decisions with Code", completed: false, duration: "18 min" },
    ],
    progress: 50,
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Building Interactive Websites",
    description: "Create dynamic web applications with React",
    lessons: [
      { id: 1, title: "Your First React Component", completed: false, duration: "25 min" },
      { id: 2, title: "Passing Data Between Components", completed: false, duration: "30 min" },
      { id: 3, title: "Handling User Interactions", completed: false, duration: "35 min" },
    ],
    progress: 0,
    difficulty: "Intermediate",
  },
]

export function TutorialSidebar() {
  const [selectedTutorial, setSelectedTutorial] = useState(1)
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <div className="w-12 border-r border-border bg-sidebar">
        <Button variant="ghost" size="sm" className="w-full h-12" onClick={() => setCollapsed(false)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 border-r border-border bg-sidebar">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-sidebar-foreground">Your Learning Journey</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(true)}>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Follow the path to master programming step by step</p>
      </div>

      <div className="p-4 space-y-4">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="p-4 hover:shadow-sm transition-shadow">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-foreground">{tutorial.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tutorial.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={tutorial.difficulty === "Beginner" ? "outline" : "outline"}
                      className="text-xs text-foreground bg-background"
                    >
                      {tutorial.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {tutorial.lessons.filter((l) => l.completed).length}/{tutorial.lessons.length} complete
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Progress</span>
                    <span className="text-xs text-muted-foreground">{tutorial.progress}%</span>
                  </div>
                  <Progress value={tutorial.progress} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                {tutorial.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 ${
                      lesson.current ? "bg-primary/10 border border-primary/20 shadow-sm" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : lesson.current ? (
                        <Play className="w-4 h-4 text-primary" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm block ${
                          lesson.current ? "text-foreground font-semibold" : "text-foreground"
                        }`}
                      >
                        {lesson.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    </div>
                    {lesson.current && <Star className="w-3 h-3 text-primary flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-medium text-sm">Keep Going!</h3>
            <p className="text-xs text-muted-foreground">
              You're making great progress. Every lesson brings you closer to becoming a skilled programmer.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
