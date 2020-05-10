import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise-data';
import {DatePipe} from '@angular/common'
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})


export class CountriesComponent implements OnInit {
  
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  data : GlobalDataSummary[];
  countries : string[] = [];
  dateWiseData ;
  line = 'LineChart';
  datatable = [];
  labels;
  loading = true;
  options = {   
    hAxis: {
       title: 'Month'
    },
    vAxis:{
       title: 'Confirmed Cases'
    },
    curveType: 'function', legend: { position: 'bottom' },
    animation :{
      duration :1000,
      easing: 'out',
    }
 };
  selectedCountryData : DateWiseData[];
  constructor(private service : DataServiceService) { }
  ngOnInit() {

    merge(
      this.service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(map(result=>{
        this.data = result;
        this.data.forEach(cs=>{
          this.countries.push(cs.country);
        })  
      }))
    ).subscribe({
      complete : ()=>{
        this.updateValues('US');
        this.loading=false;
      }
    })
  }

  updateChart(){
    let dataTable = [];
    // dataTable.push(['date', 'cases'])
    this.selectedCountryData.forEach(cs=>{
      console.log([cs.date,cs.cases]);
      
      dataTable.push([cs.date, +cs.cases])
    })
    this.datatable = dataTable;
    console.log(this.datatable);
  }

  updateValues(country : string){
    // console.log(country);
    this.data.forEach(cs=>{
      if(cs.country==country){
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered
      }
    })
    this.selectedCountryData = this.dateWiseData[country]
    // console.log(this.selectedCountryData);    
    this.updateChart();
  }
}
