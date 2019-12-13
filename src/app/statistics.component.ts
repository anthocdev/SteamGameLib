import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { Chart } from "chart.js";

@Component({
  selector: "statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.css"]
})
export class StatisticsComponent implements OnInit {
  gameChart: [];
  tagsChart: [];
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.gameChart = new Chart("canvas", {
      type: "line",
      data: {
        labels: ["Label1", "Label2"],
        datasets: [
          {
            label: "#TestLabel",
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

    this.tagsChart = new Chart("tagsCanvas", {
      type: "bar",
      data: {
        labels: ["Label1", "Label2"],
        datasets: [
          {
            label: "#TestLabel",
            data: [1, 6],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)"
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1
          }
        ]
      }
    });
  }
}
