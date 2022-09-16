import { Entity, World } from '@lastolivegames/becsy';
import { Colors, GUI, RNG, serializable, Terminal } from 'wglt';

import { BaseComponent } from './base';
import {
  CameraSystem,
  FieldOfView,
  FovSystem,
  InputSystem,
  Player,
  Position,
  RenderSystem,
} from './ecs';
import { EventHandler } from './event_handler';
import { MainGameEventHandler } from './handlers/game_handler';
import { MainMenuEventHandler } from './handlers/main_menu';
import { GameMap } from './map';
import { Camera } from './map/camera';
import { generateDungeon } from './map/procgen';
import { SerializeManager } from './serializeManager';

export const SCREEN_WIDTH = 80;
export const SCREEN_HEIGHT = 45;
export const maxFps = 45;

const MAP_WIDTH = 80;
const MAP_HEIGHT = 38;

const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;

const crt = {
  scale: 3,
  blur: 0.5,
  curvature: 0.12,
  chroma: 0.5,
  vignette: 0.1,
  scanlineWidth: 0.75,
  scanlineIntensity: 0.25,
};

@serializable
export class Engine extends BaseComponent {
  readonly rng;
  readonly camera: Camera;
  readonly serializeManager: SerializeManager = new SerializeManager();

  gui: GUI;
  term: Terminal;
  gameMap_!: GameMap;
  eventHandler: EventHandler;

  world!: World;

  constructor() {
    super();

    this.rng = new RNG();
    this.term = new Terminal(
      document.querySelector('canvas') as HTMLCanvasElement,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      { maxFps, crt },
    );
    this.gui = new GUI(this.term);
    this.eventHandler = new MainMenuEventHandler(this);

    this.camera = new Camera(this);

    this.term.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, Colors.WHITE, Colors.BLACK);
    this.term.update = () => this.update();
  }

  get engine() {
    return this;
  }

  get gameMap() {
    return this.gameMap_;
  }

  async newGame() {
    this.generateFloor();

    this.world = await World.create({
      defs: [
        RenderSystem,
        { term: this.term, camera: this.camera },
        FovSystem,
        { map: this.gameMap },
        InputSystem,
        { term: this.term, map: this.gameMap },
        CameraSystem,
        { camera: this.camera },
      ],
    });

    this.world.createEntity(
      Position,
      {
        x: this.gameMap_.start_position.x,
        y: this.gameMap_.start_position.y,
      },
      FieldOfView,
      FieldOfView.init(8),
      Player,
    );

    this.eventHandler = new MainGameEventHandler(this);
    this.term.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, Colors.WHITE, Colors.BLACK);
  }

  generateFloor(level = 0): void {
    this.gameMap_ = generateDungeon(
      this,
      level + 1,
      MAX_ROOMS,
      ROOM_MIN_SIZE,
      ROOM_MAX_SIZE,
      MAP_WIDTH,
      MAP_HEIGHT,
    );
  }

  getPosition(entity: Entity): Position {
    return entity.read(Position);
  }

  update() {
    if (!this.gui.handleInput()) {
      this.eventHandler.update(this.term);
    }

    this.render();
  }

  render() {
    // Draw overlay for input handler
    this.eventHandler.onRender(this.term);

    this.gui.draw();
  }
}
