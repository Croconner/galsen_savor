import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
     NgIf,
    MatIconModule, MatButtonModule
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss'
})
export class ChangePasswordDialogComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  isLoading = false;


  constructor(private authService: AuthService, 
    private snackbarService: SnackbarService,
    public dialogRef:MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{email:string}) {
    }

    
  ngOnInit(): void {  
    this.form = new FormGroup({
      newPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)]
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)]
      })
    }, {validators: this.passwordMismatch()});
  }


  passwordMismatch(): ValidatorFn  {
    return (control: AbstractControl): ValidationErrors | null => {
      const match = control.get('confirmPassword')?.value !== control.get('newPassword')?.value;
      return match ? {passwordMismatch: true} : null;
    };
  }
  onSubmit() {
      this.isLoading = true;
      console.log(this.form.value)
      this.authService.updatePassword(this.data.email, this.form.value.confirmPassword!).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close();
          this.snackbarService.openSnackBar('Password is successfully changed!', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.snackbarService.openSnackBar(err.error.message, 'error');
        }
      });

  }

}
