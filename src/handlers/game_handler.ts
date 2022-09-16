import { serializable, Terminal } from 'wglt';

import { Engine } from '../engine';
import { EventHandler } from '../event_handler';

@serializable
export class MainGameEventHandler extends EventHandler {
  constructor(engine: Engine) {
    super(engine);
  }

  update(_: Terminal): void {
    this.engine.world.execute();
  }
}
