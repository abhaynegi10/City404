import { Room, RoomType } from '@/types'

export const ROOMS: Room[] = [
  {
    id: 'church',
    name: 'Abandoned Church',
    description: 'Shattered pews. Moonlight through broken stained glass.',
    ambiance: 'The silence here is sacred and suffocating.',
    imagePath: '/rooms/church.png',
    hotspots: [
      { id: 'church-altar', x: 50, y: 30, label: 'Altar', isMessageLocation: true },
      { id: 'church-pew', x: 25, y: 65, label: 'Broken Pew', isMessageLocation: false },
      { id: 'church-window', x: 75, y: 25, label: 'Stained Glass', isMessageLocation: false },
      { id: 'church-floor', x: 40, y: 80, label: 'Stone Floor', isMessageLocation: false },
    ],
  },
  {
    id: 'bus',
    name: 'Last Bus Stand',
    description: 'Flickering fluorescent. Abandoned night terminal.',
    ambiance: 'The last bus left years ago. Something stayed behind.',
    imagePath: '/rooms/bus-stand.png',
    hotspots: [
      { id: 'bus-board', x: 60, y: 20, label: 'Departure Board', isMessageLocation: true },
      { id: 'bus-seat', x: 30, y: 60, label: 'Empty Seat', isMessageLocation: false },
      { id: 'bus-puddle', x: 50, y: 85, label: 'Floor Puddle', isMessageLocation: false },
      { id: 'bus-window', x: 80, y: 40, label: 'Foggy Window', isMessageLocation: false },
    ],
  },
  {
    id: 'morgue',
    name: 'Morgue Room',
    description: 'Steel drawers. Cold clinical horror.',
    ambiance: 'The cold here has nothing to do with temperature.',
    imagePath: '/rooms/morgue.png',
    hotspots: [
      { id: 'morgue-drawer', x: 70, y: 50, label: 'Steel Drawer', isMessageLocation: false },
      { id: 'morgue-table', x: 45, y: 40, label: 'Autopsy Table', isMessageLocation: true },
      { id: 'morgue-equipment', x: 20, y: 55, label: 'Rusted Equipment', isMessageLocation: false },
      { id: 'morgue-drain', x: 50, y: 90, label: 'Floor Drain', isMessageLocation: false },
      { id: 'morgue-light', x: 50, y: 10, label: 'Overhead Light', isMessageLocation: false },
    ],
  },
  {
    id: 'tunnel',
    name: 'Underground Tunnel',
    description: 'Dripping walls. Distant echoes.',
    ambiance: 'Something moves at the far end. The bulb flickers.',
    imagePath: '/rooms/tunnel.png',
    hotspots: [
      { id: 'tunnel-bulb', x: 50, y: 15, label: 'Bare Bulb', isMessageLocation: false },
      { id: 'tunnel-pipe', x: 15, y: 30, label: 'Rusted Pipe', isMessageLocation: true },
      { id: 'tunnel-puddle', x: 50, y: 80, label: 'Water Puddle', isMessageLocation: false },
      { id: 'tunnel-wall', x: 80, y: 50, label: 'Dripping Wall', isMessageLocation: false },
    ],
  },
  {
    id: 'hospital',
    name: 'Hospital Ward',
    description: 'Overturned beds. Static monitors.',
    ambiance: 'The monitors still flicker. The beds are still warm.',
    imagePath: '/rooms/hospital.png',
    hotspots: [
      { id: 'hospital-monitor', x: 65, y: 35, label: 'Static Monitor', isMessageLocation: true },
      { id: 'hospital-bed', x: 30, y: 55, label: 'Overturned Bed', isMessageLocation: false },
      { id: 'hospital-iv', x: 75, y: 65, label: 'IV Stand', isMessageLocation: false },
      { id: 'hospital-door', x: 85, y: 45, label: 'Cracked Door', isMessageLocation: false },
      { id: 'hospital-floor', x: 45, y: 90, label: 'Medical Debris', isMessageLocation: false },
    ],
  },
  {
    id: 'classroom',
    name: 'Forgotten Classroom',
    description: 'Dusty chalkboards. Broken desks.',
    ambiance: 'The clock stopped at midnight. Class was never dismissed.',
    imagePath: '/rooms/classroom.png',
    hotspots: [
      { id: 'classroom-board', x: 50, y: 25, label: 'Chalkboard', isMessageLocation: false },
      { id: 'classroom-desk', x: 35, y: 65, label: 'Broken Desk', isMessageLocation: true },
      { id: 'classroom-clock', x: 85, y: 15, label: 'Frozen Clock', isMessageLocation: false },
      { id: 'classroom-book', x: 20, y: 80, label: 'Torn Textbook', isMessageLocation: false },
    ],
  },
]

export const ROOM_MAP: Record<RoomType, Room> = Object.fromEntries(
  ROOMS.map(r => [r.id, r])
) as Record<RoomType, Room>

export function getRoomById(id: RoomType): Room | undefined {
  return ROOM_MAP[id]
}
