import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  //User data observable

  private userInfo_private_list;
  private userInfoSubject = new Subject();
  userInfo_list = this.userInfoSubject.asObservable();

  //User comment list observable

  private userComments_private_list;
  private userCommentsSubject = new Subject();
  userComments_list = this.userCommentsSubject.asObservable();

  //Region - Statistics Observables

  private platformStats_private_list;
  private platformStatsSubject = new Subject();
  platfromStats_list = this.platformStatsSubject.asObservable();

  //Endregion
  appId;
  lastPage;

  constructor(private http: HttpClient) {}

  getGames(page, size = 10, name = "", sort = 0, sortStruct = 0) {
    return this.http
      .get(
        `http://localhost:5000/api/v1.0/games?pn=` +
          page +
          "&ps=" +
          size +
          "&name=" +
          name +
          "&sort=" +
          sort +
          "&sortStruct=" +
          sortStruct
      )
      .subscribe(response => {
        this.steamGames_private_list = response;
        this.lastPage = this.steamGames_private_list.lastPage;
        this.steamGamesSubject.next(this.steamGames_private_list.gameData);
        console.log(response);
      });
  }

  getGame(id) {
    return this.http
      .get("http://localhost:5000/api/v1.0/games/" + id)
      .subscribe(response => {
        this.steamGame_private_list = response;
        this.steamGameSubject.next(this.steamGame_private_list);
        this.appId = id;
      });
  }

  getComments(id) {
    return this.http
      .get("http://localhost:5000/api/v1.0/games/" + id + "/comments")
      .subscribe(response => {
        this.comments_private_list = response;
        this.commentsSubject.next(this.comments_private_list);
      });
  }

  getUserComments(uid) {
    return this.http
      .get("http://localhost:5000/api/v1.0/comments/" + uid)
      .subscribe(response => {
        this.userComments_private_list = response;
        this.userCommentsSubject.next(this.userComments_private_list);
      });
  }

  postComment(comment) {
    let postData = new FormData();
    postData.append("username", comment.username);
    postData.append("comment", comment.comment);
    postData.append("review_type", JSON.stringify(comment.reviewType));
    postData.append("userid", comment.userid);
    postData.append("imageLink", comment.imageLink);

    //Store date here
    let currentDate = new Date();
    let currentDateVal =
      currentDate.getFullYear() +
      "-" +
      currentDate.getMonth() +
      "-" +
      currentDate.getDate() +
      " " +
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":" +
      currentDate.getSeconds();
    postData.append("postDate", currentDateVal);

    this.http
      .post(
        "http://localhost:5000/api/v1.0/games/" + this.appId + "/comments",
        postData
      )
      .subscribe(response => {
        this.getGame(this.appId); //Update comments list
      });
  }

  deleteComment(gid, cid) {
    this.http
      .delete(
        "http://localhost:5000/api/v1.0/games/" + gid + "/comments/" + cid
      )
      .subscribe(response => {
        console.log(response);
        this.getGame(gid); //Update comments list
      });
  }

  getPlatformStats() {
    return this.http
      .get("http://localhost:5000/api/v1.0/games/stats/platforms")
      .subscribe(response => {
        this.platformStats_private_list = response;
        this.platformStatsSubject.next(this.platformStats_private_list);
      });
  }
}
