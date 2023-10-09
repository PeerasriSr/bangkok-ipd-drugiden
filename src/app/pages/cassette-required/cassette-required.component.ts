import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cassette-required',
  templateUrl: './cassette-required.component.html',
  styleUrls: ['./cassette-required.component.scss'],
})
export class CassetteRequiredComponent implements OnInit {
  isLoading = false;
  currentDate: any;
  currentTime: any;
 

  listAllCst: Array<any> = [];
  dataAllCst: any;
  @ViewChild('sortAllCst') sortAllCst!: MatSort;
  @ViewChild('paginAllCst') paginAllCst!: MatPaginator;
  displayAllCst: string[] = [
    'orderitemcode',
    'orderitemname',
    'cst_num',
    'total',
    'tblt_qty',
    'cst',
  ];

  selectRow: any;
  wardCode: any;
  wardName: any;
  numItemWard: any = 0;
  listWardCst: Array<any> = [];
  dataWardCst: any;
  @ViewChild('sortWardCst') sortWardCst!: MatSort;
  @ViewChild('paginWardCst') paginWardCst!: MatPaginator;
  displayWardCst: string[] = [
    'orderitemcode',
    'orderitemname',
    'cst_num',
    'total',
    'tblt_qty',
    'cst',
  ];

  listWard: Array<any> = [];
  dataWard: any;
  @ViewChild('sortWard') sortWard!: MatSort;
  @ViewChild('paginWard') paginWard!: MatPaginator;
  displayWard: string[] = ['warddesc'];

  constructor(private services: AppService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getAllWard();
    this.getAllCst();
    this.getWardCst();
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

  async getAllCst() {
    this.isLoading = true;
    this.listAllCst = [];
    this.dataAllCst = null;
    this.services.get('allCassetteRequired').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listAllCst = value.result;
          // console.log(this.listAllCst);
          this.dataAllCst = new MatTableDataSource(this.listAllCst);
          this.dataAllCst.sort = this.sortAllCst;
          this.dataAllCst.paginator = this.paginAllCst;
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

  async getWardCst() {
    this.listWardCst = [];
    this.services.get('wardCassetteRequired').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listWardCst = value.result;
          // console.log(this.listWardCst);
          const wardCodeCount = this.countByWardCode(this.listWardCst);
          this.listWard.forEach((el) => {
            for (const wardcode in wardCodeCount) {
              if (el.wardcode == wardcode) {
                el.note = wardCodeCount[wardcode];
              }
            }
          });
          this.selectWard(this.listWard[0])
        }
        this.isLoading = false;
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
      this.isLoading = false;
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

  allRefill = false;
  async selectAllRefill() {
    this.allRefill = !this.allRefill;
    if (this.allRefill) {
      let arr: Array<any> = [];
      this.listAllCst.forEach((el) => {
        if (el.cst > 0) {
          arr.push(el);
        }
      });
      this.dataAllCst = new MatTableDataSource(arr);
    } else {
      this.dataAllCst = new MatTableDataSource(this.listAllCst);
    }
    this.dataAllCst.sort = this.sortAllCst;
    this.dataAllCst.paginator = this.paginAllCst;
  }

  async selectWard(el: any) {
    // console.log(el);    
    this.isChecked = false;
    this.selectRow = el.rowNum;  
    this.wardCode = el.wardcode; 
    this.wardName = el.warddesc;    
    this.dataWardCst = null;
    let arr: Array<any> = [];
    this.listWardCst.forEach((ward) => {
      if (ward.wardcode == this.wardCode) {
        arr.push(ward);
      }
    });
    this.numItemWard = arr.length;
    if (this.numItemWard > 0) {
      this.dataWardCst = new MatTableDataSource(arr);
      this.dataWardCst.sort = this.sortWardCst;
      this.dataWardCst.paginator = this.paginWardCst;
    }
  }

  isChecked: boolean = false;
  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    let arr: Array<any> = [];
    if (this.isChecked) {
      this.listWardCst.forEach((ward) => {
        if (ward.wardcode == this.wardCode) {
          if (ward.cst > 0) {
            arr.push(ward);
          }
        }
      });
    } else {
      this.listWardCst.forEach((ward) => {
        if (ward.wardcode == this.wardCode) {
          arr.push(ward);
        }
      });
    }
    this.dataWardCst = new MatTableDataSource(arr);
    this.dataWardCst.sort = this.sortWardCst;
    this.dataWardCst.paginator = this.paginWardCst;
  }
}
