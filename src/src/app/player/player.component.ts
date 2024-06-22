import { Component, Input } from '@angular/core';
import { Player } from '../player';
import { MatCardModule } from '@angular/material/card';
import { PlayerService } from '../player.service';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { ThemeDirective } from '../theme.directive';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, ThemeDirective],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  @Input() player!: Player;
  constructor(public playerService: PlayerService){}
  leave(){
    this.playerService.remove(this.player);
  }
  openSettings(){
    this.playerService.openSettingsDialog(this.player);
  }
  openStats(){
    this.playerService.openStatsDialog(this.player);
  }
}
