import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { MenuListComponent } from './features/menu/menu-list/menu-list.component';
import { HomeComponent } from './features/home/home.component';
import { CartViewComponent } from './features/cart/cart-view/cart-view.component';
import { OrderHistoryComponent } from './features/order/order-history/order-history.component'; 
import { AuthGuardService } from './core/route-guards/auth-guard.service';
import { AdminGuardService } from './core/route-guards/admin-guard.service';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'menu', component: MenuListComponent },
   { path: 'cart', component: CartViewComponent, canActivate: [AuthGuardService]},
   { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuardService] },
   { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
   { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuardService]},
];
