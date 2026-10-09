import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcThree } from './fc-three';

describe('FcThree', () => {
  let component: FcThree;
  let fixture: ComponentFixture<FcThree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FcThree],
    }).compileComponents();

    fixture = TestBed.createComponent(FcThree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
