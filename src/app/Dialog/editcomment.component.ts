import { Component, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { WebService } from "../web.service";

@Component({
  selector: "editComment-dialog",
  templateUrl: "editcomment.component.html",
  styleUrls: ["editcomment.component.css"]
})
export class EditCommentComponent {
  constructor(
    public dialogRef: MatDialogRef<EditCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private webService: WebService
  ) {}

  closeDialog() {
    this.dialogRef.close("Editing Cancelled");
  }

  confirm(datax, gid) {
    this.dialogRef.close("Confirmed");
    this.webService.editComment(datax, gid, datax._id);
    console.log(datax);
  }
}
