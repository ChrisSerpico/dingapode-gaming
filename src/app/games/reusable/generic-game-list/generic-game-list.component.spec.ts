import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericGameListComponent } from './generic-game-list.component';

describe('GenericGameListComponent', () => {
  let component: GenericGameListComponent;
  let fixture: ComponentFixture<GenericGameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericGameListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
