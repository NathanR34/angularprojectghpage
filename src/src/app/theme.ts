import { EventEmitter } from "@angular/core";

export interface ThemeI {
    color1: string;
    color2: string;
    blur: string;
}

class Color {
    static colors: Color[] = [];
    static random(): Color {
        return this.colors[Math.floor(Math.random()*this.colors.length)];
    }
    static find(color: string){
        for(let c of this.colors){
            if(c.color === color){
                return c;
            }
        }
        return null;
    }
    static create(color: string){
        let c = this.find(color);
        if(!c){
            c = new Color(color);
        }
        return c;
    }
    static add(color: Color){
        if(!this.find(color.color)){
            this.colors.push(color);
        }
    }
    alike: Color[] = [];
    constructor(public color: string){
        Color.add(this);
    }
    random(){
        return this.alike[Math.floor(Math.random()*this.alike.length)];
    }
    find(color: string){
        for(let c of this.alike){
            if(c.color === color){
                return c;
            }
        }
        return null;
    }
    add(...colors: string[]){
        for(let color of colors){
            if(!this.find(color)){
                let c = Color.create(color);
                this.alike.push(c);
                c.add(this.color);
            }
        }
        return this;
    }
    addList(...lists: ColorList[]){
        for(let list of lists){
            this.add(...list);
        }
    }
}

class ColorList {
    colors: Color[] = [];
    constructor(...colors: string[]){
        if(colors.length){
            this.create(...colors);
        }
    }
    find(color: string){
        for(let c of this.colors){
            if(c.color === color){
                return c;
            }
        }
        return null;
    }
    create(...colors: string[]){
        for(let color of colors){
            if(!this.find(color)){
                this.colors.push(Color.create(color));
            }
        }
        return this;
    }
    add(...colors: string[]){
        for(let color of this.colors){
            color.add(...colors);
        }
        return this;
    }
    addList(...lists: ColorList[]){
        for(let list of lists){
            this.add(...list);
        }
    }
    *[Symbol.iterator](){
        for(let color of this.colors){
            yield color.color;
        }
    }
}
(new ColorList("#02BACB", "#00FF00")).add("#ffffff");
(new ColorList("#FF0000")).add("#000000");
(new ColorList("#002272", "#2A3E74", "#0000FF")).add("#000000", "#ffffff");
Color.create("#555555").add("#ffffff");
Color.create("#999999").add("#000000");

export class Theme implements ThemeI {
    static get(name: string){
        if(name in this.themes){
            return this.themes[name];
        }
        return undefined;
    }
    static themes: {[key:string]: Theme} = {}
    static random(): Theme {
        let theme = new Theme();
        let color1 = Color.random();
        let color2 = color1.random();
        theme.color1 = color1.color;
        theme.color2 = color2.color;
        return theme;
    }

    color1: string = "#ffffff";
    color2: string = "#000000";
    blur: string = "5px";
    get backgroundImage(){
        return `linear-gradient(130deg, ${this.color1}55, ${this.color2}55)`;
    }

    constructor(from?:ThemeI){
        if(from){
           this.apply(from);
        }
    }
    matches(match: {[index:string]:any}){
        let theme: any = <ThemeI>this;
        for(let key in match){
            if(theme[key] !== match[key]){
                return false
            }
        }
        return true;
    }
    overlay(overlay:{[index:string]:{}}){
        if(!this.matches(overlay)){
            let theme = new Theme(<ThemeI>this);
            Object.assign(theme, overlay);
            return theme;
        }
        return this;
    }
    apply(data: ThemeI){
        this.color1 = data.color1 || this.color1;
        this.color2 = data.color2 || this.color2;
        this.blur = data.blur || "";
    }
    load(){
        return <ThemeI>{
            color1: this.color1,
            color2: this.color2,
            blur: this.blur
        }
    }
}