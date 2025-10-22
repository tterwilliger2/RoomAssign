import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { OptimizeAPI } from '../lib/api'

export function Run() {
  const { state } = useLocation() as any
  const datasetId: number = state?.datasetId
  const configId: number = state?.configId
  const [status, setStatus] = useState<string>('Ready')
  const [result, setResult] = useState<any | null>(null)
  const nav = useNavigate()

  async function run() {
    setStatus('Running...')
    const res = await OptimizeAPI.run(datasetId, configId, 10)
    setResult(res)
    setStatus('Done')
  }

  function goBlueprint() {
    nav('/blueprint', { state: { solution: result } })
  }

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h1 className="text-2xl font-semibold text-magenta-600 mb-4">Run Optimizer</h1>
      <button className="bg-magenta-600 text-white rounded px-4 py-2" onClick={run}>Run</button>
      <div className="mt-4 text-gray-700">{status}</div>
      {result && (
        <div className="mt-6 p-4 border rounded bg-white">
          <div>Score: <b>{result.score.toFixed(2)}</b></div>
          <div>Runtime: {result.runtimeMs} ms</div>
          <div className="mt-2">
            <button className="border px-3 py-1 rounded" onClick={goBlueprint}>Open Blueprint</button>
          </div>
        </div>
      )}
    </div>
  )
}
