import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { OptimizeAPI } from '../lib/api'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Play, CheckCircle2, Clock, TrendingUp, ArrowRight } from 'lucide-react'

export function Run() {
  const { state } = useLocation() as any
  const datasetId: number = state?.datasetId
  const configId: number = state?.configId
  const [status, setStatus] = useState<'ready' | 'running' | 'done'>('ready')
  const [result, setResult] = useState<any | null>(null)
  const [progress, setProgress] = useState(0)
  const nav = useNavigate()

  async function run() {
    setStatus('running')
    setProgress(10)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 15, 90))
    }, 300)

    try {
      const res = await OptimizeAPI.run(datasetId, configId, 10)
      setResult(res)
      setProgress(100)
      setStatus('done')
    } catch (error) {
      setStatus('ready')
    } finally {
      clearInterval(progressInterval)
    }
  }

  function goBlueprint() {
    nav('/blueprint', { state: { solution: result } })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Run Optimization</h1>
          <p className="text-muted-foreground">
            Execute the room assignment optimization algorithm
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Optimizer Control</span>
              </CardTitle>
              <CardDescription>
                Start the optimization process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === 'ready' && (
                <Button onClick={run} size="lg" className="w-full md:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Start Optimization
                </Button>
              )}

              {status === 'running' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Running optimization...</span>
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      In Progress
                    </Badge>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {status === 'done' && result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Optimization complete!</span>
                    <Badge variant="default">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  </div>
                  <Progress value={100} />
                </div>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card className="shadow-lg border-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Optimization Results</span>
                </CardTitle>
                <CardDescription>
                  Algorithm performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-primary/10 p-6 space-y-2">
                    <p className="text-sm text-muted-foreground">Optimization Score</p>
                    <p className="text-4xl font-bold text-primary">
                      {result.score.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-6 space-y-2">
                    <p className="text-sm text-muted-foreground">Runtime</p>
                    <p className="text-4xl font-bold">
                      {result.runtimeMs}
                      <span className="text-lg text-muted-foreground ml-2">ms</span>
                    </p>
                  </div>
                </div>

                {result.rooms && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground mb-2">Room Assignments</p>
                    <p className="text-2xl font-semibold">{result.rooms.length} rooms configured</p>
                  </div>
                )}

                <Button onClick={goBlueprint} size="lg" className="w-full">
                  View Blueprint
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
