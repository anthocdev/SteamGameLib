import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { WebService } from "./web.service";
import { AuthService } from "./auth.service";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { SteamComponent } from "./steam.component";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home.component";
import { GameComponent } from "./game.component";
import { NavComponent } from "./nav.component";

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
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SteamComponent,
    HomeComponent,
    GameComponent,
    NavComponent
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
