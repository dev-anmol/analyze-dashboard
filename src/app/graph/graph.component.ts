import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import embed, {VisualizationSpec} from 'vega-embed';
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
  isError: boolean = false;
  isLoading: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchDataAndRenderGraph();
  }

  fetchDataAndRenderGraph(): void {
    this.isLoading = true;
    if (this.id) {
      this.http.get<any>(`http://localhost:3000/data-energy/${this.id}`).subscribe(
        (data) => {
          this.isLoading = false;
          this.renderGraph(data);
        },
        (error) => {
          console.error('Error fetching data from backend', error);
          this.isError = true;
          this.isLoading = false;
        }
      );
    }
  }
  
  renderGraph(data: any): void {
    const values = [
      { "category": "KW", "amount": data[this.id]?.KW ?? 0 },
      { "category": "KW1", "amount": data[this.id]?.KW1 ?? 0 },
      { "category": "KW2", "amount": data[this.id]?.KW2 ?? 0 },
      { "category": "KW3", "amount": data[this.id]?.KW3 ?? 0 },
      { "category": "KVA", "amount": data[this.id]?.KVA ?? 0 },
      { "category": "KVAr", "amount": data[this.id]?.KVAr ?? 0 },
      { "category": "KVArh", "amount": data[this.id]?.KVArh ?? 0 },
      { "category": "KVA1", "amount": data[this.id]?.KVA1 ?? 0 },
      { "category": "KVA2", "amount": data[this.id]?.KVA2 ?? 0 },
      { "category": "KVA3", "amount": data[this.id]?.KVA3 ?? 0 },
      { "category": "KVAR1", "amount": data[this.id]?.KVAR1 ?? 0 },
      { "category": "KVAR2", "amount": data[this.id]?.KVAR2 ?? 0 },
      { "category": "KVAR3", "amount": data[this.id]?.KVAR3 ?? 0 }
    ];

    const validValues = values.filter(item => item.amount !== null && item.amount !== undefined && !isNaN(item.amount));

    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": 900,
      "height": 400,
      "padding": 10,
      "background": "white",
      "data": [
        {
          "name": "table",
          "values": validValues,
        }
      ],
      "signals": [
        {
          "name": "tooltip",
          "value": {},
          "on": [
            { "events": "rect:mouseover", "update": "datum" },
            { "events": "rect:mouseout", "update": "{}" }
          ]
        }
      ],
      "scales": [
        {
          "name": "xscale",
          "type": "band",
          "domain": { "data": "table", "field": "category" },
          "range": "width",
          "padding": 0.05,
          "round": true
        },
        {
          "name": "yscale",
          "domain": { "data": "table", "field": "amount" },
          "nice": true,
          "range": "height"
        }
      ],
      "axes": [
        { "orient": "bottom", "scale": "xscale" },
        { "orient": "left", "scale": "yscale" }
      ],
      "marks": [
        {
          "type": "rect",
          "from": { "data": "table" },
          "encode": {
            "enter": {
              "x": { "scale": "xscale", "field": "category" },
              "width": { "scale": "xscale", "band": 1 },
              "y": { "scale": "yscale", "field": "amount" },
              "y2": { "scale": "yscale", "value": 0 }
            },
            "update": {
              "fill": { "value": "steelblue" }
            },
            "hover": {
              "fill": { "value": "red" }
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "align": { "value": "center" },
              "baseline": { "value": "bottom" },
              "fill": { "value": "#333" }
            },
            "update": {
              "x": { "scale": "xscale", "signal": "tooltip.category", "band": 0.5 },
              "y": { "scale": "yscale", "signal": "tooltip.amount", "offset": -2 },
              "text": { "signal": "tooltip.amount" },
              "fillOpacity": [
                { "test": "isNaN(tooltip.amount)", "value": 0 },
                { "value": 1 }
              ]
            }
          }
        }
      ]
    };
    embed('#vega-chart', spec).catch(console.error);
  }
}