import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { WebService } from "./web.service";
import { Chart } from "chart.js";

@Component({
  selector: "statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.css"],
  providers: []
})
export class StatisticsComponent implements OnInit {
  gameChart: [];
  platformChart;
  platformStats;
  constructor(
    public authService: AuthService,
    private webService: WebService
  ) {}

  drawPlatformStats(data: any) {
    data.forEach(element => {
      this.platformChart.data.labels.push(element.platform);
      this.platformChart.data.datasets.forEach(dataset => {
        dataset.data.push(element.count);
      });
    });
    this.platformChart.update();
  }

  ngOnInit() {
    this.webService.getPlatformStats();
    this.webService.platfromStats_list.subscribe(data => {
      this.platformStats = data;
      this.drawPlatformStats(data);
    });

    this.platformChart = new Chart("platformCanvas", {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "# of Games",
            data: [],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(54, 162, 235, 0.2)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    this.gameChart = new Chart("canvas", {
      type: "line",
      data: {
        labels: [this.platformStats, "Label2"],
        datasets: [
          {
            label: "# of Games",
            data: [1, 6],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)"
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}
