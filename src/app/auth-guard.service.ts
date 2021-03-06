import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
// Import our authentication service
import { AuthService } from './auth.service';
import { User } from './user/user';

@Injectable()
export class AuthGuard implements CanActivate {

  private user: User;

  constructor(private auth: AuthService, private router: Router) { }

  canActivate() {
    if (!this.auth.authenticated()) {
      this.router.navigate(['/news/all']);
      return false;
    } else {
      if (this.auth.userProfile.role != '58cd45e0879f9e00c88747bf') {
        this.router.navigate(['/news/all']);
        return false;
      } else {
        return true;
      }
    }
  }
}
