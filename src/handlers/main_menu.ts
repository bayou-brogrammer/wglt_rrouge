import { MessageDialog, SelectDialog, serializable, Terminal } from 'wglt';

import { BaseComponent } from '../base';
import { Colors } from '../color';
import { EventHandler } from '../event_handler';

@serializable
export class MainMenuEventHandler extends EventHandler {
  constructor(parent?: BaseComponent) {
    super(parent);
    const gui = this.engine.gui;

    gui.add(
      new SelectDialog(
        'Main Menu',
        ['New Game', 'Continue', 'Save Game', 'Load Game'],
        (selected) => {
          switch (selected) {
            case 0:
              this.engine.newGame();
              // zzfx(...menuBlipSound);
              break;
            case 1:
              console.log('Continue');
              // Just close the menu
              // zzfx(...menuBlipSound);
              break;
            case 2:
              // saveGame(engine!);
              // zzfx(...menuBlipSound);
              break;
            case 3:
              try {
                // setEngine(loadGame());
                // zzfx(...menuBlipSound);
              } catch (err) {
                gui.add(new MessageDialog('Error', 'Could not load saved game'));
              }
              break;
          }
        },
      ),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update(_: Terminal): void {}

  onRender(term: Terminal): void {
    const centerX = Math.round(term.width / 2);
    const centerY = Math.round(term.height / 2);
    term.drawCenteredString(centerX, centerY - 8, 'TOMBS OF ANCIENT KINGS', Colors.MENU_TITLE);
    term.drawCenteredString(centerX, term.height - 2, 'By Cody Ebberson', Colors.MENU_TITLE);
  }
}
