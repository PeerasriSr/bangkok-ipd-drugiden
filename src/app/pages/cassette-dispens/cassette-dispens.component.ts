import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cassette-dispens',
  templateUrl: './cassette-dispens.component.html',
  styleUrls: ['./cassette-dispens.component.scss'],
})
export class CassetteDispensComponent implements OnInit {
  isLoading = false;
  currentDate: any;
  currentTime: any;
  startDate: any = null;
  endDate: any = null;

  listAllDis: Array<any> = [];
  dataAllDis: any;
  @ViewChild('sortAllDis') sortAllDis!: MatSort;
  @ViewChild('paginAllDis') paginAllDis!: MatPaginator;
  displayAllDis: string[] = [
    'drugCode',
    'drugName',
    'cstNum',
    'total',
    'cstQty',
  ];

  constructor(private services: AppService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyyMMdd');
    this.startDate = moment(this.campaignOne.value.start).format('YYYYMMDD');
    this.endDate = moment(this.campaignOne.value.end).format('YYYYMMDD');
    this.getCtsDis();
  }

  campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format('YYYYMMDD');
  }

  async endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format('YYYYMMDD');
    if (this.endDate !== '19700101') {
      this.getCtsDis();
    }
  }

  async getCtsDis() {
    this.isLoading = true;
    this.listAllDis = [];
    this.dataAllDis = null;
    let key = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    // console.log(key);
    this.services.post('cstDispenAllDay',key).then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listAllDis = value.result;
          // console.log(this.listAllDis);
          this.dataAllDis = new MatTableDataSource(this.listAllDis);
          this.dataAllDis.sort = this.sortAllDis;
          this.dataAllDis.paginator = this.paginAllDis;
        }
        this.isLoading = false;
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
    });
  }
}
