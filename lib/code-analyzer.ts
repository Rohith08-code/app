// Code analysis engine for error detection, suggestions, and quality metrics

export interface AnalysisResult {
  errors: CodeError[]
  warnings: CodeWarning[]
  suggestions: CodeSuggestion[]
  metrics: CodeMetrics
  score: number
}

export interface CodeError {
  id: string
  type: "syntax" | "runtime" | "logic"
  message: string
  line: number
  column: number
  severity: "error" | "warning" | "info"
  fix?: string
}

export interface CodeWarning {
  id: string
  type: "style" | "performance" | "best-practice"
  message: string
  line: number
  column: number
  suggestion: string
}

export interface CodeSuggestion {
  id: string
  type: "improvement" | "optimization" | "refactor"
  message: string
  line?: number
  before: string
  after: string
  explanation: string
}

export interface CodeMetrics {
  complexity: number
  readability: number
  maintainability: number
  performance: number
  testCoverage: number
  linesOfCode: number
  functions: number
  variables: number
}

export class CodeAnalyzer {
  static analyzeJavaScript(code: string): AnalysisResult {
    const errors: CodeError[] = []
    const warnings: CodeWarning[] = []
    const suggestions: CodeSuggestion[] = []

    // Basic syntax analysis
    const syntaxErrors = this.checkSyntax(code)
    errors.push(...syntaxErrors)

    // Style and best practices
    const styleWarnings = this.checkStyle(code)
    warnings.push(...styleWarnings)

    // Performance suggestions
    const performanceSuggestions = this.checkPerformance(code)
    suggestions.push(...performanceSuggestions)

    // Calculate metrics
    const metrics = this.calculateMetrics(code)

    // Calculate overall score
    const score = this.calculateScore(errors, warnings, suggestions, metrics)

    return {
      errors,
      warnings,
      suggestions,
      metrics,
      score,
    }
  }

  private static checkSyntax(code: string): CodeError[] {
    const errors: CodeError[] = []
    const lines = code.split("\n")

    lines.forEach((line, index) => {
      const lineNum = index + 1

      // Check for common syntax errors
      if (line.includes("function") && !line.includes("(")) {
        errors.push({
          id: `syntax_${lineNum}_1`,
          type: "syntax",
          message: "Function declaration missing parentheses",
          line: lineNum,
          column: line.indexOf("function"),
          severity: "error",
          fix: "Add parentheses after function name: function name()",
        })
      }

      // Check for missing semicolons (simplified)
      if (line.trim().match(/^(let|const|var|return)\s+.*[^;{}\s]$/)) {
        errors.push({
          id: `syntax_${lineNum}_2`,
          type: "syntax",
          message: "Missing semicolon",
          line: lineNum,
          column: line.length,
          severity: "warning",
          fix: "Add semicolon at the end of the statement",
        })
      }

      // Check for unmatched brackets
      const openBrackets = (line.match(/\{/g) || []).length
      const closeBrackets = (line.match(/\}/g) || []).length
      if (openBrackets !== closeBrackets && line.trim() !== "") {
        errors.push({
          id: `syntax_${lineNum}_3`,
          type: "syntax",
          message: "Unmatched brackets",
          line: lineNum,
          column: 0,
          severity: "error",
          fix: "Check bracket matching",
        })
      }
    })

    return errors
  }

  private static checkStyle(code: string): CodeWarning[] {
    const warnings: CodeWarning[] = []
    const lines = code.split("\n")

    lines.forEach((line, index) => {
      const lineNum = index + 1

      // Check for var usage (prefer let/const)
      if (line.includes("var ")) {
        warnings.push({
          id: `style_${lineNum}_1`,
          type: "best-practice",
          message: "Use 'let' or 'const' instead of 'var'",
          line: lineNum,
          column: line.indexOf("var"),
          suggestion: "Replace 'var' with 'let' for mutable variables or 'const' for constants",
        })
      }

      // Check for console.log in production code
      if (line.includes("console.log")) {
        warnings.push({
          id: `style_${lineNum}_2`,
          type: "best-practice",
          message: "Remove console.log statements from production code",
          line: lineNum,
          column: line.indexOf("console.log"),
          suggestion: "Use proper logging or remove debug statements",
        })
      }

      // Check for long lines
      if (line.length > 100) {
        warnings.push({
          id: `style_${lineNum}_3`,
          type: "style",
          message: "Line too long (>100 characters)",
          line: lineNum,
          column: 100,
          suggestion: "Break long lines for better readability",
        })
      }

      // Check for magic numbers
      const magicNumbers = line.match(/\b\d{2,}\b/g)
      if (magicNumbers) {
        warnings.push({
          id: `style_${lineNum}_4`,
          type: "best-practice",
          message: "Consider using named constants for magic numbers",
          line: lineNum,
          column: line.indexOf(magicNumbers[0]),
          suggestion: "Define constants with meaningful names",
        })
      }
    })

    return warnings
  }

  private static checkPerformance(code: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = []

    // Check for inefficient loops
    if (code.includes("for") && code.includes(".length")) {
      suggestions.push({
        id: "perf_1",
        type: "optimization",
        message: "Cache array length in loops",
        before: "for (let i = 0; i < array.length; i++)",
        after: "for (let i = 0, len = array.length; i < len; i++)",
        explanation: "Caching array length prevents repeated property access",
      })
    }

    // Check for string concatenation in loops
    if (code.includes("for") && code.includes("+=") && code.includes('"')) {
      suggestions.push({
        id: "perf_2",
        type: "optimization",
        message: "Use array join for string concatenation in loops",
        before: 'str += "text"',
        after: 'array.push("text"); // then array.join("")',
        explanation: "Array join is more efficient than repeated string concatenation",
      })
    }

    // Suggest modern array methods
    if (code.includes("for") && (code.includes("push") || code.includes("if"))) {
      suggestions.push({
        id: "perf_3",
        type: "improvement",
        message: "Consider using array methods like map, filter, reduce",
        before: "for loop with conditional logic",
        after: "array.filter().map()",
        explanation: "Array methods are more readable and often more performant",
      })
    }

    return suggestions
  }

  private static calculateMetrics(code: string): CodeMetrics {
    const lines = code.split("\n").filter((line) => line.trim() !== "")
    const linesOfCode = lines.length

    // Count functions
    const functions =
      (code.match(/function\s+\w+/g) || []).length +
      (code.match(/\w+\s*=\s*function/g) || []).length +
      (code.match(/\w+\s*=>\s*/g) || []).length

    // Count variables
    const variables = (code.match(/(let|const|var)\s+\w+/g) || []).length

    // Calculate complexity (simplified cyclomatic complexity)
    const complexity = this.calculateComplexity(code)

    // Calculate readability score (0-100)
    const readability = this.calculateReadability(code, lines)

    // Calculate maintainability (0-100)
    const maintainability = Math.max(0, 100 - complexity * 2 - (linesOfCode > 50 ? 10 : 0))

    // Performance score (0-100)
    const performance = this.calculatePerformanceScore(code)

    return {
      complexity,
      readability,
      maintainability,
      performance,
      testCoverage: 0, // Would need actual test analysis
      linesOfCode,
      functions,
      variables,
    }
  }

  private static calculateComplexity(code: string): number {
    // Simplified cyclomatic complexity
    let complexity = 1 // Base complexity

    // Add complexity for control structures
    complexity += (code.match(/if\s*\(/g) || []).length
    complexity += (code.match(/else/g) || []).length
    complexity += (code.match(/for\s*\(/g) || []).length
    complexity += (code.match(/while\s*\(/g) || []).length
    complexity += (code.match(/switch\s*\(/g) || []).length
    complexity += (code.match(/case\s+/g) || []).length
    complexity += (code.match(/catch\s*\(/g) || []).length
    complexity += (code.match(/&&|\|\|/g) || []).length

    return complexity
  }

  private static calculateReadability(code: string, lines: string[]): number {
    let score = 100

    // Penalize long lines
    const longLines = lines.filter((line) => line.length > 80).length
    score -= longLines * 2

    // Penalize lack of comments
    const commentLines = lines.filter((line) => line.trim().startsWith("//")).length
    const commentRatio = commentLines / lines.length
    if (commentRatio < 0.1) score -= 10

    // Penalize deeply nested code
    const maxIndentation = Math.max(
      ...lines.map((line) => {
        const match = line.match(/^(\s*)/)
        return match ? match[1].length : 0
      }),
    )
    if (maxIndentation > 12) score -= (maxIndentation - 12) * 2

    // Reward consistent naming
    const camelCaseVars = (code.match(/[a-z][a-zA-Z0-9]*/g) || []).length
    const totalVars = (code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || []).length
    const namingConsistency = totalVars > 0 ? camelCaseVars / totalVars : 1
    score += namingConsistency * 10

    return Math.max(0, Math.min(100, score))
  }

  private static calculatePerformanceScore(code: string): number {
    let score = 100

    // Penalize inefficient patterns
    if (code.includes("for") && code.includes(".length")) score -= 5
    if (code.includes("+=") && code.includes('"')) score -= 10
    if (code.includes("eval(")) score -= 20
    if (code.includes("with(")) score -= 15

    // Reward good patterns
    if (code.includes(".map(") || code.includes(".filter(") || code.includes(".reduce(")) {
      score += 5
    }
    if (code.includes("const ")) score += 2

    return Math.max(0, Math.min(100, score))
  }

  private static calculateScore(
    errors: CodeError[],
    warnings: CodeWarning[],
    suggestions: CodeSuggestion[],
    metrics: CodeMetrics,
  ): number {
    let score = 100

    // Deduct for errors and warnings
    score -= errors.filter((e) => e.severity === "error").length * 10
    score -= errors.filter((e) => e.severity === "warning").length * 5
    score -= warnings.length * 2

    // Factor in metrics
    score = (score + metrics.readability + metrics.maintainability + metrics.performance) / 4

    return Math.max(0, Math.min(100, Math.round(score)))
  }
}

// Debugging suggestions generator
export class DebuggingAssistant {
  static generateDebuggingSuggestions(code: string, error?: string): string[] {
    const suggestions: string[] = []

    if (error) {
      // Error-specific suggestions
      if (error.includes("undefined")) {
        suggestions.push("Check if variables are properly declared and initialized")
        suggestions.push("Use console.log to trace variable values")
        suggestions.push("Verify object properties exist before accessing them")
      }

      if (error.includes("syntax")) {
        suggestions.push("Check for missing brackets, parentheses, or semicolons")
        suggestions.push("Verify proper function declaration syntax")
        suggestions.push("Look for unmatched quotes or brackets")
      }

      if (error.includes("function")) {
        suggestions.push("Ensure the function is defined before calling it")
        suggestions.push("Check function parameter count and types")
        suggestions.push("Verify function scope and accessibility")
      }
    }

    // General debugging suggestions
    suggestions.push("Add console.log statements to trace execution flow")
    suggestions.push("Use browser developer tools to set breakpoints")
    suggestions.push("Check the browser console for additional error details")
    suggestions.push("Verify input data types and formats")
    suggestions.push("Test with simpler input values first")

    return suggestions
  }

  static generateTestCases(code: string): Array<{ input: any; description: string }> {
    const testCases: Array<{ input: any; description: string }> = []

    // Analyze code to suggest relevant test cases
    if (code.includes("function")) {
      testCases.push(
        { input: null, description: "Test with null input" },
        { input: undefined, description: "Test with undefined input" },
        { input: "", description: "Test with empty string" },
        { input: 0, description: "Test with zero value" },
        { input: [], description: "Test with empty array" },
      )
    }

    if (code.includes("array") || code.includes("[")) {
      testCases.push(
        { input: [1, 2, 3], description: "Test with normal array" },
        { input: [1], description: "Test with single element" },
        { input: [], description: "Test with empty array" },
      )
    }

    if (code.includes("string") || code.includes('"')) {
      testCases.push(
        { input: "hello", description: "Test with normal string" },
        { input: "", description: "Test with empty string" },
        { input: "a", description: "Test with single character" },
      )
    }

    return testCases
  }
}
