import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";
import { MatDialog } from "@angular/material/dialog";
import { EditCommentComponent } from "./Dialog/editcomment.component";

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
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  appid;
  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      username: [""],
      userid: [""],
      imageLink: [""],
      comment: ["", Validators.required],
      reviewType: 2
    });
    this.webService.getGame(this.route.snapshot.params.id);
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
  /* Returns review type styles by id's */
  reviewTypeStyle(id) {
    switch (id) {
      case 0:
        return { color: "rgb(228, 4, 4)" };
      case 1:
        return { color: "rgb(4, 228, 71)" };
      case 2:
        return { color: "white" };
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

  priceDisplay(price) {
    if (price > 0) {
      return "£" + price;
    } else {
      return "Free To Play";
    }
  }

  displayOs(osName) {
    switch (osName) {
      case "windows":
        return "../assets/img/windows.png";
        break;
      case "mac":
        return "../assets/img/macos.png";
        break;
      case "linux":
        return "../assets/img/linux.png";
        break;
      default:
        return "wrong val";
        break;
    }
  }

  displayRatingPercentage(negative, positive) {
    var calc = (positive / (negative + positive)) * 100;
    return calc.toFixed(2);
  }

  deleteComment(gid, cid) {
    this.webService.deleteComment(gid, cid);
    console.log(gid, cid);
  }

  editComment() {
    console.log("Comment Editing to be implemented.");
  }

  openDialog(commentVal): void {
    const dialogRef = this.dialog.open(EditCommentComponent, {
      height: "250px",
      width: "450px",
      data: {
        name: this.authService.getProfile().nickname,
        commentData: commentVal,
        gid: this.route.snapshot.params.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}
