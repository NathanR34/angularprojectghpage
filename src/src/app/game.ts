import { Player } from "./player";
import { PlayerStats } from "./player-stats";
import { PlayerService } from "./player.service";
import { Answer, Trivia, TriviaData } from "./trivia";

export class QuestionData {
    data: TriviaData;
    answers: Answer[] = [];
    correct: Answer;
    player?: Player;
    stats: GamePlayerStats;
    constructor(game: Game, trivia: Trivia, player: Player | undefined){
        this.data = <TriviaData>trivia;
        this.player = player;
        this.stats = game.stats.get(player) || (new GamePlayerStats(player));
        for(let answer of trivia.incorrect_answers){
            this.answers.push({answer});
        }
        this.correct = {answer:trivia.correct_answer}
        this.answers.push(this.correct);

    }
    mix(){
        for(let i in this.answers){
            let swap = Math.floor(Math.random()*this.answers.length);
            let answer = this.answers[swap];
            this.answers[swap] = this.answers[i];
            this.answers[i] = answer;
        }
        return this;
    }
    sort(reverse: boolean = false){
        this.answers.sort((a,b)=>{
            if(a.answer === b.answer) { return 0; }
            if(a.answer < b.answer) { return reverse?1:-1; }
            return reverse?-1:1;
        });
        return this;
    }
};

export class Game {
    currentTrivia: number = 0;
    currentPlayer: number = 0;
    players: Player[];
    trivia: Trivia[];
    stats: GameStats;
    constructor(players: Player[]=[], trivia: Trivia[]=[]){
        this.players = [...players];
        this.trivia = [...trivia];
        this.stats = new GameStats(this.players);
    }
    get size(): number {
        if(this.players.length === 0){ return this.trivia.length }
        return this.trivia.length - ( this.trivia.length % this.players.length );
    }
    get playerSize(): number {
        if(this.players.length === 0){ return this.trivia.length}
        return Math.floor(this.size / this.players.length);
    }
    next(): QuestionData | null {
        let player: Player | undefined = this.nextPlayerFilterUnactive();
        if(this.currentTrivia >= this.size ){ return null }
        let trivia: Trivia = this.trivia[this.currentTrivia];
        this.currentTrivia++;

        let data: QuestionData = new QuestionData(this, trivia, player);
        if(data.data.type === "boolean"){
            data.sort(true);
        } else {
            data.sort().mix();
        }

        return data;
    }
    protected nextPlayerFilterUnactive(): Player | undefined {
        let player = this.nextPlayer();
        while(player && !player.active){
            this.removePlayer(player);
            player = this.nextPlayer();
        }
        return player;
    }
    protected nextPlayer(): Player | undefined {
        let player: Player | undefined = undefined;
        if(this.players.length){
            player = this.players[this.currentPlayer];
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
            return player;
        }
        return undefined;
    }
    removePlayer(player: Player){
        let i = this.players.indexOf(player);
        if(i>=0){
            this.players.splice(i, 1);
            if(this.players.length){
                if(this.currentPlayer > i){
                    this.currentPlayer--;
                }
                this.currentPlayer = this.currentPlayer % this.players.length;
            }
        }
    }
}

export class GamePlayerStats {
    correct: PlayerStats = new PlayerStats();
    incorrect: PlayerStats = new PlayerStats();
    answered: number = 0;
    constructor(public player?: Player){}
    reward(trivia: TriviaData, correct: boolean){
        let stats = correct? this.correct:this.incorrect;
        stats.addTriviaStat(trivia);
        this.answered++;
    }
}

export class GameStats {
    stats: Map<Player, GamePlayerStats> = new Map<Player, GamePlayerStats>();
    correct: number = 0;
    incorrect: number = 0;
    answered: number = 0;
    default: GamePlayerStats = new GamePlayerStats();
    get(player: Player | undefined){
        if(player){
            return this.stats.get(player);
        } else {
            return this.default;
        }
    }
    *[Symbol.iterator](){
        yield* this.stats.values();
    }
    ordered(){
        return [...this].sort((a,b)=>{return b.correct.points-a.correct.points});
    }
    constructor(public players: Player[]){
        for(let player of players){
            this.stats.set(player, new GamePlayerStats(player));
        }
    }
    reward(player: Player | undefined, trivia: TriviaData, correct: boolean){
        if(player){
            let stats = this.get(player);
            if(stats){
                stats.reward(trivia, correct);
            }
        }
        if(correct){
            this.correct++;
        } else {
            this.incorrect++;
        }
        this.answered++;
    }
    applyStats(playerService: PlayerService){
        for(let player of this.players){
            let stats = this.get(player);
            if(stats){
                player.stats.addStats(stats.correct);
                playerService.setUserData(player);
            }
        }
    }
}
