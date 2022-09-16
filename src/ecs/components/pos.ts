import { component, field } from '@lastolivegames/becsy';

export interface PositionLike {
  x: number;
  y: number;
}

@component
export class Position {
  @field.int32 declare x: number;
  @field.int32 declare y: number;

  static zero(): Position {
    return new Position();
  }

  add(other: PositionLike): Position {
    const pos = new Position();
    pos.x = this.x + other.x;
    pos.y = this.y + other.y;
    return pos;
  }
}
