import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayerStatsDialogComponent } from './game-player-stats-dialog.component';

describe('GamePlayerStatsDialogComponent', () => {
  let component: GamePlayerStatsDialogComponent;
  let fixture: ComponentFixture<GamePlayerStatsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlayerStatsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamePlayerStatsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
