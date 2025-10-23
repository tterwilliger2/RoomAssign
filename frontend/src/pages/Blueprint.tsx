import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDroppable, useDraggable, useSensor, useSensors } from '@dnd-kit/core'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Users, DoorOpen, AlertCircle, GripVertical } from 'lucide-react'

function MemberChip({ m }: { m: any }) {
  return (
    <Badge variant="secondary" className="cursor-move hover:bg-primary/20 transition-colors">
      <GripVertical className="h-3 w-3 mr-1 opacity-50" />
      {m.name || m.id}
    </Badge>
  )
}

function DraggableMember({ m }: { m: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `member-${m.id}` })
  const style: React.CSSProperties = transform 
    ? { 
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
      } 
    : {}
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <MemberChip m={m} />
    </div>
  )
}

function RoomCard({ room, overCapacity }: { room: any, overCapacity: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `room-${room.id}` })
  
  return (
    <Card 
      ref={setNodeRef} 
      className={cn(
        "shadow-md hover:shadow-lg transition-shadow min-h-[140px]",
        overCapacity && "border-destructive",
        isOver && "ring-2 ring-primary border-primary"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">{room.label}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={overCapacity ? "destructive" : "outline"} className="text-xs">
              {room.members.length}/{room.capacity}
            </Badge>
            {overCapacity && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 min-h-[60px]">
          {room.members.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Empty room</p>
          ) : (
            room.members.map((m: any) => <DraggableMember key={m.id} m={m} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StagingZone({ members }: { members: any[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'staging-zone' })
  return (
    <Card 
      ref={setNodeRef} 
      className={cn(
        "shadow-md hover:shadow-lg transition-shadow sticky top-24",
        isOver && "ring-2 ring-primary border-primary"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Staging Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 min-h-[100px] p-3 bg-muted/30 rounded-lg">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Drag members here</p>
          ) : (
            members.map(m => <DraggableMember key={m.id} m={m} />)
          )}
        </div>
        {members.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {members.length} member{members.length !== 1 ? 's' : ''} unassigned
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function Blueprint() {
  const { state } = useLocation() as any
  const initial = state?.solution
  const [rooms, setRooms] = useState<any[]>(initial?.rooms || [])
  const [staging, setStaging] = useState<any[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }))

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

  const totalAssigned = rooms.reduce((sum, r) => sum + r.members.length, 0)
  const totalCapacity = rooms.reduce((sum, r) => sum + Number(r.capacity), 0)
  const overCapacityCount = rooms.filter(isOverCapacity).length

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blueprint</h1>
            <p className="text-muted-foreground mt-2">
              Drag and drop members to adjust room assignments
            </p>
          </div>
          <div className="flex gap-3">
            <Card className="shadow-md">
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalAssigned}/{totalCapacity}</p>
                  <p className="text-xs text-muted-foreground">Assigned</p>
                </div>
              </CardContent>
            </Card>
            {overCapacityCount > 0 && (
              <Card className="shadow-md border-destructive">
                <CardContent className="p-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">{overCapacityCount}</p>
                    <p className="text-xs text-muted-foreground">Over Capacity</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {rooms.map(r => <RoomCard key={r.id} room={r} overCapacity={isOverCapacity(r)} />)}
            </div>
            <div className="lg:col-span-1">
              <StagingZone members={staging} />
            </div>
          </div>
          <DragOverlay />
        </DndContext>
      </div>
    </Layout>
  )
}
