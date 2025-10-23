import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { OptimizeAPI } from '../lib/api'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PlayCircle, CheckCircle2, Clock, Trophy, FileImage, Sparkles } from 'lucide-react'

export function Run() {
  const { state } = useLocation() as any
  const datasetId: number = state?.datasetId
  const configId: number = state?.configId
  const [status, setStatus] = useState<string>('Ready')
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function run() {
    setLoading(true)
    setStatus('Optimizing room assignments...')
    try {
      const res = await OptimizeAPI.run(datasetId, configId, 10)
      setResult(res)
      setStatus('Optimization complete!')
    } catch (error: any) {
      setStatus('Optimization failed')
    } finally {
      setLoading(false)
    }
  }

  function goBlueprint() {
    nav('/blueprint', { state: { solution: result } })
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Run Optimizer</h1>
          <p className="text-muted-foreground mt-2">
            Execute the room assignment optimization algorithm
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              Optimization Engine
            </CardTitle>
            <CardDescription>
              Start the optimization process to generate optimal room assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              {!result && !loading && (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              )}
              
              {loading && (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-lg animate-pulse">
                  <PlayCircle className="h-12 w-12 text-primary animate-spin" />
                </div>
              )}

              {result && (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              )}

              <div className="text-center">
                <Badge variant={loading ? 'default' : result ? 'secondary' : 'outline'} className="text-sm">
                  {status}
                </Badge>
              </div>
            </div>

            {!result && (
              <Button 
                size="lg" 
                className="w-full" 
                onClick={run} 
                disabled={loading || !datasetId || !configId}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                {loading ? 'Running Optimization...' : 'Start Optimization'}
              </Button>
            )}
          </CardContent>
        </Card>

        {result && (
          <>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Results
                </CardTitle>
                <CardDescription>
                  Optimization completed successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50">
                    <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Optimization Score</p>
                      <p className="text-2xl font-bold">{result.score.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Runtime</p>
                      <p className="text-2xl font-bold">{result.runtimeMs} ms</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Room assignments have been optimized! View the blueprint to see the results.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button size="lg" onClick={goBlueprint}>
                <FileImage className="mr-2 h-5 w-5" />
                View Blueprint
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
