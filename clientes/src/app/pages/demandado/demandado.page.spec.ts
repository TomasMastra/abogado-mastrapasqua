import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandadoPage } from './demandado.page';

describe('DemandadoPage', () => {
  let component: DemandadoPage;
  let fixture: ComponentFixture<DemandadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
