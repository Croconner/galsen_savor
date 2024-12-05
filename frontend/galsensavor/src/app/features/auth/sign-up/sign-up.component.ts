import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  
import { NgIf } from '@angular/common'; 
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackbarService } from '../../../core/services/snackbar.service';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [NgIf, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, ReactiveFormsModule, MatProgressSpinnerModule
  ]  
})
export class SignUpComponent {
  isLoading = false;

  constructor(private authService:AuthService, private router:Router, private snackBarService: SnackbarService){}
  
  form = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required]
    }),
    password: new FormControl('', {
      validators: [Validators.minLength(8), Validators.required]
 
    })
  });
  onSubmit() {
    //display loading spinner
    this.isLoading = true;
    //create user request
    const formValue = this.form.value
   const user : User =
   {
      id: 0,
      firstName: formValue.firstName as string,
      lastName: this.form.value.lastName as string,
      email: this.form.value.email as string,
      password: this.form.value.password as string,
    }
 
    // call the API
    this.authService.signUp(user).subscribe({
      next: () => {
        this.isLoading = false;
        this.form.controls["email"].setErrors(null);
        this.snackBarService.openSnackBar('Account Created Successfully! Log in to place an order.', "success");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.form.controls["email"].setErrors({emailFound:true});
        }
      }
    })
  }
}
