import { Terminal } from 'wglt';

import { BaseComponent } from './base';

export abstract class EventHandler extends BaseComponent {
  abstract update(term: Terminal): void;

  onRender(_term: Terminal): void {
    // By default, do nothing
    // Override in subclasses
  }
}
