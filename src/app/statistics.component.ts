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
  publisherChart;
  categoryChart;
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

  drawPublisherStats(data: any) {
    data.forEach(element => {
      this.publisherChart.data.labels.push(element.publisher);
      this.publisherChart.data.datasets.forEach(dataset => {
        dataset.data.push(element.count);
      });
    });
    this.publisherChart.update();
  }

  drawCategoryStats(data: any) {
    data.forEach(element => {
      this.categoryChart.data.labels.push(element.category);
      this.categoryChart.data.datasets.forEach(dataset => {
        dataset.data.push(element.count);
      });
    });
    this.categoryChart.update();
  }

  ngOnInit() {
    this.webService.getPlatformStats();
    this.webService.platfromStats_list.subscribe(data => {
      this.drawPlatformStats(data);
    });

    this.webService.getPublisherStats();
    this.webService.publisherStats_list.subscribe(data => {
      this.drawPublisherStats(data);
    });

    this.webService.getCategoryStats();
    this.webService.categoryStats_list.subscribe(data => {
      this.drawCategoryStats(data);
    });

    //Platform Chart initial State
    this.platformChart = new Chart("platformCanvas", {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "# of Games Belonging to Platform",
            data: [],
            backgroundColor: [
              "rgba(7, 123, 255, 0.74)",
              "rgba(255, 255, 255, 0.74)",
              "rgba(255, 238, 0, 0.74)"
            ],
            borderColor: [
              "rgba(7, 123, 255, 1)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 238, 0, 1)"
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

    //Publisher chart initial State
    this.publisherChart = new Chart("canvas", {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "# of Games Published",
            data: [],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(6, 19, 3, 0.2)",
              "rgba(90, 235, 54, 0.2)",
              "rgba(13, 212, 202, 0.2)",
              "rgba(149, 13, 212, 0.2)",
              "rgba(172, 207, 17, 0.2)",
              "rgba(216, 132, 22, 0.2)",
              "rgba(219, 73, 15, 0.2)",
              "rgba(165, 219, 15, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(6, 19, 3, 1)",
              "rgba(90, 235, 54, 1)",
              "rgba(13, 212, 202, 1)",
              "rgba(149, 13, 212, 1)",
              "rgba(172, 207, 17, 1)",
              "rgba(216, 132, 22, 1)",
              "rgba(219, 73, 15, 1)",
              "rgba(165, 219, 15, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              ticks: {
                minRotation: 0
              }
            }
          ],
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
    //Category chart initial state
    this.categoryChart = new Chart("categoryCanvas", {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            label: "# of Games With Category",
            data: [],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(6, 19, 3, 0.2)",
              "rgba(90, 235, 54, 0.2)",
              "rgba(13, 212, 202, 0.2)",
              "rgba(149, 13, 212, 0.2)",
              "rgba(172, 207, 17, 0.2)",
              "rgba(216, 132, 22, 0.2)",
              "rgba(219, 73, 15, 0.2)",
              "rgba(165, 219, 15, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(6, 19, 3, 1)",
              "rgba(90, 235, 54, 1)",
              "rgba(13, 212, 202, 1)",
              "rgba(149, 13, 212, 1)",
              "rgba(172, 207, 17, 1)",
              "rgba(216, 132, 22, 1)",
              "rgba(219, 73, 15, 1)",
              "rgba(165, 219, 15, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false
              },
              ticks: {
                minRotation: 90,
                display: false
              }
            }
          ],
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
