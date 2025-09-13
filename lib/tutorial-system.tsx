// Interactive tutorial system with step-by-step guidance

export interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  category: string
  prerequisites: string[]
  steps: TutorialStep[]
  completionReward: number
}

export interface TutorialStep {
  id: string
  title: string
  content: string
  type: "explanation" | "code" | "interactive" | "quiz"
  code?: string
  expectedOutput?: string
  hints: string[]
  validation?: (userCode: string) => ValidationResult
  nextStepCondition?: string
}

export interface ValidationResult {
  isValid: boolean
  message: string
  suggestions?: string[]
}

export interface TutorialProgress {
  tutorialId: string
  currentStep: number
  completedSteps: number[]
  startedAt: Date
  lastAccessedAt: Date
  completed: boolean
  score: number
}

export class TutorialEngine {
  static createJavaScriptBasicsTutorial(): Tutorial {
    return {
      id: "js-basics",
      title: "JavaScript Fundamentals",
      description: "Learn the core concepts of JavaScript programming through interactive examples",
      difficulty: "Beginner",
      estimatedTime: "45 minutes",
      category: "JavaScript",
      prerequisites: [],
      completionReward: 200,
      steps: [
        {
          id: "variables",
          title: "Variables and Data Types",
          content: `# Variables in JavaScript

Variables are containers that store data values. In JavaScript, you can declare variables using \`let\`, \`const\`, or \`var\`.

## Let's start with the basics:

- \`let\` - for variables that can change
- \`const\` - for constants that won't change
- \`var\` - older way (avoid in modern code)

Try creating a variable that stores your name:`,
          type: "code",
          code: `// Create a variable called 'name' and assign your name to it
// Then create another variable called 'age' with your age

`,
          expectedOutput: "Variables declared successfully",
          hints: [
            "Use 'let' or 'const' to declare variables",
            "Strings should be wrapped in quotes",
            "Numbers don't need quotes",
          ],
          validation: (code: string) => {
            const hasName = code.includes("name") && (code.includes("let") || code.includes("const"))
            const hasAge = code.includes("age") && (code.includes("let") || code.includes("const"))

            if (hasName && hasAge) {
              return { isValid: true, message: "Great! You've declared both variables correctly." }
            } else if (hasName) {
              return {
                isValid: false,
                message: "Good start! Now add an 'age' variable.",
                suggestions: ["Add: let age = 25;"],
              }
            } else {
              return {
                isValid: false,
                message: "Try declaring a 'name' variable first.",
                suggestions: ["Add: let name = 'Your Name';"],
              }
            }
          },
        },
        {
          id: "functions",
          title: "Creating Functions",
          content: `# Functions in JavaScript

Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.

## Function syntax:
\`\`\`javascript
function functionName(parameters) {
  // code to execute
  return result;
}
\`\`\`

Let's create a simple greeting function:`,
          type: "code",
          code: `// Create a function called 'greet' that takes a name parameter
// and returns a greeting message like "Hello, [name]!"

`,
          expectedOutput: "Hello, World!",
          hints: [
            "Use the 'function' keyword",
            "Don't forget the parentheses for parameters",
            "Use 'return' to send back a value",
            "Test your function by calling it",
          ],
          validation: (code: string) => {
            const hasFunction = code.includes("function greet")
            const hasParameter = code.includes("(") && code.includes(")")
            const hasReturn = code.includes("return")

            if (hasFunction && hasParameter && hasReturn) {
              return { isValid: true, message: "Excellent! Your function looks good." }
            } else {
              return {
                isValid: false,
                message: "Your function needs some work.",
                suggestions: [
                  "Make sure to use 'function greet(name)'",
                  "Include a return statement",
                  "Test by calling greet('World')",
                ],
              }
            }
          },
        },
        {
          id: "arrays",
          title: "Working with Arrays",
          content: `# Arrays in JavaScript

Arrays are ordered lists that can store multiple values. They're perfect for managing collections of data.

## Array basics:
- Create: \`let fruits = ['apple', 'banana', 'orange']\`
- Access: \`fruits[0]\` gets the first item
- Add: \`fruits.push('grape')\` adds to the end
- Length: \`fruits.length\` gets the count

Your turn to practice:`,
          type: "code",
          code: `// 1. Create an array called 'colors' with at least 3 color names
// 2. Add a new color using push()
// 3. Create a variable that stores the length of the array

`,
          expectedOutput: "Array operations completed",
          hints: [
            "Arrays use square brackets []",
            "Separate items with commas",
            "Use .push() to add items",
            "Use .length to get the size",
          ],
          validation: (code: string) => {
            const hasArray = code.includes("colors") && code.includes("[")
            const hasPush = code.includes(".push(")
            const hasLength = code.includes(".length")

            if (hasArray && hasPush && hasLength) {
              return { isValid: true, message: "Perfect! You've mastered array basics." }
            } else {
              return {
                isValid: false,
                message: "Keep working on the array operations.",
                suggestions: [
                  "Create: let colors = ['red', 'blue', 'green']",
                  "Add: colors.push('yellow')",
                  "Length: let count = colors.length",
                ],
              }
            }
          },
        },
        {
          id: "loops",
          title: "Loops and Iteration",
          content: `# Loops in JavaScript

Loops let you repeat code multiple times. They're essential for processing arrays and automating repetitive tasks.

## Common loop types:
- \`for\` loop: when you know how many times to repeat
- \`while\` loop: when you repeat based on a condition
- \`for...of\` loop: for iterating through arrays

Let's practice with a for loop:`,
          type: "code",
          code: `// Create a for loop that prints numbers from 1 to 5
// Use console.log() to display each number

`,
          expectedOutput: "1\n2\n3\n4\n5",
          hints: [
            "for (let i = 1; i <= 5; i++) { ... }",
            "Use console.log(i) inside the loop",
            "Don't forget the semicolons in the for statement",
          ],
          validation: (code: string) => {
            const hasForLoop = code.includes("for") && code.includes("(") && code.includes(")")
            const hasConsoleLog = code.includes("console.log")
            const hasIncrement = code.includes("++") || code.includes("i = i + 1")

            if (hasForLoop && hasConsoleLog && hasIncrement) {
              return { isValid: true, message: "Excellent loop! You've got the hang of it." }
            } else {
              return {
                isValid: false,
                message: "Your loop needs some adjustments.",
                suggestions: [
                  "Use: for (let i = 1; i <= 5; i++)",
                  "Add: console.log(i) inside the loop",
                  "Make sure to increment i with ++",
                ],
              }
            }
          },
        },
        {
          id: "quiz",
          title: "Knowledge Check",
          content: `# Quick Quiz

Let's test what you've learned! Answer these questions to complete the tutorial.

## Question 1: Which keyword is best for declaring a constant?
A) var
B) let  
C) const

## Question 2: How do you add an item to the end of an array?
A) array.add()
B) array.push()
C) array.append()

## Question 3: What does array.length return?
A) The last item in the array
B) The number of items in the array
C) The first item in the array`,
          type: "quiz",
          hints: [
            "Think about which keyword prevents reassignment",
            "Remember the array method we used earlier",
            "Length is about counting, not accessing items",
          ],
          validation: (answers: string) => {
            const correctAnswers = ["C", "B", "B"]
            const userAnswers = answers.split(",").map((a) => a.trim().toUpperCase())
            const correct = userAnswers.filter((answer, index) => answer === correctAnswers[index]).length

            if (correct === 3) {
              return { isValid: true, message: "Perfect score! You've mastered the basics." }
            } else {
              return {
                isValid: false,
                message: `You got ${correct}/3 correct. Review the concepts and try again.`,
                suggestions: [
                  "const is for constants that don't change",
                  "push() adds items to the end of arrays",
                  "length returns the count of items",
                ],
              }
            }
          },
        },
      ],
    }
  }

  static createReactBasicsTutorial(): Tutorial {
    return {
      id: "react-basics",
      title: "React Fundamentals",
      description: "Learn React components, JSX, and state management",
      difficulty: "Intermediate",
      estimatedTime: "60 minutes",
      category: "React",
      prerequisites: ["JavaScript Basics"],
      completionReward: 300,
      steps: [
        {
          id: "jsx",
          title: "JSX Syntax",
          content: `# JSX - JavaScript XML

JSX is a syntax extension for JavaScript that looks like HTML but is actually JavaScript. It's the foundation of React components.

## Key JSX rules:
- Must return a single parent element
- Use className instead of class
- Self-closing tags need the slash: \`<img />\`
- JavaScript expressions go in curly braces: \`{variable}\`

Let's create your first JSX element:`,
          type: "code",
          code: `// Create a JSX element that displays a welcome message
// Include your name in the message using a variable

const name = "Your Name";

// Your JSX here:

`,
          expectedOutput: "JSX element created",
          hints: [
            "JSX looks like HTML but is JavaScript",
            "Use {name} to include the variable",
            "Wrap in parentheses for multi-line JSX",
          ],
          validation: (code: string) => {
            const hasJSX = code.includes("<") && code.includes(">")
            const usesVariable = code.includes("{") && code.includes("name")

            if (hasJSX && usesVariable) {
              return { isValid: true, message: "Great JSX! You're getting the hang of it." }
            } else {
              return {
                isValid: false,
                message: "Your JSX needs some work.",
                suggestions: ["Try: <h1>Welcome, {name}!</h1>", "Remember to use curly braces for variables"],
              }
            }
          },
        },
      ],
    }
  }

  static getAllTutorials(): Tutorial[] {
    return [this.createJavaScriptBasicsTutorial(), this.createReactBasicsTutorial()]
  }
}

export class TutorialProgressTracker {
  private static progress: Map<string, TutorialProgress> = new Map()

  static startTutorial(tutorialId: string): TutorialProgress {
    const progress: TutorialProgress = {
      tutorialId,
      currentStep: 0,
      completedSteps: [],
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      completed: false,
      score: 0,
    }

    this.progress.set(tutorialId, progress)
    return progress
  }

  static updateProgress(tutorialId: string, stepIndex: number, score = 0): TutorialProgress {
    const progress = this.progress.get(tutorialId)
    if (!progress) {
      throw new Error(`Tutorial progress not found: ${tutorialId}`)
    }

    progress.currentStep = stepIndex
    if (!progress.completedSteps.includes(stepIndex)) {
      progress.completedSteps.push(stepIndex)
    }
    progress.lastAccessedAt = new Date()
    progress.score += score

    this.progress.set(tutorialId, progress)
    return progress
  }

  static completeTutorial(tutorialId: string): TutorialProgress {
    const progress = this.progress.get(tutorialId)
    if (!progress) {
      throw new Error(`Tutorial progress not found: ${tutorialId}`)
    }

    progress.completed = true
    progress.lastAccessedAt = new Date()

    this.progress.set(tutorialId, progress)
    return progress
  }

  static getProgress(tutorialId: string): TutorialProgress | null {
    return this.progress.get(tutorialId) || null
  }

  static getAllProgress(): TutorialProgress[] {
    return Array.from(this.progress.values())
  }
}
