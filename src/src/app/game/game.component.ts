import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Answer } from '../trivia';
import { AnswerTileComponent } from '../answer-tile/answer-tile.component';
import { Player } from '../player';
import { MatDividerModule } from '@angular/material/divider';
import { Game, QuestionData } from '../game';
import { TriviaApiService } from '../trivia-api.service';
import { PlayerService } from '../player.service';
import { GameService } from '../game.service';
import { ThemeDirective } from '../theme.directive';
import { Theme } from '../theme';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GamePlayerStatsComponent } from '../game-player-stats/game-player-stats.component';
import { GameStatsComponent } from '../game-stats/game-stats.component';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatGridListModule, AnswerTileComponent, MatDividerModule, ThemeDirective, MatProgressBarModule, GamePlayerStatsComponent, GameStatsComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent {
  state: string = "";
  parser = document.createElement("textarea");
  selection?: Answer;
  answered: boolean = false;
  question: QuestionData | null = null;
  game: Game | null = null;
  creatingGame: boolean = false;
  finished: boolean = false;
  constructor(public triviaApi: TriviaApiService, public playerService: PlayerService, public gameService: GameService){
    gameService.endGame.subscribe(()=>{this.endGame()})
    gameService.playerLeave.subscribe((player)=>{this.playerLeave(player)})
    this.next();
  }
  endGame(){
    this.game = null;
    this.question = null;
    this.answered = false;
    this.selection = undefined;
    this.finished = false;
  }
  playerLeave(player: Player){
    if(this.game){
      this.game.removePlayer(player);
      if(this.question && this.question.player === player){
        this.question = null;
        this.next();
      }
    }
  }
  parse(text: string){
    this.parser.innerHTML = text;
    text = this.parser.innerText;
    this.parser.innerHTML = "";
    return text;
  }
  select(answer: Answer){
    if(!this.answered){
      this.selection = this.selection===answer? undefined : answer;
    }
  }
  submit(){
    if(this.game && this.question){
      if(this.answered){
        this.next();
        this.answered = false;
      } else {
        this.answered = true;
        let correct = this.selection === this.question.correct;
        if(this.question.stats){
          this.game.stats.reward(this.question.player, this.question.data, correct);
        }
      }
    }
  }
  async startGame(){
    if(!this.game && !this.creatingGame){
      this.creatingGame = true;
      let game = await this.triviaApi.createGame(this.playerService.players);
      this.game = game;
      this.creatingGame = false;
      this.next();
    }
  }
  finishGame(){
    if(this.game && this.finished){
      for(let stats of this.game.stats){
        console.log(JSON.stringify(stats.correct.load()));
      }
      this.game.stats.applyStats(this.playerService);
      for(let player of this.game.players){
        console.log(JSON.stringify(player.load()));
      }
    }
  }
  next(){
    if(this.game){
      let data = this.game.next();
      if(data){
        this.question = data;
      } else {
        this.finished = true;
        this.finishGame();
      }
    }
  }
  getTileState(answer: Answer){
    if(this.answered && this.question){
      return (answer === this.question.correct)? "correct" : "incorrect";
    }
    return "";
  }
  defaultTheme = new Theme();
  get questionTheme(){
    if(this.question && this.question.player){
      return this.question.player.theme;
    } else {
      return this.defaultTheme;
    }
  }
}
