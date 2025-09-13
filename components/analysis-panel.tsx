"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeAnalyzer, DebuggingAssistant, type AnalysisResult } from "@/lib/code-analyzer"
import { AlertTriangle, CheckCircle, Lightbulb, TrendingUp, Bug, Zap, BarChart3, Target } from "lucide-react"

interface AnalysisPanelProps {
  code?: string
}

export function AnalysisPanel({ code = "" }: AnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (code.trim()) {
      analyzeCode(code)
    }
  }, [code])

  const analyzeCode = async (codeToAnalyze: string) => {
    setIsAnalyzing(true)
    try {
      // Simulate analysis delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const result = CodeAnalyzer.analyzeJavaScript(codeToAnalyze)
      setAnalysis(result)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!analysis && !isAnalyzing) {
    return (
      <div className="flex-1 border-b border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Code Analysis</h2>
        </div>
        <div className="p-4 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Write some code to see analysis results</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 border-b border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Code Analysis</h2>
          {analysis && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Score:</span>
              <Badge variant={analysis.score >= 80 ? "default" : analysis.score >= 60 ? "secondary" : "destructive"}>
                {analysis.score}/100
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Analyzing code...</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        ) : analysis ? (
          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="issues" className="text-xs">
                Issues
                {analysis.errors.length + analysis.warnings.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {analysis.errors.length + analysis.warnings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="text-xs">
                Tips
                {analysis.suggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {analysis.suggestions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs">
                Metrics
              </TabsTrigger>
              <TabsTrigger value="debug" className="text-xs">
                Debug
              </TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-3 mt-4">
              {analysis.errors.length === 0 && analysis.warnings.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No issues found!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {analysis.errors.map((error) => (
                    <Card key={error.id} className="p-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle
                          className={`w-4 h-4 mt-0.5 ${
                            error.severity === "error" ? "text-red-500" : "text-yellow-500"
                          }`}
                        />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{error.message}</p>
                          <p className="text-xs text-muted-foreground">
                            Line {error.line}, Column {error.column}
                          </p>
                          {error.fix && <p className="text-xs text-blue-600 dark:text-blue-400">Fix: {error.fix}</p>}
                        </div>
                        <Badge variant={error.severity === "error" ? "destructive" : "secondary"} className="text-xs">
                          {error.severity}
                        </Badge>
                      </div>
                    </Card>
                  ))}

                  {analysis.warnings.map((warning) => (
                    <Card key={warning.id} className="p-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-500" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{warning.message}</p>
                          <p className="text-xs text-muted-foreground">Line {warning.line}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">{warning.suggestion}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {warning.type}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-3 mt-4">
              {analysis.suggestions.length === 0 ? (
                <div className="text-center py-6">
                  <Lightbulb className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No suggestions at this time</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="p-3">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-500" />
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium">{suggestion.message}</p>
                          <div className="space-y-1">
                            <div className="text-xs">
                              <span className="text-muted-foreground">Before: </span>
                              <code className="bg-muted px-1 py-0.5 rounded text-red-600">{suggestion.before}</code>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">After: </span>
                              <code className="bg-muted px-1 py-0.5 rounded text-green-600">{suggestion.after}</code>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{suggestion.explanation}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Readability"
                  value={analysis.metrics.readability}
                  icon={<Target className="w-4 h-4" />}
                />
                <MetricCard
                  title="Performance"
                  value={analysis.metrics.performance}
                  icon={<Zap className="w-4 h-4" />}
                />
                <MetricCard
                  title="Maintainability"
                  value={analysis.metrics.maintainability}
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                <MetricCard
                  title="Complexity"
                  value={Math.max(0, 100 - analysis.metrics.complexity * 10)}
                  icon={<BarChart3 className="w-4 h-4" />}
                />
              </div>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Code Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Lines of Code:</span>
                    <span className="ml-2 font-medium">{analysis.metrics.linesOfCode}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Functions:</span>
                    <span className="ml-2 font-medium">{analysis.metrics.functions}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Variables:</span>
                    <span className="ml-2 font-medium">{analysis.metrics.variables}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Complexity:</span>
                    <span className="ml-2 font-medium">{analysis.metrics.complexity}</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="debug" className="space-y-3 mt-4">
              <DebuggingHelp code={code} />
            </TabsContent>
          </Tabs>
        ) : null}
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  icon: React.ReactNode
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className={`text-sm font-bold ${getColor(value)}`}>{Math.round(value)}</span>
      </div>
      <Progress value={value} className="h-2" />
    </Card>
  )
}

function DebuggingHelp({ code }: { code: string }) {
  const suggestions = DebuggingAssistant.generateDebuggingSuggestions(code)
  const testCases = DebuggingAssistant.generateTestCases(code)

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bug className="w-4 h-4" />
          <h4 className="font-medium">Debugging Tips</h4>
        </div>
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <p className="text-sm text-muted-foreground">{suggestion}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4" />
          <h4 className="font-medium">Suggested Test Cases</h4>
        </div>
        <div className="space-y-2">
          {testCases.slice(0, 3).map((testCase, index) => (
            <div key={index} className="text-sm">
              <code className="bg-muted px-2 py-1 rounded text-xs">{JSON.stringify(testCase.input)}</code>
              <p className="text-muted-foreground mt-1">{testCase.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
