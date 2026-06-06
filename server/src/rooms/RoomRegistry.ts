import { GameRoom } from '../game/GameRoom'
import { generateCode } from '../utils/codeGen'

class RoomRegistry {
  private rooms = new Map<string, GameRoom>()

  create(hostId: string, hostName: string): GameRoom {
    let code: string
    do {
      code = generateCode()
    } while (this.rooms.has(code))

    const room = new GameRoom(code, hostId, hostName)
    this.rooms.set(code, room)
    return room
  }

  get(code: string): GameRoom | undefined {
    return this.rooms.get(code.toUpperCase())
  }

  has(code: string): boolean {
    return this.rooms.has(code.toUpperCase())
  }

  delete(code: string): void {
    this.rooms.delete(code.toUpperCase())
  }

  all(): GameRoom[] {
    return [...this.rooms.values()]
  }
}

export const roomRegistry = new RoomRegistry()
