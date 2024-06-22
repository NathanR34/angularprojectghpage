import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { GameComponent } from '../game/game.component';
import { GameMenuComponent } from '../game-menu/game-menu.component';
import { PlayerMenuComponent } from '../player-menu/player-menu.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, GameComponent, GameMenuComponent, PlayerMenuComponent, MatCardModule, MatButtonModule],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer){
    iconRegistry.addSvgIcon("player-menu", sanitizer.bypassSecurityTrustResourceUrl("assets/icons/circle.svg"));
    iconRegistry.addSvgIcon("game-menu", sanitizer.bypassSecurityTrustResourceUrl("assets/icons/hexagon.svg"));
    iconRegistry.addSvgIcon("game", sanitizer.bypassSecurityTrustResourceUrl("assets/icons/game.svg"));
  }
}
