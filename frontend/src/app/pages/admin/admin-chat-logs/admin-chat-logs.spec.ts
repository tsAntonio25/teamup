import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChatLogs } from './admin-chat-logs';

describe('AdminChatLogs', () => {
  let component: AdminChatLogs;
  let fixture: ComponentFixture<AdminChatLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChatLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChatLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
