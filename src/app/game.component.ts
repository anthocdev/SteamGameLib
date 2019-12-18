import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
  selector: "game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"]
})
export class GameComponent {
  commentForm;
  constructor(
    private webService: WebService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      username: [""],
      userid: [""],
      imageLink: [""],
      comment: ["", Validators.required],
      reviewType: 2
    });
    this.webService.getGame(this.route.snapshot.params.id);
    this.webService.getComments(this.route.snapshot.params.id);
  }

  onSubmit() {
    console.log(this.commentForm.valid);
    this.commentForm.controls["username"].setValue(
      this.authService.getProfile().nickname
    );
    var getId = this.authService.getProfile().sub.split(`|`); //Split auth0 from id
    this.commentForm.controls["userid"].setValue(getId[1]);
    this.commentForm.controls["imageLink"].setValue(
      this.authService.getProfile().picture
    );
    //console.log(this.commentForm.value);
    //console.log(this.authService.getProfile());
    this.webService.postComment(this.commentForm.value);
    this.commentForm.reset();
  }

  isInvalid(control) {
    return (
      this.commentForm.controls[control].invalid &&
      this.commentForm.controls[control].touched
    );
  }

  isUntouched() {
    return this.commentForm.controls.comment.pristine;
  }

  isIncomplete() {
    return this.isInvalid("comment") || this.isUntouched();
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

  canDelete(isAdmin, puid) {
    if (this.authService.loggedIn) {
      if (isAdmin) {
        return true;
      }
      var getId = this.authService.getProfile().sub.split(`|`);

      if (getId[1] == puid) {
        return true;
      }
    }

    return false;
  }

  canEdit(puid) {
    if (this.authService.loggedIn) {
      var getId = this.authService.getProfile().sub.split(`|`);
      if (getId[1] == puid) {
        return true;
      }
    }

    return false;
  }

  deleteComment(gid, cid) {
    this.webService.deleteComment(gid, cid);
    console.log(gid, cid);
  }

  editComment() {
    console.log("Comment Editing to be implemented.");
  }
}
