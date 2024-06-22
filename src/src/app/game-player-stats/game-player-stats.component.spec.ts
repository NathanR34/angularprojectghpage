import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayerStatsComponent } from './game-player-stats.component';

describe('GamePlayerStatsComponent', () => {
  let component: GamePlayerStatsComponent;
  let fixture: ComponentFixture<GamePlayerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlayerStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamePlayerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
