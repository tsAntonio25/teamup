import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuest } from './admin-quest';

describe('AdminQuest', () => {
  let component: AdminQuest;
  let fixture: ComponentFixture<AdminQuest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminQuest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQuest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
