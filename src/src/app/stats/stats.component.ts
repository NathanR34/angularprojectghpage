import { Component, Input } from '@angular/core';
import { Difficulty } from '../player-stats';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  @Input() stats!: Difficulty;
  @Input() category!: string;
  
}
