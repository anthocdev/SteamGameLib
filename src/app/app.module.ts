import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { WebService } from "./web.service";
import { AuthService } from "./auth.service";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { AuthGuard } from "./Guard/auth.guard";

import { SteamComponent } from "./steam.component";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home.component";
import { GameComponent } from "./game.component";
import { NavComponent } from "./nav.component";
import { ProfileComponent } from "./profile.component";
import { StatisticsComponent } from "./statistics.component";
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
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [WebService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
