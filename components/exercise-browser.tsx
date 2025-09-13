"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExerciseGenerator, type Exercise } from "@/lib/exercise-generator"
import { Search, Shuffle, Clock, Trophy, Target } from "lucide-react"

export function ExerciseBrowser() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    // Generate initial set of exercises
    const initialExercises = ExerciseGenerator.generateExerciseSet(12)
    setExercises(initialExercises)
    setFilteredExercises(initialExercises)
  }, [])

  useEffect(() => {
    // Filter exercises based on search and filters
    let filtered = exercises

    if (searchTerm) {
      filtered = filtered.filter(
        (exercise) =>
          exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((exercise) => exercise.difficulty === difficultyFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((exercise) => exercise.category === categoryFilter)
    }

    setFilteredExercises(filtered)
  }, [exercises, searchTerm, difficultyFilter, categoryFilter])

  const generateNewExercises = () => {
    const newExercises = ExerciseGenerator.generateExerciseSet(6)
    setExercises((prev) => [...prev, ...newExercises])
  }

  const categories = Array.from(new Set(exercises.map((ex) => ex.category)))

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={generateNewExercises} className="gap-2 bg-transparent">
          <Shuffle className="w-4 h-4" />
          Generate More
        </Button>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onSelect={() => setSelectedExercise(exercise)}
            isSelected={selectedExercise?.id === exercise.id}
          />
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No exercises found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setDifficultyFilter("all")
              setCategoryFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

interface ExerciseCardProps {
  exercise: Exercise
  onSelect: () => void
  isSelected: boolean
}

function ExerciseCard({ exercise, onSelect, isSelected }: ExerciseCardProps) {
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
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onSelect}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm line-clamp-2">{exercise.title}</h3>
          <Badge className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}>{exercise.difficulty}</Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {exercise.timeEstimate}
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {exercise.points} pts
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {exercise.category}
          </Badge>
          <span className="text-xs text-muted-foreground">{exercise.testCases.length} tests</span>
        </div>

        <Button size="sm" className="w-full">
          Start Exercise
        </Button>
      </div>
    </Card>
  )
}
