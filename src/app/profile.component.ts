import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { WebService } from "./web.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private webService: WebService
  ) {}

  ngOnInit() {
    var getId = this.authService.getProfile().sub.split(`|`);
    this.webService.getUserComments(getId[1]);

    console.log();
  }

  /* Returns review types by id's */
  reviewType(id) {
    switch (id) {
      case 0:
        return "Negative";
      case 1:
        return "Positive";
      case 2:
        return "Neutral";
      default:
        return "Invalid value";
    }
  }
}
