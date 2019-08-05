import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartManipulateComponent } from './chart-manipulate.component';

describe('ChartManipulateComponent', () => {
  let component: ChartManipulateComponent;
  let fixture: ComponentFixture<ChartManipulateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartManipulateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartManipulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
