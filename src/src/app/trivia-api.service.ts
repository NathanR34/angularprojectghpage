import { EventEmitter, Injectable } from '@angular/core';
import { Trivia, TriviaApiResponse, TriviaApiTokenResetResponse, TriviaApiTokenResponse, TriviaCategory, TriviaCategoryApiResponse } from './trivia';
import { Player } from './player';
import { Game } from './game';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, firstValueFrom, take, single, filter } from 'rxjs';


const API_URL = "https://opentdb.com";

async function timer(ms: number){
  let resolveFn: (value: unknown)=>void;
  let promise = new Promise((resolve)=>{
    resolveFn = resolve;
  });
  setTimeout(()=>{resolveFn(true)}, ms);
  return await promise;
}

type refKey = any;
interface LoadRequest {
  type: string
}

@Injectable({
  providedIn: 'root'
})
export class TriviaApiService {
  categoriesLoaded: boolean = false;
  isLoading: boolean = false;
  loadEmitter: EventEmitter<LoadRequest> = new EventEmitter<LoadRequest>();
  loaded: WeakMap<LoadRequest, any> = new WeakMap<LoadRequest, any>();
  loadRequests: Set<LoadRequest> = new Set<LoadRequest>;
  categories: {[type:string]:TriviaCategory} = {};
  session: string | undefined | null = undefined;
  reloadSession: boolean = false;
  amount: number = 10;
  category: string = "";
  type: string = "";
  //encoding: string = "";
  difficulty: string = "";

  apiStatus: string = "not loading";
  apiLastUsed: number = 0;

  constructor(private http: HttpClient) {
    this.loadResources();
  }
  async apiWait(){
    let time = this.apiLastUsed - Date.now() + 5100;
    while(time > 100){
      this.apiStatus = "waiting for api to open";
      await timer(time);
      time = this.apiLastUsed - Date.now() + 5100;
    }
    this.apiStatus = "waiting for resources";
    return;
  }
  async applyUsedApi(){
    this.apiLastUsed = Date.now();
    this.apiStatus = "loading";
  }
  importCategories(categories: TriviaCategory[]){
    for(let category of categories){
      this.categories[category.name] = category;
    }
  }
  *iterateCategoryKeys(){
    for(let key in this.categories){
      yield key;
    }
  }
  getCategoryName(key: string){
    let name = this.categories[key].name;
    name = name[0].toUpperCase() + name.slice(1);
    return name;
  }
  requestResource(request: LoadRequest){
    this.loadRequests.add(request);
    this.loadResources();
  }
  finishLoad(request: LoadRequest, value: any){
    this.loaded.set(request, value);
    this.loadRequests.delete(request);
    this.loadEmitter.emit(request);
  }
  async takeLoaded(request: LoadRequest){
    if(!this.loaded.has(request)){
      let resource = this.loadEmitter.pipe(filter((loadedRequest) => {
        return loadedRequest === request;
    }));
      await firstValueFrom(resource);
    }
    let value: any = this.loaded.get(request);
    this.loaded.delete(request);
    return value;
  }
  async load(request: LoadRequest){
    this.requestResource(request);
    return await this.takeLoaded(request);
  }
  cancleLoad(request: LoadRequest){
    this.loadRequests.delete(request);
  }
  async loadResources(){
    if(!this.isLoading){
      this.isLoading = true;
      let reloadResources = false;
      if(this.session === null){
        this.session = await this.loadSessionToken() || null;
        if(this.session === null){ reloadResources = true; }
      }
      if(this.session && this.reloadSession){
        let result = await this.requestSessionReload();
        if(result){
          this.reloadSession = false;
        } else {
          reloadResources = true;
        }
      }
      if(this.loadRequests.size > 0){
        for(let request of this.loadRequests){
          switch(request.type){
            case "trivia":
              let trivia = await this.loadTrivia();
              if(trivia !== null){
                this.finishLoad(request, trivia);
              } else {
                reloadResources = true;
              }
              break;
            default:
              this.cancleLoad(request);
          }
        }
      }
      if(!this.categoriesLoaded){
        let categories = await this.loadCategories();
        if(categories && categories.length){
          this.importCategories(categories);
          this.categoriesLoaded = true;
        } else {
          reloadResources = true;
        }
      }
      this.isLoading = false;
      if(reloadResources){
        setTimeout(()=>{this.loadResources()}, 500);
      }
    }
  }
  async requestSessionReload(): Promise<boolean> {
    if(this.session){
      try {
        await this.apiWait();
        let response = await firstValueFrom(this.http.get<TriviaApiTokenResetResponse>(`${API_URL}/api.php?command=reset&token=${this.session}`));
        this.applyUsedApi();
        if(response.response_code === 0){
          if(response.token){
            this.session = response.token;
            return true;
          }
        } else {
          this.respondToResponseCode(response.response_code);
          return false;
        }
      } catch(err){
        this.applyUsedApi();
        return false;
      }
    }
    return false;
  }
  respondToResponseCode(code: number){
    switch(code){
      case 1:
        console.warn("Query is too large according to api response code");
        break;
      case 2:
        console.warn("Invalid parameter according to api response code");
        break;
      case 3:
        // Invalid session
        this.session = null;
        break;
      case 4:
        // Session ran out of unique data
        this.reloadSession = true;
        break;
      case 5:
        // Either there is a api over-use problem (more than once every 5 seconds) or another is using the api on the same ip address
        // not severe, waiting till next reload
        break;
      default:
        // A sucess (0) or an unknown code
        break;
    }
  }
  async loadTrivia(): Promise<Trivia[] | null>{

    let url = new URL(`${API_URL}/api.php`);

    url.searchParams.append("amount", String(this.amount));
    if(this.category){
      let category = this.categories[this.category];
      if(category){
        url.searchParams.append("category", String(category.id));
      }
    }
    if(this.type){ url.searchParams.append("type", this.type); }
    if(this.difficulty){ url.searchParams.append("difficulty", this.difficulty); }
    //if(false){ url.searchParams.append("encoding", ""); }
    if(this.session){ url.searchParams.append("token", this.session); }

    try {
      await this.apiWait();
      let response = this.http.get<TriviaApiResponse>(String(url));
      this.applyUsedApi();
      let data = await firstValueFrom(response);

      if(data.response_code === 0){
        return (data.results || null);
      } else {
        this.respondToResponseCode(data.response_code);
        return null;
      }
    } catch(err){
      this.applyUsedApi();
      return null;
    }
  }
  async loadSessionToken(): Promise<string|null>{
    if(this.session){
      try {
        await this.apiWait();
        let response = await firstValueFrom(this.http.get<TriviaApiTokenResponse>(`${API_URL}/api.php?command=request`));
        this.applyUsedApi();
        if(response.token){
          return response.token;
        }
      } catch(err){
        this.applyUsedApi();
        return null;
      }
    }
    return null;
  }

  async loadCategories(): Promise<TriviaCategory[]>{
    try {
      await this.apiWait();
      let response = await firstValueFrom(this.http.get<TriviaCategoryApiResponse>(`${API_URL}/api_category.php`));
      this.applyUsedApi();
      if(response && response.trivia_categories){
        return response.trivia_categories;
      }
    } catch(err){
      this.applyUsedApi();
    }
    return [];
  }
  
  setAmount(amount: number){
    amount = Math.floor(Number(amount))||1;
    if(amount < 1){
      amount = 1;
    } else if(amount > 50){
      amount = 50;
    }
    this.amount = amount;
  }
  useSession(active: boolean=true){
    if(active){
      if(!this.session){
        this.session = null;
      }
    } else {
      this.session = undefined;
    }
  }
  dropSession(){
    if(this.session){
      this.session = null;
    }
  }
  resetSession(){
    this.reloadSession = true;
  }
  setCategory(category: string | undefined){
    if(category && category in this.categories){
      this.category = category;
    } else {
      this.category = "";
    }
  }
  setDifficulty(difficulty: string){
    switch(difficulty){
      case "easy":
      case "medium":
      case "hard":
        this.difficulty = difficulty;
        break;
      default:
        this.difficulty = "";
        break;
    }
  }
  setType(type: string | undefined){
    switch(type){
      case "multiple":
      case "boolean":
        this.type = type;
        break;
      default:
        this.type = "";
        break;
    }
  }
  async createGame(players: Player[]): Promise<Game | null>{
    let trivia: Trivia[] = await this.load({type: "trivia"});
    let overflow = trivia.length % players.length;
    if(overflow){
      trivia = trivia.slice(0, trivia.length - overflow);
    }
    return new Game(players, trivia);
  }
  /*setEncoding(encoding: string | undefined){
    //base64, url3986
    //this.encoding = encoding;
  }*/
}
