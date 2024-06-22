import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PlayerService } from '../player.service';
import { MatButtonModule } from '@angular/material/button';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-player-menu',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, PlayerComponent],
  templateUrl: './player-menu.component.html',
  styleUrl: './player-menu.component.scss'
})
export class PlayerMenuComponent {
  constructor(public playerService: PlayerService){}
}
