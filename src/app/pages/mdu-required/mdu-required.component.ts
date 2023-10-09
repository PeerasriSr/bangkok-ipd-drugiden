import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mdu-required',
  templateUrl: './mdu-required.component.html',
  styleUrls: ['./mdu-required.component.scss'],
})
export class MduRequiredComponent implements OnInit {
  isLoading = false;
  currentDate: any;
  currentTime: any;

  listAllMdu: Array<any> = [];
  dataAllMdu: any;
  @ViewChild('sortAllMdu') sortAllMdu!: MatSort;
  @ViewChild('paginAllMdu') paginAllMdu!: MatPaginator;
  displayAllMdu: string[] = [
    'orderitemcode',
    'orderitemname',
    'mdu',
    'count',
    'total',
  ];

  selectRow: any;
  wardName: any;
  numItemWard: any = 0;
  listWardMdu: Array<any> = [];
  dataWardMdu: any;
  @ViewChild('sortWardMdu') sortWardMdu!: MatSort;
  @ViewChild('paginWardMdu') paginWardMdu!: MatPaginator;
  displayWardMdu: string[] = [
    'orderitemcode',
    'orderitemname',
    'mdu',
    'count',
    'total',
  ];

  listWard: Array<any> = [];
  dataWard: any;
  @ViewChild('sortWard') sortWard!: MatSort;
  @ViewChild('paginWard') paginWard!: MatPaginator;
  displayWard: string[] = ['warddesc'];

  constructor(private services: AppService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getAllWard();
    this.getAllMdu();
    this.getWardMdu();
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // setInterval(() => {
    //   this.currentTime = this.datePipe.transform(new Date(), 'HH:mm:ss');
    //   // console.log(this.currentTime);
    // }, 1000);
  }

  async getAllWard() {
    this.listWard = [];
    this.services.get('listAllWard').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listWard = value.result;
          // console.log(this.listWard);
          this.dataWard = new MatTableDataSource(this.listWard);
          this.dataWard.sort = this.sortWard;
          this.dataWard.paginator = this.paginWard;
        }
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
    });
  }

  async getAllMdu() {
    this.isLoading = true;
    this.listAllMdu = [];
    this.dataAllMdu = null;
    this.services.get('allMDURequiredV2').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listAllMdu = value.result;
          // console.log(this.listAllMdu);
          this.dataAllMdu = new MatTableDataSource(this.listAllMdu);
          this.dataAllMdu.sort = this.sortAllMdu;
          this.dataAllMdu.paginator = this.paginAllMdu;
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

  async getWardMdu() {
    this.listWardMdu = [];
    this.services.get('wardMDURequiredV2').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listWardMdu = value.result;
          // console.log(this.listWardMdu);
          const wardCodeCount = this.countByWardCode(this.listWardMdu);
          this.listWard.forEach((el) => {
            for (const wardcode in wardCodeCount) {
              if (el.wardcode == wardcode) {
                el.note = wardCodeCount[wardcode];
              }
            }
          });
          this.selectWard(this.listWard[0]);
        }
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
    });
  }

  countByWardCode = (data: { wardcode: string }[]) => {
    return data.reduce(
      (count: Record<string, number>, obj: { wardcode: string }) => {
        const wardcode = obj.wardcode;
        count[wardcode] = (count[wardcode] || 0) + 1;
        return count;
      },
      {}
    );
  };

  async selectWard(el: any) {
    // console.log(el);
    this.selectRow = el.rowNum;
    this.wardName = el.warddesc;
    this.dataWardMdu = null;
    let arr: Array<any> = [];
    this.listWardMdu.forEach((ward) => {
      if (ward.wardcode == el.wardcode) {
        arr.push(ward);
      }
    });
    this.numItemWard = arr.length;
    if (this.numItemWard > 0) {
      this.dataWardMdu = new MatTableDataSource(arr);
      this.dataWardMdu.sort = this.sortWardMdu;
      this.dataWardMdu.paginator = this.paginWardMdu;
    }
  }
}
