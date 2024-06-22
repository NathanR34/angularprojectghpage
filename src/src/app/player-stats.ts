
import { TriviaData } from "./trivia";

export interface StatCategoriesI { [key:string]:DifficultyI };
export interface StatCategories { [key:string]:Difficulty };

export interface PlayerStatsI {categories: StatCategoriesI}

export interface DifficultyI {
    easy?: number, 
    medium?: number,
    hard?: number
}

export class Difficulty implements DifficultyI {
    easy: number = 0;
    medium: number = 0;
    hard: number = 0;
    constructor(from?: DifficultyI){
        if(from){
            this.apply(from);
        }
    }
    apply(data: DifficultyI){
        this.easy = data.easy || 0;
        this.medium = data.medium || 0;
        this.hard = data.hard || 0;
    }
    load(): DifficultyI {
        let data: DifficultyI = {};
        if(this.easy){
            data.easy = this.easy;
        }
        if(this.medium){
            data.medium = this.medium;
        }
        if(this.hard){
            data.hard = this.hard;
        }
        return data;
    }
    add(data: DifficultyI){
        this.easy += data.easy || 0;
        this.medium += data.medium || 0;
        this.hard += data.hard || 0;
    }
    get points(){
        return this.easy + this.medium + this.hard;
    }
}

export class PlayerStats implements PlayerStatsI {
    categories: StatCategories = {};
    constructor(from?: PlayerStatsI){
        if(from){
            this.apply(from);
        }
    }
    *[Symbol.iterator](){
        for(let category in this.categories){
            yield this.categories[category];
        };
    }
    add(category: string, difficulty: DifficultyI){
        let d = this.get(category);
        d.add(difficulty);
    }
    addTriviaStat(trivia: TriviaData){
        this.add(trivia.category, {[trivia.difficulty]: 1});
        console.log(this);
    }
    addStats(stats: PlayerStatsI){
        for(let category in stats.categories){
            this.add(category, stats.categories[category]);
        }
    }
    *categoryList(){
        for(let category in this.categories){
            yield category;
        }
    }
    get(category: string){
        let d;
        if(!(category in this.categories)){
            d = new Difficulty();
            this.categories[category] = d;
        } else {
            d = this.categories[category]
        }
        return d;
    }
    apply(data: PlayerStatsI){
        if(data.categories){
            for(let category in data.categories){
                this.categories[category] = new Difficulty(data.categories[category]);
            }
        }
    }
    load(){
        let categories: StatCategoriesI = {};
        for(let category in this.categories){
            categories[category] = this.categories[category].load();
        }
        return <PlayerStatsI>{
            categories: categories
        }
    }
    get points(){
        let points = 0;
        for(let difficulty of this){
            points += difficulty.points;
        }
        return points;
    }
}
