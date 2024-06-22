import {Component, Inject } from '@angular/core';
import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ThemeDirective } from '../theme.directive';
import { CommonModule } from '@angular/common';
import { GamePlayerStatsComponent } from '../game-player-stats/game-player-stats.component';
import { Game, GamePlayerStats } from '../game';
import { Theme } from '../theme';
import { GameStatsComponent } from '../game-stats/game-stats.component';

interface DialogData {
  game: Game,
  theme?: Theme,
  stats: GamePlayerStats
}

@Component({
  selector: 'app-game-player-stats-dialog',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDivider, MatIconModule, MatInputModule, ThemeDirective, CommonModule, GameStatsComponent],
  templateUrl: './game-player-stats-dialog.component.html',
  styleUrl: './game-player-stats-dialog.component.scss'
})
export class GamePlayerStatsDialogComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData
  ){}
  close(){
    this.dialogRef.close();
  }
}
