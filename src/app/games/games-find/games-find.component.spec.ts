import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesFindComponent } from './games-find.component';

describe('GamesFindComponent', () => {
  let component: GamesFindComponent;
  let fixture: ComponentFixture<GamesFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesFindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
