import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgIf
  ]
})
export class LoginComponent {
  isLoading = false;
  loginFailed = false;

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)]
    })
  });

  constructor(private authService: AuthService,
     private router: Router, 
     private dialog: MatDialog,
     private snackBarService: SnackbarService) {}

  onSubmit() {
    this.isLoading = true;
    this.loginFailed = false;

    const formValue = this.form.value;
    
    // Call the API for login
    this.authService.login(formValue.email!, formValue.password!).subscribe({
      next: () => {
        this.isLoading = false;
        this.form.controls["email"].setErrors(null);
        this.form.controls["password"].setErrors(null);
        
        const isAdmin = this.authService.isAdmin.getValue();
        if(isAdmin) {
          this.router.navigate(['/dashboard']); // Navigate Admin to Dashboard upon successful login
        } else {
            this.router.navigate(['/menu']); // Navigate Customer to menu upon successful login
        }
        this.snackBarService.openSnackBar('Login Successful!', "success");
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.form.controls["email"].setErrors({emailNotFound:true});
        } else if (err.status === 401) {
          this.form.controls["password"].setErrors({passwordMismatch:true});
        } else {
          this.loginFailed = true;
        }
      }
    });
  }
}
