import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ConfigAPI } from '../lib/api'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Settings, Users, Bed, ArrowRight } from 'lucide-react'

function makeRooms(byCapacity: Record<number, number>) {
  const rooms: any[] = []
  Object.entries(byCapacity).forEach(([capStr, count]) => {
    const cap = Number(capStr)
    for (let i = 0; i < count; i++) rooms.push({ id: `${cap}-${i+1}`, label: `${cap}p-${i+1}`, capacity: cap })
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
        rooms,
        allowEmptyBeds,
        emptyBedBudget: budget,
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configure Rooms</h1>
          <p className="text-muted-foreground">
            Set up your room configuration and constraints
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bed className="h-5 w-5" />
                <span>Room Configuration</span>
              </CardTitle>
              <CardDescription>
                Specify the number of rooms by capacity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="two" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>2-Person Rooms</span>
                  </Label>
                  <Input
                    id="two"
                    type="number"
                    min="0"
                    value={two}
                    onChange={e => setTwo(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="three" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>3-Person Rooms</span>
                  </Label>
                  <Input
                    id="three"
                    type="number"
                    min="0"
                    value={three}
                    onChange={e => setThree(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="four" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>4-Person Rooms</span>
                  </Label>
                  <Input
                    id="four"
                    type="number"
                    min="0"
                    value={four}
                    onChange={e => setFour(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Rooms</p>
                    <p className="text-2xl font-bold">{totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Capacity</p>
                    <p className="text-2xl font-bold">{totalCapacity}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Constraints</span>
              </CardTitle>
              <CardDescription>
                Configure optimization constraints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-empty">Allow Empty Beds</Label>
                  <p className="text-sm text-muted-foreground">
                    Permit rooms to have unfilled beds
                  </p>
                </div>
                <Switch
                  id="allow-empty"
                  checked={allowEmptyBeds}
                  onCheckedChange={setAllowEmptyBeds}
                />
              </div>

              {allowEmptyBeds && (
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="budget">Empty Bed Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of empty beds allowed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={saveConfig} 
            size="lg" 
            className="w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save & Continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Layout>
  )
}
