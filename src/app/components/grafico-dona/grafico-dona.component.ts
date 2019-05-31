import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  @Input()  public doughnutChartLabels: Label[];
  @Input()  public doughnutChartData: MultiDataSet;
  @Input()  public doughnutChartType: ChartType;

  @Input() leyenda: string;



  constructor() { }

  ngOnInit() {
  }

}
