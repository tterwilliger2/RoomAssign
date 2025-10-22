import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDroppable, useDraggable, useSensor, useSensors } from '@dnd-kit/core'

function MemberChip({ m }: { m: any }) {
  return (
    <div className="px-2 py-1 bg-pink-100 text-pink-900 rounded-full text-sm inline-flex items-center gap-2">
      <span>•</span> {m.name || m.id}
    </div>
  )
}

function DraggableMember({ m }: { m: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `member-${m.id}` })
  const style: React.CSSProperties = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : {}
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={"cursor-move"}>
      <MemberChip m={m} />
    </div>
  )
}

function RoomCard({ room, overCapacity }: { room: any, overCapacity: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `room-${room.id}` })
  return (
    <div ref={setNodeRef} className={`p-3 border rounded-xl bg-white min-h-[120px] ${overCapacity ? 'border-red-500' : 'border-gray-200'} ${isOver ? 'ring-2 ring-magenta-600' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{room.label}</div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {room.members.length}/{room.capacity}
          {overCapacity && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Over</span>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {room.members.map((m: any) => <DraggableMember key={m.id} m={m} />)}
      </div>
    </div>
  )
}

export function Blueprint() {
  const { state } = useLocation() as any
  const initial = state?.solution
  const [rooms, setRooms] = useState<any[]>(initial?.rooms || [])
  const [staging, setStaging] = useState<any[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  function onDragStart() {}
  function onDragEnd(e: DragEndEvent) {
    const active = e.active
    const over = e.over
    if (!active) return
    const memberId = String(active.id).replace('member-', '')
    if (!over) return
    const overId = String(over.id)

    // Remove from any room and staging
    let member: any | null = null
    const nextRooms = rooms.map(r => {
      const keep = r.members.filter((m: any) => {
        const match = m.id === memberId
        if (match) member = m
        return !match
      })
      return { ...r, members: keep }
    })
    const nextStaging = staging.filter((m: any) => m.id !== memberId)

    if (overId.startsWith('room-')) {
      const rid = overId.replace('room-', '')
      const idx = nextRooms.findIndex(r => r.id === rid)
      if (idx >= 0 && member) nextRooms[idx].members = [...nextRooms[idx].members, member]
      setRooms(nextRooms)
      setStaging(nextStaging)
    } else if (overId === 'staging-zone') {
      if (member) setStaging([...nextStaging, member])
      setRooms(nextRooms)
    }
  }

  function isOverCapacity(room: any) {
    return room.members.length > Number(room.capacity)
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="p-6 grid grid-cols-4 gap-4">
        <div className="col-span-3 grid grid-cols-3 gap-4">
          {rooms.map(r => <RoomCard key={r.id} room={r} overCapacity={isOverCapacity(r)} />)}
        </div>
        <div className="col-span-1">
          <StagingZone members={staging} />
        </div>
      </div>
      <DragOverlay />
    </DndContext>
  )
}

function StagingZone({ members }: { members: any[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'staging-zone' })
  return (
    <div ref={setNodeRef} className={`p-3 border rounded-xl bg-white ${isOver ? 'ring-2 ring-magenta-600' : ''}`}>
      <div className="font-semibold mb-2">Staging Zone</div>
      <div className="flex flex-wrap gap-2 min-h-[80px]">
        {members.map(m => <DraggableMember key={m.id} m={m} />)}
      </div>
    </div>
  )
}
