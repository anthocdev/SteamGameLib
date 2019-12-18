import { Component } from "@angular/core";
import { WebService } from "./web.service";

@Component({
  selector: "steamLibrary",
  templateUrl: "./steam.component.html",
  styleUrls: ["./steam.component.css"]
})
export class SteamComponent {
  constructor(private webService: WebService) {}

  ngOnInit() {
    if (sessionStorage.page) {
      this.page = sessionStorage.page;
    }
    if (sessionStorage.size) {
      this.size = sessionStorage.size;
    }
    if (sessionStorage.name) {
      this.name = sessionStorage.name;
    }
    if (sessionStorage.sort) {
      this.sort = sessionStorage.sort;
    }
    if (sessionStorage.sortStruct) {
      this.sortStruct = sessionStorage.sortStruct;
    }
    this.webService.getGames(
      this.page,
      this.size,
      this.name,
      this.sort,
      this.sortStruct
    );
  }

  nextPage() {
    if (this.webService.lastPage) {
      return;
    }
    this.page = Number(this.page) + 1;
    sessionStorage.page = Number(this.page);
    this.webService.getGames(
      this.page,
      this.size,
      this.name,
      this.sort,
      this.sortStruct
    );
  }

  previousPage() {
    if (this.page > 1) {
      this.page = Number(this.page) - 1;
      sessionStorage.page = Number(this.page);
      this.webService.getGames(
        this.page,
        this.size,
        this.name,
        this.sort,
        this.sortStruct
      );
    }
  }

  searchName(name) {
    this.name = name;
    this.page = 1;
    sessionStorage.name = String(this.name);
    this.webService.getGames(
      this.page,
      this.size,
      this.name,
      this.sort,
      this.sortStruct
    );
  }

  setSort(id) {
    this.sort = id;
    sessionStorage.sort = Number(id);
  }

  setSortStruct(id) {
    this.sortStruct = id;
    sessionStorage.sortStruct = Number(id);
  }

  page = 1;
  size = 10;
  name = "";
  sort = 2; //0 - No sort property, 1 - By Release Date, 2 - By Price
  sortStruct = 1; // 1 - Descending, 2 - Ascending
}
