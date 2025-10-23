import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDroppable, useDraggable, useSensor, useSensors } from '@dnd-kit/core'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Users, GripVertical, AlertCircle } from 'lucide-react'

function MemberChip({ m }: { m: any }) {
  return (
    <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium hover:bg-secondary/80 transition-colors">
      <Users className="h-3 w-3 mr-1" />
      {m.name || m.id}
    </Badge>
  )
}

function DraggableMember({ m }: { m: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `member-${m.id}` })
  const style: React.CSSProperties = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.5 : 1 } : {}
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
      <MemberChip m={m} />
    </div>
  )
}

function RoomCard({ room, overCapacity }: { room: any, overCapacity: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `room-${room.id}` })
  const filled = room.members.length
  const capacity = Number(room.capacity)
  const fillPercentage = (filled / capacity) * 100

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'shadow-md transition-all duration-200 min-h-[160px]',
        overCapacity && 'border-destructive ring-2 ring-destructive/20',
        isOver && 'ring-2 ring-primary shadow-lg scale-105'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span>{room.label}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={overCapacity ? 'destructive' : fillPercentage === 100 ? 'default' : 'outline'}>
              {filled}/{capacity}
            </Badge>
            {overCapacity && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
        </div>
        {fillPercentage > 0 && (
          <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
            <div
              className={cn('h-1.5 rounded-full transition-all', overCapacity ? 'bg-destructive' : 'bg-primary')}
              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 min-h-[60px]">
          {room.members.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">Empty room</div>
          ) : (
            room.members.map((m: any) => <DraggableMember key={m.id} m={m} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function Blueprint() {
  const { state } = useLocation() as any
  const initial = state?.solution
  const [rooms, setRooms] = useState<any[]>(initial?.rooms || [])
  const [staging, setStaging] = useState<any[]>([])

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  }))

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

  const totalMembers = rooms.reduce((acc, r) => acc + r.members.length, 0) + staging.length
  const overCapacityRooms = rooms.filter(isOverCapacity).length

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Room Blueprint</h1>
        <p className="text-muted-foreground">
          Drag and drop members to adjust room assignments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Members</p>
              <p className="text-3xl font-bold">{totalMembers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Rooms</p>
              <p className="text-3xl font-bold">{rooms.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={cn('shadow-md', overCapacityRooms > 0 && 'border-destructive')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Over Capacity</p>
              <p className={cn('text-3xl font-bold', overCapacityRooms > 0 && 'text-destructive')}>
                {overCapacityRooms}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rooms.map(r => <RoomCard key={r.id} room={r} overCapacity={isOverCapacity(r)} />)}
            </div>
          </div>
          <div className="lg:col-span-1">
            <StagingZone members={staging} />
          </div>
        </div>
        <DragOverlay />
      </DndContext>
    </Layout>
  )
}

function StagingZone({ members }: { members: any[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'staging-zone' })
  return (
    <Card 
      ref={setNodeRef} 
      className={cn(
        'shadow-md sticky top-20 transition-all duration-200',
        isOver && 'ring-2 ring-primary shadow-lg'
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg">Staging Area</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 min-h-[120px]">
          {members.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">Drop members here</div>
          ) : (
            members.map(m => <DraggableMember key={m.id} m={m} />)
          )}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">{members.length}</span> member{members.length !== 1 ? 's' : ''} in staging
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
