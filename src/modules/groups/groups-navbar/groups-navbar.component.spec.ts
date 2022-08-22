import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsNavbarComponent } from './groups-navbar.component';

describe('GroupsNavbarComponent', () => {
  let component: GroupsNavbarComponent;
  let fixture: ComponentFixture<GroupsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
