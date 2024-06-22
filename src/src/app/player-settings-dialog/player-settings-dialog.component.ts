
import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import { MatCardModule } from '@angular/material/card';
import { NameEdit, Player } from '../player';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { PlayerService } from '../player.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ThemeDirective } from '../theme.directive';

function select(element: Element){
  let selection = window.getSelection();
  let range = document.createRange();
  range.selectNodeContents(element);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export interface DialogData {
  player: Player;
}

@Component({
  selector: 'app-player-settings-dialog',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDivider, MatIconModule, MatInputModule, ThemeDirective],
  templateUrl: './player-settings-dialog.component.html',
  styleUrl: './player-settings-dialog.component.scss'
})
export class PlayerSettingsDialogComponent {
  player: Player;
  nameEdit: NameEdit = {value:this.data.player.name};
  editNameMode: boolean = false;
  @ViewChild("namefield") nameField?: ElementRef;
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
    public playerService: PlayerService
  ){
    this.player = data.player;
    let player = data.player;
    dialogRef.closed.subscribe(()=>{
      console.log(playerService, player);
      playerService.setUserData(player);
    });
  }
  onClose(){
    
    this.playerService.setUserData(this.player);
  }
  startNameEdit(){
    this.editNameMode = true;
    if(this.nameField){
      this.nameField.nativeElement.contentEditable = true;
      this.nameField.nativeElement.focus();
      select(this.nameField.nativeElement);
    }
  }
  endNameEdit(event?: Event){
    this.editNameMode = false;
    if(event){
      this.playerService.applyEdit(this.player, event, this.nameEdit);
    }
  }
  nameEditKeyboardEvent(event: KeyboardEvent){
    if(event.code === "Enter"){
      this.endNameEdit();
    }
  }
  applyColor1(event: Event){
    if(event.target && event.target instanceof HTMLInputElement){
      let value = (<HTMLInputElement>event.target).value;
      this.player.theme = this.player.theme.overlay({color1:value});
    }
  }
  applyColor2(event: Event){
    if(event.target && event.target instanceof HTMLInputElement){
      let value = (<HTMLInputElement>event.target).value;
      this.player.theme = this.player.theme.overlay({color2:value});
    }
  }
  close(){
    this.dialogRef.close();
  }
  login(){
    this.playerService.openLoginDialog(this.player, {offerSettings: false})
  }
  logout(){
    this.playerService.logout(this.player);
  }
}
