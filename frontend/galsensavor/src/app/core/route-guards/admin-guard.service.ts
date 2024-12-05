import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CanActivate, Router } from "@angular/router";
import { map, Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

    constructor (private authService: AuthService, private router: Router){}

    canActivate() : Observable<boolean> {
        return this.authService.isAdmin.pipe(
            map((isAdmin) => {
                if(isAdmin) {
                    return true;
                }
                this.router.navigate(['/']);
                return false;
            }))
    }


}