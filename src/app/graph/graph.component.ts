import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import embed, { VisualizationSpec } from 'vega-embed';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  id: number = 1;
  isError: boolean = false

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchDataAndRenderGraph();
  }

  fetchDataAndRenderGraph(): void {
    if (this.id) {
      this.http.get<any>(`http://localhost:3000/data-energy/${this.id}`).subscribe(
        (data) => {
          this.renderGraph(data);
        },
        (error) => {
          console.error('Error fetching data from backend', error);
          this.isError = true;
        }
      );
    }
  }

  renderGraph(data: any): void {
    const processedData = [
      { "name": "KW", "value": data[this.id].KW },
      { "name": "KW1", "value": data[this.id].KW1 },
      { "name": "KW2", "value": data[this.id].KW2 },
      { "name": "KW3", "value": data[this.id].KW3 },
      { "name": "KVA", "value": data[this.id].KVA },
      { "name": "KVAr", "value": data[this.id].KVAr },
      { "name": "KVArh", "value": data[this.id].KVArh },
      { "name": "KVA1", "value": data[this.id].KVA1 },
      { "name": "KVA2", "value": data[this.id].KVA2 },
      { "name": "KVA3", "value": data[this.id].KVA3 },
      { "name": "KVAR1", "value": data[this.id].KVAR1 },
      { "name": "KVAR2", "value": data[this.id].KVAR2 },
      { "name": "KVAR3", "value": data[this.id].KVAR3 }
    ];

    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "description": "A simple bar chart with embedded data.",
      "data": { "values": processedData },
      "width": 800,
      "height": 300,
      "mark": "bar",
      "encoding": {
        "x": { "field": "name", "type": "nominal", "title": "Parameter" },
        "y": { "field": "value", "type": "quantitative", "title": "Value (0-0.001)", "scale": { "domain": [0, 0.001] } }
      },
    };

    embed('#vega-chart', spec);
  }
}
