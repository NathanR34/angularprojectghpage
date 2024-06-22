import { Directive, ElementRef, Input } from '@angular/core';
import { Theme } from './theme';

@Directive({
  selector: '[appTheme]',
  standalone: true
})
export class ThemeDirective {
  @Input() appTheme?: Theme;
  constructor(private el: ElementRef) {}
  ngOnInit(){
    this.update();
  }
  ngOnChanges(){
    this.update();
  }
  update(){
    if(this.appTheme){
      let theme = this.appTheme;
      let elm: HTMLElement = this.el.nativeElement;
      
      if(theme.blur){
        elm.style.backdropFilter = `blur(${theme.blur})`;
        elm.style.backgroundColor = "#FFFFFF30";
      }
      elm.style.backgroundImage = theme.backgroundImage;
    }
  }
}
