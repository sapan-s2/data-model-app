import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErDiagramComponent } from './er-diagram.component';

describe('ErDiagramComponent', () => {
  let component: ErDiagramComponent;
  let fixture: ComponentFixture<ErDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
