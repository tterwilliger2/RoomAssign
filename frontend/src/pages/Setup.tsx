import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ConfigAPI } from '../lib/api'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DoorOpen, Users, Bed, Settings as SettingsIcon, ArrowRight } from 'lucide-react'

function makeRooms(byCapacity: Record<number, number>) {
  const rooms: any[] = []
  Object.entries(byCapacity).forEach(([capStr, count]) => {
    const cap = Number(capStr)
    for (let i = 0; i < count; i++) rooms.push({ id: `${cap}-${i + 1}`, label: `${cap}p-${i + 1}`, capacity: cap })
  })
  return rooms
}

export function Setup() {
  const nav = useNavigate()
  const { state } = useLocation() as any
  const datasetId: number | null = state?.datasetId || null

  const [two, setTwo] = useState(3)
  const [three, setThree] = useState(2)
  const [four, setFour] = useState(1)
  const [allowEmptyBeds, setAllowEmptyBeds] = useState(true)
  const [budget, setBudget] = useState(2)
  const [loading, setLoading] = useState(false)

  const totalRooms = two + three + four
  const totalCapacity = two * 2 + three * 3 + four * 4

  async function saveConfig() {
    if (!datasetId) return
    setLoading(true)
    try {
      const rooms = makeRooms({ 2: two, 3: three, 4: four })
      const config = {
        rooms, allowEmptyBeds, emptyBedBudget: budget,
        hard: { mustApartPairs: [], mustTogetherPairs: [], mutualDislikePairs: [], fixedRoomAssignments: {} },
        weights: { alpha: 0.2, beta: 0.1, gamma: 0.1 }
      }
      const res = await ConfigAPI.save(datasetId, config)
      nav('/run', { state: { datasetId, configId: res.configId } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Configure the room layout and capacity for your assignment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <DoorOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalRooms}</p>
                    <p className="text-sm text-muted-foreground">Total Rooms</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Bed className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalCapacity}</p>
                    <p className="text-sm text-muted-foreground">Total Beds</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <SettingsIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{budget}</p>
                    <p className="text-sm text-muted-foreground">Empty Budget</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-primary" />
              Room Configuration
            </CardTitle>
            <CardDescription>
              Specify the number of rooms for each capacity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="two-person" className="flex items-center justify-between">
                  <span>2-Person Rooms</span>
                  <Badge variant="secondary">{two * 2} beds</Badge>
                </Label>
                <Input
                  id="two-person"
                  type="number"
                  min="0"
                  value={two}
                  onChange={e => setTwo(Number(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="three-person" className="flex items-center justify-between">
                  <span>3-Person Rooms</span>
                  <Badge variant="secondary">{three * 3} beds</Badge>
                </Label>
                <Input
                  id="three-person"
                  type="number"
                  min="0"
                  value={three}
                  onChange={e => setThree(Number(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="four-person" className="flex items-center justify-between">
                  <span>4-Person Rooms</span>
                  <Badge variant="secondary">{four * 4} beds</Badge>
                </Label>
                <Input
                  id="four-person"
                  type="number"
                  min="0"
                  value={four}
                  onChange={e => setFour(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="allow-empty"
                  checked={allowEmptyBeds}
                  onChange={(e: any) => setAllowEmptyBeds(e.target.checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="allow-empty" className="cursor-pointer">
                    Allow empty beds
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable this to allow rooms with fewer occupants than capacity
                  </p>
                </div>
              </div>

              {allowEmptyBeds && (
                <div className="ml-7 space-y-2 animate-in fade-in slide-in-from-top-1">
                  <Label htmlFor="empty-budget">Empty bed budget</Label>
                  <Input
                    id="empty-budget"
                    type="number"
                    min="0"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="max-w-[200px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of beds that can remain empty
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button size="lg" onClick={saveConfig} disabled={loading || !datasetId}>
                {loading ? 'Saving...' : (
                  <>
                    Continue to Run
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
