import { serializable, Console, Point, Rect, Terminal, Colors } from 'wglt';

import { BaseComponent } from '../base';
import { PositionLike } from '../ecs';
import { Engine } from '../engine';
import { floor, stairs, Tile, wall } from './tile';

@serializable
export class GameMap extends BaseComponent {
  level = 0;
  tileMap: Tile[][];
  console: Console;
  stairsLocation = new Point(0, 0);
  start_position = new Point(0, 0);

  constructor(engine: Engine, width: number, height: number) {
    super(engine);

    this.tileMap = [];
    this.console = new Console(width, height);

    for (let y = 0; y < height; y++) {
      this.tileMap.push([]);
      for (let x = 0; x < width; x++) {
        this.tileMap[y].push(wall);
        this.makeWall(x, y);
      }
    }
  }

  get width(): number {
    return this.console.width;
  }
  get height(): number {
    return this.console.height;
  }

  in_bounds(pt: PositionLike): boolean {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height;
  }

  canEnterTile(pt: PositionLike): boolean {
    return this.in_bounds(pt) && !this.console.isBlocked(pt.x, pt.y);
  }

  isVisible(x: number, y: number): boolean {
    return this.console.isVisible(x, y);
  }

  updateFov(x: number, y: number, range: number): void {
    this.console.computeFov(x, y, range);
    this.console.updateExplored();
  }

  render(term: Terminal): void {
    for (let y = 0; y < this.height - 1; y++) {
      for (let x = 0; x < this.width - 1; x++) {
        const tile = this.tileMap[y][x];
        if (tile) {
          if (this.isVisible(x, y)) {
            term.drawCell(x, y, tile.light);
          } else if (this.console.grid[y][x].explored) {
            term.drawCell(x, y, tile.dark);
          } else {
            term.drawChar(x, y, 0, Colors.BLACK, Colors.BLACK);
          }
        } else {
          console.log('tile is undefined');
        }
      }
    }
  }

  //////////////////////////////////////////////////////////
  // Map Gen
  //////////////////////////////////////////////////////////

  apply_room_to_map(room: Rect): void {
    for (let y = room.y + 1; y < room.y2; y++) {
      for (let x = room.x + 1; x < room.x2; x++) {
        this.makeFloor(x, y);
      }
    }
  }

  apply_horizontal_tunnel(x1: number, x2: number, y: number): void {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      this.makeFloor(x, y);
    }
  }

  apply_vertical_tunnel(y1: number, y2: number, x: number): void {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      this.makeFloor(x, y);
    }
  }

  makeStairs(x: number, y: number): void {
    this.makeFloor(x, y);
    this.stairsLocation = new Point(x, y);
    this.tileMap[y][x] = stairs;
  }

  private makeWall(x: number, y: number): void {
    this.tileMap[y][x] = wall;
    this.console.setBlocked(x, y, true);
    this.console.setBlockedSight(x, y, true);
  }

  private makeFloor(x: number, y: number): void {
    this.tileMap[y][x] = floor;
    this.console.setBlocked(x, y, false);
    this.console.setBlockedSight(x, y, false);
  }
}

export const computeFOV = (originX: number, originY: number, radius: number, map: GameMap) => {
  const newConsole = new Console(map.width, map.height);
  newConsole.computeFov(originX, originY, radius);

  return newConsole.grid
    .map((cells) => {
      return cells
        .filter((cell) => {
          return cell.visible && map.in_bounds(new Point(cell.x, cell.y));
        })
        .flatMap((c) => new Point(c.x, c.y));
    })
    .flat();
};
