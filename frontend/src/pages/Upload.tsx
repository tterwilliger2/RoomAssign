import React, { useState } from 'react'
import { UploadAPI } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, Download } from 'lucide-react'

export function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [datasetId, setDatasetId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    try {
      const res = await UploadAPI.uploadCSV(file)
      setDatasetId(res.datasetId)
      setMessage(`Uploaded ${res.memberCount} members`)
      setTimeout(() => nav('/setup', { state: { datasetId: res.datasetId } }), 1000)
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload CSV</h1>
          <p className="text-muted-foreground mt-2">
            Upload a CSV file containing member information to get started
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Member Data
            </CardTitle>
            <CardDescription>
              Select a CSV file with member information (name, preferences, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <UploadIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-primary font-medium hover:underline">
                        Choose a file
                      </span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">CSV files only</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {file && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-md">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={!file || loading}
              >
                {loading ? (
                  'Uploading...'
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </form>

            {message && (
              <Alert variant="success" className="mt-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Sample Data
            </CardTitle>
            <CardDescription>
              Download a sample CSV file to see the expected format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <a href="/sample_data/members_example.csv" download>
                <Download className="mr-2 h-4 w-4" />
                Download Sample CSV
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
