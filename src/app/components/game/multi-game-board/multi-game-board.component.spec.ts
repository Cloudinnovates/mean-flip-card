import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiGameBoardComponent } from './multi-game-board.component';

describe('MultiGameBoardComponent', () => {
  let component: MultiGameBoardComponent;
  let fixture: ComponentFixture<MultiGameBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiGameBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiGameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
