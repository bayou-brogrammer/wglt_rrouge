import { deserialize, serialize } from 'wglt';

import { Engine } from './engine';

export class SerializeManager {
  static saveGame(engine: Engine) {
    localStorage.setItem('savegame', serialize(engine));
  }

  static loadGame(): Engine {
    return deserialize(localStorage.getItem('savegame') || '') as Engine;
  }
}
