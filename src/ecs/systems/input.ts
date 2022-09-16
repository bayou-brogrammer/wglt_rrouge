import { system, System } from '@lastolivegames/becsy';
import { Terminal } from 'wglt';

import { GameMap } from '../../map';
import { FieldOfView, Player, Position } from '../components';
import { FovSystem } from './fov';

@system((s) => s.before(FovSystem))
export class InputSystem extends System {
  term!: Terminal;
  map!: GameMap;
  private player = this.query((q) => q.current.withAny(Position, FieldOfView, Player).write);

  execute(): void {
    for (const entity of this.player.current) {
      const moveKey = this.term.getMovementKey();
      if (moveKey) {
        const fov = entity.write(FieldOfView);
        const position = entity.write(Position);
        const destination = position.add(moveKey);

        if (this.map.canEnterTile(destination)) {
          fov.dirty = true;
          position.x = destination.x;
          position.y = destination.y;
        }
      }
    }
  }
}
