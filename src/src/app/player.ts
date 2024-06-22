import { Theme, ThemeI } from "./theme";
import { PlayerStats, PlayerStatsI } from "./player-stats";
import { User } from "@angular/fire/auth";

export interface PlayerI {
    name: string,
    theme: ThemeI,
    stats: PlayerStatsI
}

export class Player implements PlayerI {
    name = "Player";
    theme: Theme = new Theme();
    stats: PlayerStats = new PlayerStats();
    account?: PlayerAccount;
    id: number = 0;
    active: boolean = false;
    constructor(from?: PlayerI){
        if(from){
            this.apply(from);
        } else {
            this.theme = Theme.random();
        }
    }
    apply(data: PlayerI){
        this.name = data.name || this.name;
        this.theme = new Theme(data.theme);
        this.stats = new PlayerStats(data.stats);
    }
    load(){
        return <PlayerI>{
            name: this.name,
            theme: this.theme.load(),
            stats: this.stats.load()
        }
    }
}

(<any>window).Player = Player;

export interface NameEdit {
    value: string | undefined;
}

export interface PlayerAccount {
    user: User
}