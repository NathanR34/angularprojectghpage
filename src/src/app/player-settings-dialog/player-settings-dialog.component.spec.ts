import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSettingsDialogComponent } from './player-settings-dialog.component';

describe('PlayerSettingsDialogComponent', () => {
  let component: PlayerSettingsDialogComponent;
  let fixture: ComponentFixture<PlayerSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSettingsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
