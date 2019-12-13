import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
@Component({
  selector: "navigation",
  templateUrl: "./nav.component.html",
  styleUrls: []
})
export class NavComponent {
  constructor(private authService: AuthService) {}

  getProfile() {
    var profileData = null;
    if (this.authService.loggedIn) {
      this.authService.userProfile$.forEach(item => {
        profileData = item;
      });
    }
    return profileData;
  }
}
