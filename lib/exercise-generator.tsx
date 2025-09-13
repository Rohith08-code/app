// Exercise generation and management utilities

export interface Exercise {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  timeEstimate: string
  points: number
  requirements: string[]
  hints: string[]
  testCases: TestCase[]
  starterCode?: string
  solution?: string
}

export interface TestCase {
  input: any
  expected: any
  description?: string
}

export interface ExerciseTemplate {
  type: string
  generateExercise: (params?: any) => Exercise
}

// Exercise templates for automatic generation
export const exerciseTemplates: Record<string, ExerciseTemplate> = {
  function_creation: {
    type: "Function Creation",
    generateExercise: (params = {}) => {
      const functionNames = ["calculateSum", "findMax", "reverseString", "isPalindrome", "factorial"]
      const functionName = params.functionName || functionNames[Math.floor(Math.random() * functionNames.length)]

      return {
        id: `func_${Date.now()}`,
        title: `Create ${functionName} Function`,
        description: `Write a function called ${functionName} that performs the specified operation.`,
        difficulty: "Beginner",
        category: "Functions",
        timeEstimate: "10 min",
        points: 75,
        requirements: [
          `Function must be named '${functionName}'`,
          "Function should handle edge cases",
          "Return the correct data type",
          "Include proper error handling",
        ],
        hints: [
          "Consider what happens with invalid inputs",
          "Test your function with different values",
          "Use descriptive variable names",
        ],
        testCases: [
          { input: [1, 2, 3], expected: 6, description: "Basic case" },
          { input: [], expected: 0, description: "Empty array" },
          { input: [-1, -2, -3], expected: -6, description: "Negative numbers" },
        ],
        starterCode: `function ${functionName}() {
  // Your code here
}`,
      }
    },
  },

  array_manipulation: {
    type: "Array Manipulation",
    generateExercise: () => ({
      id: `array_${Date.now()}`,
      title: "Array Filter and Transform",
      description: "Create a function that filters and transforms array data based on given criteria.",
      difficulty: "Intermediate",
      category: "Arrays",
      timeEstimate: "15 min",
      points: 100,
      requirements: [
        "Filter array based on condition",
        "Transform filtered results",
        "Return new array without modifying original",
        "Handle empty arrays gracefully",
      ],
      hints: [
        "Use array methods like filter() and map()",
        "Chain array methods for cleaner code",
        "Consider using arrow functions",
      ],
      testCases: [
        { input: [1, 2, 3, 4, 5], expected: [4, 16], description: "Filter even, square them" },
        { input: [], expected: [], description: "Empty array" },
        { input: [1, 3, 5], expected: [], description: "No even numbers" },
      ],
      starterCode: `function filterAndTransform(arr) {
  // Your code here
}`,
    }),
  },

  dom_manipulation: {
    type: "DOM Manipulation",
    generateExercise: () => ({
      id: `dom_${Date.now()}`,
      title: "Interactive Button Counter",
      description: "Create an interactive counter that updates when buttons are clicked.",
      difficulty: "Intermediate",
      category: "DOM",
      timeEstimate: "20 min",
      points: 125,
      requirements: [
        "Create increment and decrement buttons",
        "Display current count value",
        "Update display when buttons are clicked",
        "Prevent count from going below zero",
      ],
      hints: [
        "Use addEventListener for button clicks",
        "Store count in a variable",
        "Update DOM element's textContent or innerHTML",
      ],
      testCases: [
        { input: "click increment 3 times", expected: "3", description: "Increment functionality" },
        { input: "click decrement from 0", expected: "0", description: "Prevent negative values" },
      ],
      starterCode: `// HTML structure provided
// <button id="increment">+</button>
// <span id="counter">0</span>
// <button id="decrement">-</button>

let count = 0;

// Your code here`,
    }),
  },
}

export class ExerciseGenerator {
  static generateRandomExercise(): Exercise {
    const templates = Object.values(exerciseTemplates)
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    return randomTemplate.generateExercise()
  }

  static generateExerciseByType(type: string, params?: any): Exercise {
    const template = exerciseTemplates[type]
    if (!template) {
      throw new Error(`Exercise template '${type}' not found`)
    }
    return template.generateExercise(params)
  }

  static generateExerciseSet(count: number, difficulty?: string): Exercise[] {
    const exercises: Exercise[] = []
    for (let i = 0; i < count; i++) {
      const exercise = this.generateRandomExercise()
      if (difficulty) {
        exercise.difficulty = difficulty as any
      }
      exercises.push(exercise)
    }
    return exercises
  }
}

// Exercise validation and testing
export class ExerciseValidator {
  static validateSolution(
    exercise: Exercise,
    userCode: string,
  ): {
    passed: boolean
    results: TestResult[]
    score: number
  } {
    const results: TestResult[] = []
    let passedTests = 0

    try {
      // In a real implementation, this would run in a sandboxed environment
      for (const testCase of exercise.testCases) {
        try {
          // This is a simplified validation - in production, use a proper code execution sandbox
          const result = this.executeTest(userCode, testCase)
          const passed = JSON.stringify(result) === JSON.stringify(testCase.expected)

          results.push({
            testCase,
            result,
            passed,
            error: null,
          })

          if (passed) passedTests++
        } catch (error) {
          results.push({
            testCase,
            result: null,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }
    } catch (error) {
      // Code compilation/syntax error
      results.push({
        testCase: { input: "compilation", expected: "success" },
        result: null,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
      })
    }

    const score = Math.round((passedTests / exercise.testCases.length) * exercise.points)

    return {
      passed: passedTests === exercise.testCases.length,
      results,
      score,
    }
  }

  private static executeTest(userCode: string, testCase: TestCase): any {
    // This is a simplified test execution
    // In production, use a proper sandboxed environment like Web Workers or iframe
    try {
      const func = new Function(
        "input",
        `
        ${userCode}
        
        // Try to find and execute the main function
        const functionNames = Object.getOwnPropertyNames(this).filter(name => 
          typeof this[name] === 'function' && !name.startsWith('_')
        );
        
        if (functionNames.length > 0) {
          return this[functionNames[0]](input);
        }
        
        throw new Error('No function found to test');
      `,
      )

      return func.call({}, testCase.input)
    } catch (error) {
      throw error
    }
  }
}

export interface TestResult {
  testCase: TestCase
  result: any
  passed: boolean
  error: string | null
}
