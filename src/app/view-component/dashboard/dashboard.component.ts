import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
} from 'ng-apexcharts';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { SingletonService } from 'src/app/services/singleton.service';
import { IAnaliticsData, IOrdersStatics } from 'src/app/typing/orders';
import { Chart, registerables } from 'chart.js';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  fill: any;
  plotOptions: any;
  height: any;
  stroke: any;
  dataLabels: any;
  responsive: ApexResponsive[];
  labels: any;
};

export type IAreaChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public areaChartOptions: Partial<IAreaChartOptions>;
  public chartLabel: Array<string> = [];
  public chartData: Array<number> = [];
  public barChart: any;
  totalRevenue: number = null;
  totalOrder: number = null;
  delevered: number = null;
  totalStaocks: number = 0;
  constructor(private http: HttpclientService, private ss: SingletonService) {
    Chart.register(...registerables);
    this.chartOptions = {
      series: [],
      chart: {
        type: 'donut',
        width: '340px',
        height: '400px',
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },

      colors: ['#F31559', '#0B666A', '#068FFF'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.9,
          stops: [0, 80, 100],
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '73%', // Decrease the thickness by adjusting the donut size
          },
        },
      },
      labels: [],
      responsive: [],
    };
    this.areaChartOptions = {
      series: [],
      chart: {
        height: 320,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          track: {
            background: '#232f3eab',
          },
          dataLabels: {
            name: {
              fontSize: '20px',
              color: '#fff',
            },
            value: {
              fontSize: '18px',
              color: '#fff',
            },
            total: {
              show: true,
              label: 'Total Products',
              color: '#fff',
              formatter: function (w) {
                return this.totalStaocks ? this.totalStaocks : '0';
              },
            },
          },
        },
      },
      labels: [], //['Apples', 'Oranges', 'Bananas', 'Berries'],
    };
  }

  ngOnInit(): void {
    this.fetchOrdernalitics();
    this.orderAnalitics();
  }

  createChart() {
    this.barChart = new Chart('MyChart', {
      type: 'bar', //this denotes tha type of chart
      data: {
        // values on X-Axis
        labels: this.chartLabel,
        datasets: [
          {
            label: 'Stock',
            data: this.chartData,
            backgroundColor: 'green',
            barThickness: 12,
            borderRadius: 10,
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false, // Set the desired grid line color
            },
          },
          y: {
            // display: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)', // Set the desired color
            },
          },
        },
        maintainAspectRatio: false,
        responsive: true,
      },
    });
  }

  async fetchOrdernalitics() {
    const url = 'analitics';
    const res = await this.http.request('GET', url).toPromise();
    if (res.status == 200) {
      const serverRes: IOrdersStatics = await res.body;
      this.chartOptions.series = Object.values(serverRes.order_statics);
      this.chartOptions.labels = Object.keys(serverRes.order_statics);
      this.totalRevenue = serverRes.total_revenue;
      this.totalOrder = serverRes.order_statics?.totalOrder;
      this.delevered = serverRes.order_statics?.deleveredOrders;
    } else if (res.status == 404) {
      this.ss.message?.showStatusBar(`Url ${res.statusText}`, 1000, 'fail');
    } else {
      this.ss.message?.showStatusBar(
        `Internal Server Error.Please see the logs ${res.status}`,
        1000,
        'fail'
      );
    }
  }
  async orderAnalitics() {
    const url = 'product/analitics';
    const res = await this.http.request('GET', url).toPromise();
    if (res.status == 200) {
      const serverRes: any = await res.body;
      this.chartLabel = await serverRes?.analiticsData?.product_name;
      this.chartData = await serverRes?.analiticsData?.stock;
      this.areaChartOptions.series = await serverRes?.analiticsData?.stock;
      this.areaChartOptions.labels = await serverRes?.analiticsData
        ?.product_name;
      this.totalStaocks = this.chartData.reduce((acc, cur) => acc + +cur, 0);
      this.areaChartOptions.plotOptions.radialBar.dataLabels.total.formatter =
        () => {
          return this.totalStaocks.toString();
        };
      this.createChart();
    } else if (res.status == 404) {
      this.ss.message?.showStatusBar(`Url ${res.statusText}`, 1000, 'fail');
    } else {
      this.ss.message?.showStatusBar(
        `Internal Server Error.Please see the logs ${res.status}`,
        1000,
        'fail'
      );
    }
  }
}
