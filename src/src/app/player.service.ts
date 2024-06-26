import { Injectable, inject } from '@angular/core';
import { NameEdit, Player, PlayerAccount, PlayerI } from './player';
import { TriviaApiService } from './trivia-api.service';
import { GameService } from './game.service';
import { Dialog } from '@angular/cdk/dialog';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { PlayerSettingsDialogComponent } from './player-settings-dialog/player-settings-dialog.component';
import { Theme } from './theme';
import { PlayerStatsDialogComponent } from './player-stats-dialog/player-stats-dialog.component';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, User, GoogleAuthProvider, signInWithPopup, setPersistence } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getFirestore, setDoc } from '@angular/fire/firestore';

const googleAuthProvider = new GoogleAuthProvider();

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_ ";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  players: Player[] = [];
  maxPlayers: number = 3;
  amountTarget: number = 10;
  constructor(public triviaApi: TriviaApiService, public gameService: GameService, public dialog: Dialog) {}
  add(player?:Player){
    if(player && player.active){ return player;}
    if(this.players.length < 3){
      let id = this.getId();
      if(!player){
        player = new Player();
        player.name = this.createPlayerName();
        player.id = id;
      } else {
        player.id = id;
        if(this.getPlayerByName(player.name)){
          player.name = this.createPlayerName(player.name, Number(id)|1);
        }
        player.theme = new Theme(player.theme);
      }
      player.active = true;
      this.players.push(player);
      this.updateServices();
      return player;
    }
    return null;
  }
  remove(player: Player){
    this.logout(player);
    let i = this.players.indexOf(player);
    if(i>=0){
      this.players.splice(i, 1);
      player.active = false;
      this.updateServices();
      this.gameService.playerLeave.emit(player);
    }
  }
  logout(player: Player){
    player.account = undefined;
  }
  updateServices(){
    if(this.players.length){
      this.triviaApi.setAmount(
        Math.max(
          this.amountTarget - (this.amountTarget % this.players.length ), 
          this.players.length
        )
      );
    } else {
      this.triviaApi.setAmount(this.amountTarget);
    }
  }
  getId(){
    let id = 1;
    while(this.getPlayerById(id)){
      id++;
    }
    return id;
  }
  getPlayerByName(name: string){
    for(let player of this.players){
      if(player.name === name) return player;
    }
    return undefined;
  }
  getPlayerById(id: number){
    for(let player of this.players){
      if(player.id === id) return player;
    }
    return undefined;
  }
  createPlayerName(base: string = "Player", id: number=1){
    let name = `${base} ${id}`;
    while(this.getPlayerByName(name)){
      id++;
      name = `${base} ${id}`;
    }
    return name;
  }
  editPlayerName(player: Player, e: Event, nameEdit: NameEdit){
    if(e instanceof InputEvent){
      let event: InputEvent = e as InputEvent;
      if(event.target && event.target instanceof HTMLElement){
        let target = event.target as HTMLElement;
        let inputType = event.inputType;

        let accept = false;
        
        switch(inputType){
          case "insertText":
          case "deleteContentBackward":
            accept = true;
            break;
        }
        
        if(accept){
          nameEdit.value = target.innerText;
          if(nameEdit.value === player.name){
            nameEdit.value = undefined;
          }
        }
      }
    }
  }
  applyEdit(player: Player, event: Event, nameEdit: NameEdit){
    if(event instanceof FocusEvent){
      if(nameEdit.value){
        let input = nameEdit.value as string;
        this.changePlayerName(player, input);
      }
      nameEdit.value = undefined;
    }
  }
  changePlayerName(player: Player, name: string){
    let validName = "";
    for(let i=0; i<name.length; i++){
      let c = name.charAt(i);
      if(chars.includes(c)){
        validName += c;
        if(validName.length >= 20){ break }
      }
    }
    if(validName && !this.getPlayerByName(validName)){
      setTimeout(()=>{
        player.name = validName;
      })
      return validName;
    }
    return false;
  }
  async signIn(player: Player, data: {email: string, password: string}): Promise<{success: boolean, message?:string, code?:string}>{
    try {

      let auth = getAuth();
      let cred = await signInWithEmailAndPassword(auth, data.email, data.password);

      player.account = <PlayerAccount>{user:cred.user};
      return {success: true};

    } catch(error: any){
      let errorCode = error.code;
      if(!errorCode && String(errorCode) !== "0"){errorCode = ""}
      let errorMessage = String(error.message || "");
      return {success: false, message: errorMessage, code: errorCode};
    }
  }
  async signUp(player: Player, data: {email: string, password: string}): Promise<{success: boolean, message?:string, code?:string}>{
    try {

      let auth = getAuth();
      let cred = await createUserWithEmailAndPassword(auth, data.email, data.password);

      player.account = <PlayerAccount>{user:cred.user};
      return {success: true};

    } catch(error: any){
      let errorCode = error.code;
      if(!errorCode && errorCode !== 0){errorCode = ""}
      let errorMessage = String(error.message || "");
      return {success: false, message: errorMessage, code: errorCode};
    }
  }
  async signInWithGoogle(player: Player): Promise<{success: boolean, message?:string, code?:string, duplicate?: Player}>{
    
    try {

      let result = await signInWithPopup(this.auth, googleAuthProvider);

      //let cred = GoogleAuthProvider.credentialFromResult(result);
      //let token = cred?.accessToken;
      let duplicate;
      if(result.user.email){
        duplicate = this.getPlayerByAccount({email: result.user.email});
      }
      if(duplicate){
        return {success: true, duplicate: duplicate};
      } else {
        player.account = <PlayerAccount>{user:result.user};
        return {success: true}
      }
    } catch(error: any){
      let errorCode = error.code;
      if(!errorCode && errorCode !== 0){errorCode = ""}
      let errorMessage = String(error.message || "");

      //let email = error.customData.email;
      //let cred = GoogleAuthProvider.credentialFromError(error);

      return {success: false, message: errorMessage, code: errorCode};
    }
  }
  async setUserData(player: Player){
    try {
      if(player.account){
        let data = player.load();
        if(data){
          await setDoc(doc(this.firestore, "users", player.account.user.uid), data);
          console.log(player.name, "user data set", data);
          return true;
        }
      }
    } catch(err){
      console.log(err);
    }
    console.log(player.name, "failed to set user data");
    return false;
  }
  async loadUserData(player: Player){
    try {
      if(player.account){
        let ref = await getDoc(doc(this.firestore, "users", player.account.user.uid));
        let data = <PlayerI | undefined>ref.data();
        if(data){
          console.log(player.name, "loaded player data", data);
          player.apply(data);
          return true;
        }
      }
    } catch(err){
      console.log(err);
    }
    console.log(player.name, "failed to load user data");
    return false;
  }
  openLoginDialog(player: Player | null = null, {signUp=false, redirect=false, offerSettings=true}={}){
    this.dialog.open<string>(LoginDialogComponent, {
      minWidth: "20vw",
      data: { player, signUp, redirect, offerSettings }
    });
  }
  openSettingsDialog(player: Player){
    this.dialog.open<string>(PlayerSettingsDialogComponent, {
      width: "70vw",
      height: "50vw",
      panelClass: "contain",
      data: { player }
    });
  }
  openStatsDialog(player: Player){
    this.dialog.open<string>(PlayerStatsDialogComponent, {
      width: "70vw",
      height: "50vw",
      panelClass: "contain",
      data: { player }
    });
  }
  getPlayerByAccount(account:{email: string}|PlayerAccount) {
    for(let player of this.players){
      if(player.account){
        if(account === <PlayerAccount>player.account || player.account.user.email === (<{email:string}>account).email){
          return player;
        }
      }
    }
    return null;
  }
}
