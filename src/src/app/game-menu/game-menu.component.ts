import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TriviaApiService } from '../trivia-api.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { PlayerService } from '../player.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule, MatSlideToggleModule, MatButtonModule, MatSliderModule],
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.scss'
})
export class GameMenuComponent {
  constructor(public api: TriviaApiService, public playerService: PlayerService, public gameService: GameService){}

  setAmount(value: number){
    this.api.setAmount(value);
    this.playerService.amountTarget = this.api.amount;
  }
  endGame(){
    this.gameService.endGame.emit();
  }
}
