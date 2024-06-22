import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StatsListComponent } from '../stats-list/stats-list.component';
import { Game, GamePlayerStats } from '../game';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeDirective } from '../theme.directive';
import { Theme } from '../theme';

@Component({
  selector: 'app-game-player-stats',
  standalone: true,
  imports: [MatCardModule, StatsListComponent, MatDividerModule, ThemeDirective],
  templateUrl: './game-player-stats.component.html',
  styleUrl: './game-player-stats.component.scss'
})
export class GamePlayerStatsComponent {
  @Input() stats!: GamePlayerStats;
  @Input() game!: Game;
  @Input() theme?: Theme;
}
