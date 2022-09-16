import { system, System } from '@lastolivegames/becsy';
import { Colors, Terminal } from 'wglt';

import { Camera } from '../../map/camera';
import { Position } from '../components';
import { FovSystem } from './fov';
import { InputSystem } from './input';

@system((s) => s.after(InputSystem).after(FovSystem))
export class RenderSystem extends System {
  term!: Terminal;
  camera!: Camera;
  private renderables = this.query((q) => q.current.with(Position).read);

  execute(): void {
    this.term.clear();
    this.camera.render(this.term);

    const { min } = this.camera.bounds;
    for (const entity of this.renderables.current) {
      const pt = entity.read(Position); // guaranteed to have an Enemy component
      const entity_screen_x = pt.x - min.x;
      const entity_screen_y = pt.y - min.y;
      this.term.drawChar(entity_screen_x, entity_screen_y, '@', Colors.YELLOW, Colors.BLACK);
    }
  }
}
