import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class WebService {
  private steamGames_private_list;
  private steamGamesSubject = new Subject();
  steamGames_list = this.steamGamesSubject.asObservable();

  private steamGame_private_list;
  private steamGameSubject = new Subject();
  steamGame_list = this.steamGameSubject.asObservable();

  private comments_private_list;
  private commentsSubject = new Subject();
  comments_list = this.commentsSubject.asObservable();

  appId;

  constructor(private http: HttpClient) {}

  getGames(page) {
    return this.http
      .get(`http://192.168.0.13:5000/api/v1.0/games?pn=` + page)
      .subscribe(response => {
        this.steamGames_private_list = response;
        this.steamGamesSubject.next(this.steamGames_private_list);
      });
  }

  getGame(id) {
    return this.http
      .get("http://192.168.0.13:5000/api/v1.0/games/" + id)
      .subscribe(response => {
        this.steamGame_private_list = response;
        this.steamGameSubject.next(this.steamGame_private_list);
        this.appId = id;
      });
  }

  getComments(id) {
    return this.http
      .get("http://192.168.0.13:5000/api/v1.0/games/" + id + "/comments")
      .subscribe(response => {
        this.comments_private_list = response;
        this.commentsSubject.next(this.comments_private_list);
      });
  }

  postComment(comment) {
    let postData = new FormData();
    postData.append("username", comment.username);
    postData.append("comment", comment.comment);
    postData.append("review_type", JSON.stringify(comment.reviewType));

    //Store date here

    this.http
      .post(
        "http://192.168.0.13:5000/api/v1.0/games/" + this.appId + "/comments",
        postData
      )
      .subscribe(response => {
        this.getComments(this.appId);
      });
  }
}
