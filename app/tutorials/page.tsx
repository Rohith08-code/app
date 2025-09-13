import { TutorialBrowser } from "@/components/tutorial-browser"
import { Header } from "@/components/header"

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <TutorialBrowser />
      </div>
    </div>
  )
}
