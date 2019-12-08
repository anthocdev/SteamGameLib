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
      username: ["", Validators.required],
      comment: ["", Validators.required],
      reviewType: 2
    });
    this.webService.getGame(this.route.snapshot.params.id);
    this.webService.getComments(this.route.snapshot.params.id);
  }

  onSubmit() {
    console.log(this.commentForm.valid);
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
    return (
      this.commentForm.controls.username.pristine ||
      this.commentForm.controls.comment.pristine
    );
  }

  isIncomplete() {
    return (
      this.isInvalid("username") ||
      this.isInvalid("comment") ||
      this.isUntouched()
    );
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
