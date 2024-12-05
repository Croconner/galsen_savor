import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CanActivate, Router } from "@angular/router";
import { map, Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor (private authService: AuthService, private router: Router){}

    canActivate() : Observable<boolean> {
        return this.authService.isLogged.pipe(
            map((isLogged) => {
                if(!isLogged) {
                    this.router.navigate(['/']);
                    return false;
                }
                return true;
            }))

    }
}