import { system, System } from '@lastolivegames/becsy';

import { Camera } from '../../map/camera';
import { Player, Position } from '../components';
import { InputSystem } from './input';

@system((s) => s.after(InputSystem))
export class CameraSystem extends System {
  camera!: Camera;

  private player = this.query((q) => q.current.with(Position).read.and.withAny(Player).read);

  execute(): void {
    for (const entity of this.player.current) {
      const pos = entity.read(Position);
      this.camera.setScreenBounds(pos);
    }
  }
}
