import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {ChartService} from '../chart.service';
import {ChartComponent} from '../chart.component';
import * as moment from 'moment';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ExportToCsv } from 'export-to-csv';
import {ChartInterfaceCoin} from '../helpers/chart.interface';

/**
 * CSV options
 * @type {{fieldSeparator: string; filename: string; quoteStrings: string; decimalSeparator: string; showLabels: boolean; showTitle: boolean; title: string; useTextFile: boolean; useBom: boolean; useKeysAsHeaders: boolean}}
 */
const options = {
  fieldSeparator: ',',
  filename: 'Loop',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  title: 'Cash',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true
};

@Component({
  selector: 'app-chart-manipulate',
  templateUrl: './chart-manipulate.component.html',
  styleUrls: ['./chart-manipulate.component.scss']
})
/**
 * Manipulation with forms and generate table
 */
export class ChartManipulateComponent implements OnInit, AfterViewInit {

  public allCoinsData: any; // all coins
  public displayedColumns: string[] = ['name', 'date', 'value'];
  public selectedAdd: any;
  public selectedRemove: any;

  @Input() coins;
  @Input() data;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  public dataSource = new MatTableDataSource();
  constructor(public chartService: ChartService, private chartComponent: ChartComponent) { }

  /**
   * Service for call all coins
   */
  ngOnInit() {
    this.chartService.getCoinsFull().subscribe((res) => {
      this.allCoinsData = res.data;
      this.dataSource.data = this.data.concatData;
    });
  }

  /**
   * Init sort
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /**
   * Add coin
   * @param id
   */
  addCoin(id: number){
    this.chartService.getCoinsById(id).subscribe((res) => {
      this.coins.push(res.data.coin);
      this.dataSource.data = this.chartComponent.buildGraph(this.coins);
      this.selectedAdd = false;
    });
  }

  /**
   * Remove coin
   * @param id
   */
  removeCoin(id: number){
    this.coins = this.coins.filter((item)=>item.id !== id);
    this.dataSource.data = this.chartComponent.buildGraph(this.coins);
    this.selectedRemove = false;
  }

  /**
   * Disable button if select showed coin
   * @param id
   * @returns {any}
   */
  checkShowedCoin(id: number){
    let flag;
    for(var i = 0; i < this.coins.length; i+=1){
      if(this.coins[i].id === id){
        flag = true;
      }
    }
    return flag;
  }

  /**
   * Exepor table to csv file
   * @param data
   */
  exportCsv(data){
    data = data.map((item)=>{ return {
      date: moment(item.date).format('D/MM/YY'),
      value: item.value,
      name: item.name
    }
    })
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }
}
