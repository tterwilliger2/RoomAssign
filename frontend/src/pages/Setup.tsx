import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ConfigAPI } from '../lib/api'

function makeRooms(byCapacity: Record<number, number>) {
  const rooms: any[] = []
  Object.entries(byCapacity).forEach(([capStr, count]) => {
    const cap = Number(capStr)
    for (let i=0;i<count;i++) rooms.push({ id: `${cap}-${i+1}`, label: `${cap}p-${i+1}`, capacity: cap })
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

  async function saveConfig() {
    if (!datasetId) return
    const rooms = makeRooms({2: two, 3: three, 4: four})
    const config = {
      rooms, allowEmptyBeds, emptyBedBudget: budget,
      hard: { mustApartPairs: [], mustTogetherPairs: [], mutualDislikePairs: [], fixedRoomAssignments: {} },
      weights: { alpha: 0.2, beta: 0.1, gamma: 0.1 }
    }
    const res = await ConfigAPI.save(datasetId, config)
    nav('/run', { state: { datasetId, configId: res.configId } })
  }

  return (
    <div className="max-w-3xl p-6 mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-magenta-600">Setup Rooms</h1>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>2-person rooms</label>
          <input className="border w-full px-2 py-1" type="number" value={two} onChange={e=>setTwo(Number(e.target.value))} />
        </div>
        <div>
          <label>3-person rooms</label>
          <input className="border w-full px-2 py-1" type="number" value={three} onChange={e=>setThree(Number(e.target.value))} />
        </div>
        <div>
          <label>4-person rooms</label>
          <input className="border w-full px-2 py-1" type="number" value={four} onChange={e=>setFour(Number(e.target.value))} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowEmptyBeds} onChange={e=>setAllowEmptyBeds(e.target.checked)} />
          Allow empty beds
        </label>
        {allowEmptyBeds && (
          <label className="flex items-center gap-2">
            <span>Empty bed budget</span>
            <input className="border w-24 px-2 py-1" type="number" value={budget} onChange={e=>setBudget(Number(e.target.value))} />
          </label>
        )}
      </div>
      <button onClick={saveConfig} className="bg-magenta-600 text-white rounded px-4 py-2">Save & Continue</button>
    </div>
  )
}
