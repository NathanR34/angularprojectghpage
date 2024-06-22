import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Answer } from '../trivia';

@Component({
  selector: 'app-answer-tile',
  standalone: true,
  imports: [],
  templateUrl: './answer-tile.component.html',
  styleUrl: './answer-tile.component.scss'
})
export class AnswerTileComponent {
  @Input() state?: string = "";
  @Input() selection?: any = undefined;
  @Input() selector?: any = undefined;
  @Output() select = new EventEmitter<any>();
}
