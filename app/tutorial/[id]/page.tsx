import { InteractiveTutorial } from "@/components/interactive-tutorial"
import { Header } from "@/components/header"

interface TutorialPageProps {
  params: {
    id: string
  }
}

export default function TutorialPage({ params }: TutorialPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <InteractiveTutorial tutorialId={params.id} />
    </div>
  )
}
