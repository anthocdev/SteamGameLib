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
    this.webService.getGames(this.page);
  }

  nextPage() {
    this.page = Number(this.page) + 1;
    sessionStorage.page = Number(this.page);
    this.webService.getGames(this.page);
  }

  previousPage() {
    if (this.page > 1) {
      this.page = Number(this.page) - 1;
      sessionStorage.page = Number(this.page);
      this.webService.getGames(this.page);
    }
  }
  page = 1;

  mehGames = [
    {
      _id: "5dcd9209c7395008b4332dba",
      appid: "10",
      name: "Counter-Strike",
      release_date: "2000-11-01",
      english: "1",
      developer: "Valve",
      publisher: "Valve",
      platforms: "windows;mac;linux",
      required_age: "0",
      categories:
        "Multi-player;Online Multi-Player;Local Multi-Player;Valve Anti-Cheat enabled",
      genres: "Action",
      steamspy_tags: "Action;FPS;Multiplayer",
      achievements: "0",
      positive_ratings: "124534",
      negative_ratings: "3339",
      average_playtime: "17612",
      median_playtime: "317",
      owners: "10000000-20000000",
      price: "7.19"
    },
    {
      _id: "5dcd9209c7395008b4332dbb",
      appid: "20",
      name: "Team Fortress Classic",
      release_date: "1999-04-01",
      english: "1",
      developer: "Valve",
      publisher: "Valve",
      platforms: "windows;mac;linux",
      required_age: "0",
      categories:
        "Multi-player;Online Multi-Player;Local Multi-Player;Valve Anti-Cheat enabled",
      genres: "Action",
      steamspy_tags: "Action;FPS;Multiplayer",
      achievements: "0",
      positive_ratings: "3318",
      negative_ratings: "633",
      average_playtime: "277",
      median_playtime: "62",
      owners: "5000000-10000000",
      price: "3.99"
    },
    {
      _id: "5dcd9209c7395008b4332dbc",
      appid: "30",
      name: "Day of Defeat",
      release_date: "2003-05-01",
      english: "1",
      developer: "Valve",
      publisher: "Valve",
      platforms: "windows;mac;linux",
      required_age: "0",
      categories: "Multi-player;Valve Anti-Cheat enabled",
      genres: "Action",
      steamspy_tags: "FPS;World War II;Multiplayer",
      achievements: "0",
      positive_ratings: "3416",
      negative_ratings: "398",
      average_playtime: "187",
      median_playtime: "34",
      owners: "5000000-10000000",
      price: "3.99"
    },
    {
      _id: "5dcd9209c7395008b4332e37",
      appid: "4300",
      name: "RoboBlitz",
      release_date: "2006-11-07",
      english: "1",
      developer: "Naked Sky Entertainment",
      publisher: "Naked Sky Entertainment",
      platforms: "windows",
      required_age: "0",
      categories:
        "Single-player;Partial Controller Support;Includes level editor",
      genres: "Action;Indie",
      steamspy_tags: "Action;Indie;Puzzle",
      achievements: "0",
      positive_ratings: "43",
      negative_ratings: "14",
      average_playtime: "78",
      median_playtime: "78",
      owners: "20000-50000",
      price: "5.99"
    },
    {
      _id: "5dcd9209c7395008b4332e43",
      appid: "4760",
      name: "Rome: Total War™ - Collection",
      release_date: "2007-08-28",
      english: "1",
      developer: "CREATIVE ASSEMBLY",
      publisher: "SEGA",
      platforms: "windows",
      required_age: "0",
      categories: "Single-player;Multi-player;Steam Trading Cards",
      genres: "Strategy",
      steamspy_tags: "Strategy;Historical;Rome",
      achievements: "0",
      positive_ratings: "7806",
      negative_ratings: "562",
      average_playtime: "897",
      median_playtime: "1192",
      owners: "1000000-2000000",
      price: "8.99"
    },
    {
      _id: "5dcd9209c7395008b4332e6a",
      appid: "6900",
      name: "Hitman: Codename 47",
      release_date: "2007-03-15",
      english: "1",
      developer: "IO Interactive A/S",
      publisher: "IO Interactive A/S",
      platforms: "windows",
      required_age: "18",
      categories: "Single-player",
      genres: "Action",
      steamspy_tags: "Stealth;Action;Classic",
      achievements: "0",
      positive_ratings: "1186",
      negative_ratings: "450",
      average_playtime: "62",
      median_playtime: "43",
      owners: "1000000-2000000",
      price: "7.19"
    },
    {
      _id: "5dcd9209c7395008b4332e6d",
      appid: "6980",
      name: "Thief: Deadly Shadows",
      release_date: "2007-03-29",
      english: "1",
      developer: "Ion Storm",
      publisher: "Square Enix",
      platforms: "windows",
      required_age: "0",
      categories: "Single-player",
      genres: "Action",
      steamspy_tags: "Stealth;Atmospheric;Action",
      achievements: "0",
      positive_ratings: "1135",
      negative_ratings: "210",
      average_playtime: "254",
      median_playtime: "368",
      owners: "500000-1000000",
      price: "6.99"
    },
    {
      _id: "5dcd9209c7395008b4332e95",
      appid: "8870",
      name: "BioShock Infinite",
      release_date: "2013-03-25",
      english: "1",
      developer: "Irrational Games;Aspyr (Mac);Virtual Programming (Linux)",
      publisher: "2K;Aspyr (Mac)",
      platforms: "windows;mac;linux",
      required_age: "18",
      categories:
        "Single-player;Steam Achievements;Full controller support;Steam Trading Cards;Steam Cloud",
      genres: "Action",
      steamspy_tags: "FPS;Story Rich;Action",
      achievements: "80",
      positive_ratings: "79442",
      negative_ratings: "3846",
      average_playtime: "614",
      median_playtime: "519",
      owners: "2000000-5000000",
      price: "19.99"
    },
    {
      _id: "5dcd9209c7395008b4332e9b",
      appid: "9010",
      name: "Return to Castle Wolfenstein",
      release_date: "2007-08-03",
      english: "1",
      developer: "Gray Matter Studios",
      publisher: "Bethesda-Softworks",
      platforms: "windows",
      required_age: "0",
      categories: "Single-player;Multi-player;Steam Cloud",
      genres: "Action",
      steamspy_tags: "FPS;Action;Classic",
      achievements: "0",
      positive_ratings: "3084",
      negative_ratings: "276",
      average_playtime: "32",
      median_playtime: "48",
      owners: "200000-500000",
      price: "3.99"
    },
    {
      _id: "5dcd9209c7395008b4332ea9",
      appid: "9480",
      name: "Saints Row 2",
      release_date: "2009-01-07",
      english: "1",
      developer: "Volition",
      publisher: "Deep Silver",
      platforms: "windows;linux",
      required_age: "0",
      categories: "Single-player;Steam Cloud",
      genres: "Action",
      steamspy_tags: "Open World;Action;Character Customization",
      achievements: "0",
      positive_ratings: "9442",
      negative_ratings: "2881",
      average_playtime: "322",
      median_playtime: "81",
      owners: "2000000-5000000",
      price: "9.99"
    },
    {
      _id: "5dcd9209c7395008b4332ebc",
      appid: "10180",
      name: "Call of Duty®: Modern Warfare® 2",
      release_date: "2009-11-11",
      english: "1",
      developer: "Infinity Ward;Aspyr (Mac)",
      publisher: "Activision;Aspyr (Mac)",
      platforms: "windows;mac",
      required_age: "0",
      categories:
        "Single-player;Multi-player;Co-op;Steam Achievements;Steam Cloud;Valve Anti-Cheat enabled",
      genres: "Action",
      steamspy_tags: "Action;FPS;Multiplayer",
      achievements: "50",
      positive_ratings: "30006",
      negative_ratings: "2826",
      average_playtime: "999",
      median_playtime: "580",
      owners: "5000000-10000000",
      price: "19.99"
    },
    {
      _id: "5dcd9209c7395008b4332ec4",
      appid: "10500",
      name: "Total War: EMPIRE – Definitive Edition",
      release_date: "2009-03-04",
      english: "1",
      developer:
        "CREATIVE ASSEMBLY;Feral Interactive (Mac);Feral Interactive (Linux)",
      publisher: "SEGA;Feral Interactive (Mac);Feral Interactive (Linux)",
      platforms: "windows;mac;linux",
      required_age: "0",
      categories:
        "Single-player;Multi-player;Steam Achievements;Steam Trading Cards;Stats",
      genres: "Strategy",
      steamspy_tags: "Strategy;Historical;Military",
      achievements: "30",
      positive_ratings: "14928",
      negative_ratings: "1719",
      average_playtime: "3176",
      median_playtime: "1385",
      owners: "2000000-5000000",
      price: "19.99"
    },
    {
      _id: "5dcd9209c7395008b4332ecd",
      appid: "11200",
      name: "Shadowgrounds Survivor",
      release_date: "2007-11-14",
      english: "1",
      developer: "Frozenbyte",
      publisher: "Frozenbyte",
      platforms: "windows;mac",
      required_age: "0",
      categories:
        "Single-player;Shared/Split Screen;Steam Trading Cards;Includes level editor",
      genres: "Action",
      steamspy_tags: "Action;Sci-fi;Isometric",
      achievements: "0",
      positive_ratings: "328",
      negative_ratings: "239",
      average_playtime: "355",
      median_playtime: "374",
      owners: "200000-500000",
      price: "6.99"
    }
  ];
}
