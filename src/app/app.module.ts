import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { WebService } from "./web.service";
import { AuthService } from "./auth.service";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MAT_LABEL_GLOBAL_OPTIONS
} from "@angular/material";
import { InterceptorService } from "./interceptor.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSliderModule } from "@angular/material/slider";
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
} from "@angular/material";

import { AuthGuard } from "./Guard/auth.guard";

import { SteamComponent } from "./steam.component";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home.component";
import { GameComponent } from "./game.component";
import { NavComponent } from "./nav.component";
import { ProfileComponent } from "./profile.component";
import { StatisticsComponent } from "./statistics.component";
import { EditCommentComponent } from "./Dialog/editcomment.component";

var routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "games",
    component: SteamComponent
  },
  {
    path: "games/:id",
    component: GameComponent
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "statistics",
    component: StatisticsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SteamComponent,
    HomeComponent,
    GameComponent,
    NavComponent,
    ProfileComponent,
    StatisticsComponent,
    EditCommentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  entryComponents: [EditCommentComponent],
  exports: [RouterModule],
  providers: [
    WebService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: "always" } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
