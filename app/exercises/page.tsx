import { ExerciseBrowser } from "@/components/exercise-browser"
import { Header } from "@/components/header"

export default function ExercisesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Practice Exercises</h1>
          <p className="text-muted-foreground">Sharpen your coding skills with our automatically generated exercises</p>
        </div>
        <ExerciseBrowser />
      </div>
    </div>
  )
}
