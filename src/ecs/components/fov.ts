import { component, field } from '@lastolivegames/becsy';
import { Point } from 'wglt';

@component
export class FieldOfView {
  @field.boolean declare dirty: boolean;
  @field.uint32 declare range: number;
  @field.object declare visibleTiles: { value: Point[] };

  static init(range: number) {
    return { range, dirty: true, visibleTiles: { value: [] } };
  }
}
