import { EventEmitter, Injectable } from '@angular/core';
import { Player } from './player';
import { Game, GamePlayerStats } from './game';
import { Dialog } from '@angular/cdk/dialog';
import { GamePlayerStatsDialogComponent } from './game-player-stats-dialog/game-player-stats-dialog.component';
import { Theme } from './theme';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  playerLeave: EventEmitter<Player> = new EventEmitter<Player>();
  endGame: EventEmitter<undefined> = new EventEmitter<undefined>();
  constructor(public dialog: Dialog) { }
  openPlayerDataDialog(game: Game, stats: GamePlayerStats, theme?: Theme){
    this.dialog.open<string>(GamePlayerStatsDialogComponent, {
      width: "70vw",
      height: "50vw",
      panelClass: "contain",
      data: { game, stats, theme }
    });
  }
}
