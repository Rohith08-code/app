import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Code, Trophy, User, HelpCircle } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CodeMaster Academy</h1>
          </Link>
          <Badge variant="secondary" className="ml-2">
            Learning Platform
          </Badge>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/tutorials">
            <Button variant="ghost" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Learn
            </Button>
          </Link>
          <Link href="/exercises">
            <Button variant="ghost" size="sm" className="gap-2">
              <Trophy className="w-4 h-4" />
              Practice
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            Help
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/tutorials">
            <Button size="sm">Begin Your Journey</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
