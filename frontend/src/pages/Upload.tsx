import React, { useState } from 'react'
import { UploadAPI } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload as UploadIcon, FileText, CheckCircle2, Download } from 'lucide-react'

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
      setMessage(`Successfully uploaded ${res.memberCount} members`)
      setTimeout(() => nav('/setup', { state: { datasetId: res.datasetId } }), 1200)
    } catch (error) {
      setMessage('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Member Data</h1>
          <p className="text-muted-foreground">
            Upload a CSV file containing member information to get started
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UploadIcon className="h-5 w-5" />
                <span>Upload CSV File</span>
              </CardTitle>
              <CardDescription>
                Select a CSV file with member data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">CSV File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {file && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!file || loading}
                  size="lg"
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  {loading ? 'Uploading...' : 'Upload & Continue'}
                </Button>
              </form>
              {message && (
                <div className={`mt-4 flex items-center space-x-2 p-3 rounded-md ${
                  message.includes('Success') 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {message.includes('Success') && <CheckCircle2 className="h-4 w-4" />}
                  <span className="text-sm">{message}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Sample Data</span>
              </CardTitle>
              <CardDescription>
                Download a sample CSV to see the expected format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Your CSV should include columns for member information such as:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Member ID</li>
                  <li>Name</li>
                  <li>Preferences</li>
                  <li>Other relevant data</li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                size="lg"
                asChild
              >
                <a href="/sample_data/members_example.csv" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample CSV
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
