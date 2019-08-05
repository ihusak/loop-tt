import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ChartService} from './chart.service';
import * as d3 from 'd3';
import * as moment from 'moment';
import {tick} from '@angular/core/testing';

const DEFAULT_IDS: string = '1,2,6';
const DEFAULT_PERIOD: string = '30d';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
/**
 * Build cahrt component
 */
export class ChartComponent implements OnInit {

  coins;
  data;
  @ViewChild('chartElement', { static: false }) chartElement: ElementRef;

  private margin: any = { top: 20, bottom: 20, left: 50, right: 50};
  private chart: any;
  private width: number;
  private height: number;
  private svg: any;

  constructor(public chartService: ChartService) { }

  ngOnInit() {
    /**
     * Call init graph with default params
     */
    this.chartService.getCoins(DEFAULT_IDS, DEFAULT_PERIOD).subscribe((res) => {
      this.coins = res.data.coins;
      this.buildGraph(this.coins);
    });
  }

  /**
   * Buld graph callback
   * @param data
   * @returns {any[]}
   */
  public buildGraph(data){
    // variables
    let timeStamp = this.generateTimeStamp(data[0].history.length);
    let element = this.chartElement.nativeElement;
    this.width = element.offsetWidth - this.margin.right - this.margin.left;
    this.height = 500;
    this.data = this.prepareData(data, timeStamp);
    // element.remove()
    d3.select("svg").remove()
    let yDomain = d3.scaleBand()
      .domain(this.data.concatData.map((d) => {
        return d.value;
      }))
      .range([ 0, this.height ]);


    let xDomain = d3.scaleTime()
      .domain(<[Date, Date]>d3.extent(this.data.concatData, (d) => {
        return d['date'];
      }))
      .range([ 0, this.width ]);

    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yDomain));

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(xDomain)
        .tickFormat(d3.timeFormat('%Y-%m-%d')));
    // create legend
    let legend = this.svg.selectAll(".legend")
      .data(this.data.changedData).enter()
      .append("g")
      .attr('transform', `translate(0, ${this.height + 50})`)
      .attr('class', 'legendItem');

    legend.append("rect")
      .attr("x", function (d, i){
        if(i % 2 !== 0){
          return 120;
        }
      })
      .attr("y", function(d, i) {
        if(i % 2 !== 0){
          if(i === 1){
            return 0;
          }else {
            return ((20 * i) / 2) - 10;
          }
        }else {
          return 10 * i;
        }
      })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i) {
        return d.color
      });
    legend.append("text")
      .attr("x", function (d, i){
        if(i % 2 !== 0){
          return 140;
        }else {
          return 20;
        }
      })
      .attr("dy", "0.75em")
      .attr("y", function(d, i) {
        if(i % 2 !== 0){
          if(i === 1){
            return 0;
          }else {
            return ((20 * i) / 2) - 10;
          }
        }else {
          return 10 * i;
        }
      })
      .text(function(d) {
        return d.name
      })
      .attr("font-size", "12px");
    // calculate position of lines coordinates
    var value = d3.line()
      .x(function(d) {
        return xDomain(d['date']);
      })
      .y(function(d) {
        return yDomain(d['value']);
      });
    // build wrapper for path
    this.chart = this.svg.append('g')
      .attr('class', 'lines');
    // init path build
    this.data.changedData.forEach((d,i)=>{
      this.chart.append('path')
        .attr('chart-name', d.symbol)
        .attr('stroke', d.color)
        .attr('class', 'line')
        .attr('d', value(d.history));
    });
    // call hover function
    this.hoverEvent(this, {x: xDomain, y: yDomain});
    return this.data.concatData;
  }

  /**
   * Prepare date for using
   * @param data
   * @param dates
   * @returns {{changedData: any; concatData: any[]}}
   */
   private prepareData(data, dates){
    let modifyData, fullData = [];
    for(var i = 0; i < data.length; i+=1) {
      modifyData = data[i].history.map((item, index) => {
        return {
          date: new Date(dates[index]).getTime(),
          value: item.length ? Math.floor(item) <= 0 ? Math.ceil(item*10000)/10000 : Math.floor(item) : Math.floor(item.value) <= 0 ? Math.ceil(item.value*10000)/10000 : Math.floor(item.value),
          name: data[i].name
        }
      });
      data[i].history = modifyData;
      fullData = [...fullData, ...modifyData];
    }
    return {changedData: data, concatData: fullData};
  }

  /**
   * Generate days from today
   * @param count
   * @returns {any[]}
   */
  private generateTimeStamp(count){
    let result = [];
    for(var i = count; i >= 0; i-=1){
      result.push(moment().subtract(i,'d').format('YYYY-MM-DD'));
    }
    return result;
  }

  /**
   * Hover event on chart graph
   * @param data
   * @param domains
   */
  private hoverEvent(data, domains){
    let self = data;
    let tooltip = d3.select('#tooltip');
    let tooltipLine = self.svg.append('line');
    let tipBox = self.svg.append('rect')
      .attr('width', self.width)
      .attr('height', self.height)
      .attr('class', 'tipBox')
      .attr('opacity', 0)
      .on('mousemove', drawTooltip)
      .on('mouseout', removeTooltip);
    // show tooltip
    function drawTooltip() {
      const day = domains.x.invert(d3.mouse(this)[0]);
      tooltipLine.attr('stroke', 'black')
        .attr('x1', domains.x(day))
        .attr('x2', domains.x(day))
        .attr('y1', 0)
        .attr('y2', self.height);
      tooltip
        .html('<div class="date">'+ moment(day).format('YYYY-MM-DD') + '</div>')
        .style('display', 'block')
        .style('left', (d3.mouse(this)[0] + 60) + 'px')
        .style('background-color', '#fff')
        .selectAll()
        .data(self.data.changedData).enter()
        .append('div')
        .attr('class', 'item-info')
        .html(function (d) {
          return '<div class="name-item">' + d['name'] + '</div>' + '<div class="number-item">' + d['history'].find(function (h) {
            return moment(h.date).format('YYYY-MM-DD') == moment(day).format('YYYY-MM-DD');
          }).value + '</div>';
        })
    }
    // hide tooltip
    function removeTooltip() {
      if (tooltip) tooltip.style('display', 'none');
      if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }
  }

}
