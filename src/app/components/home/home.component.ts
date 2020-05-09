import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { GoogleChartComponent, GoogleChartsModule } from 'angular-google-charts';
import { GoogleChartsConfig } from 'angular-google-charts/lib/models/google-charts-config.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globaldata : GlobalDataSummary[];
  loading = true;
  datatable = [];
  pie = 'PieChart'
  column = 'ColumnChart'

  constructor(private dataService : DataServiceService) { }
  

  ngOnInit(): void{
    this.dataService.getGlobalData()
    .subscribe(
      {
      next : (result)=>{
        console.log(result);
        this.globaldata = result;
        result.forEach(cs=>{
          if(!Number.isNaN(cs.confirmed)){
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        })
        this.initChart('c');
        // console.log(this.totalActive)
      },
      complete : ()=>{
        this.loading = false;
      }
    })

  }
  
  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value)
  }

  initChart(caseType: string) {

    let dt = [];

    console.log(caseType);
    console.log(this.globaldata);
    

    this.globaldata.forEach(cs => {
      let value :number ;
      if (caseType == 'c')
        if (cs.confirmed > 20000)
          value = cs.confirmed;

      if (caseType == 'a')
        if (cs.active > 20000)
          value = cs.active
      
      if (caseType == 'd')
        if (cs.deaths > 10000)
          value = cs.deaths

      if (caseType == 'r')
        if (cs.recovered > 20000)
            value = cs.recovered


        if(value){
          dt.push([
           cs.country , value
          ])
        }
    })
    console.log(dt);
    this.datatable = dt;
   
  }

}
