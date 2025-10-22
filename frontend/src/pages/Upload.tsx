import React, { useState } from 'react'
import { UploadAPI } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [datasetId, setDatasetId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const nav = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const res = await UploadAPI.uploadCSV(file)
    setDatasetId(res.datasetId)
    setMessage(`Uploaded ${res.memberCount} members`)
    setTimeout(() => nav('/setup', { state: { datasetId: res.datasetId } }), 800)
  }

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h1 className="text-2xl font-semibold text-magenta-600 mb-4">Upload CSV</h1>
      <form onSubmit={submit} className="space-y-3">
        <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="bg-magenta-600 text-white rounded px-4 py-2">Upload</button>
      </form>
      {message && <div className="mt-4 text-green-700">{message}</div>}
      <div className="mt-6">
        <a className="text-magenta-600 underline" href="/sample_data/members_example.csv" download>Download sample CSV</a>
      </div>
    </div>
  )
}
