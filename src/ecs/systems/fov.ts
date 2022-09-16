import { system, System } from '@lastolivegames/becsy';

import { computeFOV, GameMap } from '../../map';
import { FieldOfView, Player, Position } from '../components';

@system
export class FovSystem extends System {
  map!: GameMap;
  private fovs = this.query((q) =>
    q.current.with(Position).read.with(FieldOfView).write.withAny(Player),
  );

  execute(): void {
    for (const entity of this.fovs.current) {
      const fov = entity.write(FieldOfView);
      const pos = entity.read(Position);

      if (fov.dirty) {
        fov.dirty = false;
        fov.visibleTiles.value = computeFOV(pos.x, pos.y, fov.range, this.map);

        if (entity.has(Player)) {
          this.map.updateFov(pos.x, pos.y, fov.range);
        }
      }
    }
  }
}
