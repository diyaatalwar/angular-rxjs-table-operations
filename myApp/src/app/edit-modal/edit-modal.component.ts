import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css'
})
export class EditModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
