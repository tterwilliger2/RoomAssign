import React from 'react'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, FileText, FileSpreadsheet, Printer } from 'lucide-react'

export function ExportPage() {
  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log('Export PDF')
  }

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log('Export CSV')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Export Room Assignments</h1>
          <p className="text-muted-foreground">
            Download your finalized room assignments in various formats
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>PDF Export</span>
              </CardTitle>
              <CardDescription>
                Download a formatted PDF document of all room assignments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Professional layout with room details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Member names and assignments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Optimization scores and metrics</span>
                  </li>
                </ul>
              </div>
              <Button onClick={handleExportPDF} className="w-full" size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <span>CSV Export</span>
              </CardTitle>
              <CardDescription>
                Download a CSV file for easy data import and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Spreadsheet-compatible format</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Easy to import into Excel or Sheets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Machine-readable data structure</span>
                  </li>
                </ul>
              </div>
              <Button onClick={handleExportCSV} variant="outline" className="w-full" size="lg">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Printer className="h-5 w-5 text-primary" />
                <span>Print</span>
              </CardTitle>
              <CardDescription>
                Print the room assignments directly from your browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handlePrint} variant="secondary" size="lg" className="w-full md:w-auto">
                <Printer className="mr-2 h-4 w-4" />
                Print Room Assignments
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 shadow-lg bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileDown className="h-5 w-5 text-primary" />
              <span>Export Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Before exporting:</strong> Make sure you have finalized all room assignments on the Blueprint page.
              </p>
              <p>
                <strong>PDF exports</strong> are ideal for sharing and presentations, while <strong>CSV exports</strong> are
                better suited for data analysis and integration with other systems.
              </p>
              <p>
                <strong>Note:</strong> Export functionality requires a backend connection. Ensure you're connected to the server.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
