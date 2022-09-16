import { Colors, Point, Terminal } from 'wglt';

import { BaseComponent } from '../base';
import { PositionLike } from '../ecs';

interface CameraBounds {
  min: Point;
  max: Point;
}

function range(start: number, end: number) {
  return [...Array(1 + end - start).keys()].map((v) => start + v);
}

export class Camera extends BaseComponent {
  bounds: CameraBounds = { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };

  getCharSize() {
    return { xChars: this.gameMap.width, yChars: this.gameMap.height };
  }

  setScreenBounds(player_position: PositionLike) {
    const { xChars, yChars } = this.getCharSize();

    const center_x = xChars / 2;
    const center_y = yChars / 2;

    const min_x = player_position.x - center_x;
    const max_x = min_x + xChars;
    const min_y = player_position.y - center_y;
    const max_y = min_y + yChars;

    this.bounds = { min: { x: min_x, y: min_y }, max: { x: max_x, y: max_y } };
  }

  render(term: Terminal) {
    const { min, max } = this.bounds;
    console.log(this.bounds);

    const map = this.gameMap;
    const map_width = map.width - 1;
    const map_height = map.height - 1;

    let y = 0;
    for (const ty of range(min.y, max.y)) {
      let x = 0;
      for (const tx of range(min.x, max.x)) {
        if (tx > 0 && tx < map_width && ty > 0 && ty < map_height) {
          const tile = map.tileMap[ty][tx];

          if (tile) {
            if (map.isVisible(tx, ty)) {
              term.drawCell(x, y, tile.light);
            } else if (map.console.grid[ty][tx].explored) {
              term.drawCell(x, y, tile.dark);
            } else {
              term.drawChar(x, y, 0, Colors.BLACK, Colors.BLACK);
            }
          }
        }
        x += 1;
      }
      y += 1;
    }
  }
}
