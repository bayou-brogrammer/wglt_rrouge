import { Rect } from 'wglt';

import { Engine } from '../engine';
import { GameMap } from './gamemap';

/**
 * Procedurally generates a dungeon.
 * @param engine The game engine.
 * @param level The dungeon level.
 * @param maxRooms The maximum number of rooms allowed in the dungeon. We’ll use this to control our iteration.
 * @param roomMinSize The minimum size of one room.
 * @param roomMaxSize The maximum size of one room.
 * @param mapWidth The width of the GameMap to create.
 * @param mapHeight The height of the GameMap to create.
 * @returns A new dungeon.
 */
export function generateDungeon(
  engine: Engine,
  level: number,
  maxRooms: number,
  roomMinSize: number,
  roomMaxSize: number,
  mapWidth: number,
  mapHeight: number,
): GameMap {
  const { rng } = engine;

  const dungeon = new GameMap(engine, mapWidth, mapHeight);
  dungeon.level = level;

  const rooms: Rect[] = [];
  let center = undefined;

  for (let r = 0; r < maxRooms; r++) {
    const w = rng.nextRange(roomMinSize, roomMaxSize);
    const h = rng.nextRange(roomMinSize, roomMaxSize);

    const x = rng.nextRange(0, mapWidth - w - 1);
    const y = rng.nextRange(0, mapHeight - h - 1);

    // "Rect" class makes rectangles easier to work with
    const newRoom = new Rect(x, y, w, h);

    // Run through the other rooms and see if they intersect with this one
    if (rooms.some((room) => room.intersects(newRoom))) {
      // This room intersects, so go to the next attempt.
      continue;
    }

    // Dig out this rooms inner area.
    dungeon.apply_room_to_map(newRoom);

    // Center coordinates of new room, will be useful later
    center = newRoom.getCenter();

    if (rooms.length === 0) {
      // This is the first room, where the player starts at
      dungeon.start_position = center;
    } else {
      // All rooms after the first:
      // Dig out a tunnel between this room and the previous one.
      // Center coordinates of previous room
      const prev = rooms[rooms.length - 1].getCenter();
      if (rng.nextRange(0, 1) === 1) {
        // First move horizontally, then vertically
        dungeon.apply_horizontal_tunnel(prev.x, center.x, prev.y);
        dungeon.apply_vertical_tunnel(prev.y, center.y, center.x);
      } else {
        // First move vertically, then horizontally
        dungeon.apply_vertical_tunnel(prev.y, center.y, prev.x);
        dungeon.apply_horizontal_tunnel(prev.x, center.x, center.y);
      }
    }

    // placeEntities(rng, newRoom, dungeon, level);

    dungeon.makeStairs(center.x, center.y);

    // Finally, append the new room to the list
    rooms.push(newRoom);
  }

  return dungeon;
}
