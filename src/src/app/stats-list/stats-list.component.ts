import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ThemeDirective } from '../theme.directive';
import { CommonModule } from '@angular/common';
import { StatsComponent } from '../stats/stats.component';
import { PlayerStats } from '../player-stats';

@Component({
  selector: 'app-stats-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDivider, MatIconModule, MatInputModule, ThemeDirective, CommonModule, StatsComponent],
  templateUrl: './stats-list.component.html',
  styleUrl: './stats-list.component.scss'
})
export class StatsListComponent {
  @Input() stats?: PlayerStats;
}
