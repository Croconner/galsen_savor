import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
 
@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent implements OnInit {
 
  onEmitStatusChange = new EventEmitter();
  details:any = {};
 
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any) {}
 
  ngOnInit(): void {
      if (this.dialogData && this.dialogData.confirmation) {
        this.details = this.dialogData;
      }
  }
 
  handleChangeAction() {
    this.onEmitStatusChange.emit();
  }
 
}