import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../auth/change-password-dialog/change-password-dialog.component';
 
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
 
  firstName: string | undefined = '';
  lastName: string  | undefined = '';
  email: string  | undefined= '';
 
  constructor(private authService: AuthService, private dialog: MatDialog) { }
 
  ngOnInit(): void {
 
    this.authService.user.subscribe(user => {
      this.firstName = user?.firstName;
      this.lastName = user?.lastName;
      this.email = user?.email;
    })
  }
 
 
  changePassword() {
   this.dialog.open(ChangePasswordDialogComponent, {
    data: {email:this.email},
    width: '500px',
    height: '400px'
   });
  }
 
}