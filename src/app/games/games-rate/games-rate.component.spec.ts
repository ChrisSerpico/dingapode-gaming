import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesRateComponent } from './games-rate.component';

describe('GamesRateComponent', () => {
  let component: GamesRateComponent;
  let fixture: ComponentFixture<GamesRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
