import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuDialogComponent } from './add-menu-dialog.component';

describe('AddMenuDialogComponent', () => {
  let component: AddMenuDialogComponent;
  let fixture: ComponentFixture<AddMenuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMenuDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMenuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
