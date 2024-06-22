import {Component, Inject } from '@angular/core';
import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import { MatCardModule } from '@angular/material/card';
import { Player } from '../player';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { PlayerService } from '../player.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ThemeDirective } from '../theme.directive';
import { CommonModule } from '@angular/common';
import { StatsComponent } from '../stats/stats.component';
import { StatsListComponent } from '../stats-list/stats-list.component';

interface DialogData {
  player: Player;
}

@Component({
  selector: 'app-player-stats-dialog',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDivider, MatIconModule, MatInputModule, ThemeDirective, CommonModule, StatsListComponent],
  templateUrl: './player-stats-dialog.component.html',
  styleUrl: './player-stats-dialog.component.scss'
})
export class PlayerStatsDialogComponent {
  player: Player;
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
    public playerService: PlayerService
  ){
    this.player = this.data.player;
  }
  
  close(){
    this.dialogRef.close();
  }
}

