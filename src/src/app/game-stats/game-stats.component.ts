import { Component, Input } from '@angular/core';
import { Game } from '../game';
import { GamePlayerStatsComponent } from '../game-player-stats/game-player-stats.component';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [GamePlayerStatsComponent],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.scss'
})
export class GameStatsComponent {
  @Input() game?: Game;
  *getPlayerStats(){
    if(this.game && this.game.stats){
      yield* this.game.stats.ordered()
    }
  }
}
