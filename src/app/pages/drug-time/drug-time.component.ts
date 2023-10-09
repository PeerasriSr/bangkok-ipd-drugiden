import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
  FormArray,
} from '@angular/forms';

const _window: any = window;

@Component({
  selector: 'app-drug-time',
  templateUrl: './drug-time.component.html',
  styleUrls: ['./drug-time.component.scss'],
})
export class DrugTimeComponent implements OnInit {
  constructor(private services: AppService, private formBuilder: FormBuilder) {
    this.userRole = sessionStorage.getItem('userRole');
    if (this.userRole == 'admin') {
      this.displayAllTime = ['timecode', 'timeTH', 'timecount', 'edit', 'del'];
      this.displayTimeDetail = [
        'timedetailcode',
        'timedetailTH',
        'edit',
        'del',
      ];
    } else {
      this.displayAllTime = ['timecode', 'timeTH', 'timecount'];
      this.displayTimeDetail = ['timedetailcode', 'timedetailTH'];
    }
  }

  ngOnInit(): void {
    this.getTimeDetail();
  }

  isLoading = false;
  userRole: any = null;

  listAllTime: Array<any> = [];
  dataAllTime: any;
  @ViewChild('sortAllTime') sortAllTime!: MatSort;
  @ViewChild('paginAllTime') paginAllTime!: MatPaginator;
  displayAllTime: string[] = [];
  async getAllTime() {
    this.isLoading = true;
    this.listAllTime = [];
    this.dataAllTime = null;
    this.services.get('msTime').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listAllTime = value.result;
          // console.log(this.listAllTime);
          this.dataAllTime = new MatTableDataSource(this.listAllTime);
          this.dataAllTime.sort = this.sortAllTime;
          this.dataAllTime.paginator = this.paginAllTime;
          this.selectTime(
            this.listAllTime[0]['timecode'],
            this.listAllTime[0]['rowNum']
          );
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

  listTimeDetail: Array<any> = [];
  dataTimeDetail: any;
  @ViewChild('sortTimeDetail') sortTimeDetail!: MatSort;
  @ViewChild('paginTimeDetail') paginTimeDetail!: MatPaginator;
  displayTimeDetail: string[] = [];
  async getTimeDetail() {
    this.isLoading = true;
    this.listTimeDetail = [];
    this.services.get('msTimeDetail').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listTimeDetail = value.result;
          // console.log(this.listTimeDetail);
        }
        this.isLoading = false;
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
      this.getAllTime();
    });
  }

  selectRow: any;
  selectTimecode: any;
  async selectTime(timecode: any, n: any) {
    // console.log(timecode, n);
    this.selectRow = n;
    this.selectTimecode = timecode;
    let arr: Array<any> = [];
    this.listTimeDetail.forEach((el) => {
      if (el.timecode == timecode) {
        arr.push(el);
      }
    });
    this.dataTimeDetail = null;
    this.dataTimeDetail = new MatTableDataSource(arr);
    this.dataTimeDetail.sort = this.sortTimeDetail;
    this.dataTimeDetail.paginator = this.paginTimeDetail;
  }

  formTime = new FormGroup({
    timecodeOld: new FormControl('', [Validators.required]),
    timecodeNew: new FormControl('', [Validators.required]),
    timeTH: new FormControl('', [Validators.required]),
    timecount: new FormControl('', [Validators.required]),
  });

  timeText: any;

  async editTime(e: any) {
    // console.log(e);
    this.timeText = 'แก้ไข';
    this.formTime.patchValue({
      timecodeOld: e['timecode'],
      timecodeNew: e['timecode'],
      timeTH: e['timeTH'],
      timecount: e['timecount'],
    });
    _window.$(`#timeModal`).modal('show');
  }

  async submitUpdateTime() {
    if (this.formTime.valid) {
      await this.services
        .confirm('warning', 'ยืนยันที่จะเปลี่ยนแปลงข้อมูล')
        .then((cf: any) => {
          if (cf) {
            let formData = {
              timecodeOld: this.formTime.value.timecodeOld,
              timecodeNew: this.formTime.value.timecodeNew,
              timeTH: this.formTime.value.timeTH,
              timecount: this.formTime.value.timecount,
            };
            this.services.post('updateTime', formData).then((value: any) => {
              // console.log(value);
              if (value.connect) {
                if (value.result.affectedRows > 0) {
                  _window.$(`#timeModal`).modal('hide');
                  this.services.alertTimer('success', 'แก้ไขข้อมูลสำเร็จ', ' ');
                  this.getAllTime();
                  this.getTimeDetail();
                } else {
                  this.services.alertTimer(
                    'error',
                    'แก้ไขข้อมูลไม่สำเร็จ',
                    'โปรดติดต่อผู้ดูแลระบบ'
                  );
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
        });
    } else {
      this.services.alert('warning', 'กรุณากรอกข้อมูลให้ครบถ้วน', '');
    }
  }

  formTimeDetail = new FormGroup({
    timecode: new FormControl('', [Validators.required]),
    timedetail_H_Old: new FormControl('', [Validators.required]),
    timedetail_M_Old: new FormControl('', [Validators.required]),
    timedetailcode_H_New: new FormControl('', [Validators.required]),
    timedetailcode_M_New: new FormControl('', [Validators.required]),
    timedetailTH: new FormControl('', [Validators.required]),
  });

  async editTimeDetail(e: any) {
    // console.log(e);
    this.timeText = 'แก้ไข';
    this.formTimeDetail.patchValue({
      timecode: e['timecode'],
      timedetail_H_Old: e['timedetailcode'].substring(0, 2),
      timedetail_M_Old: e['timedetailcode'].substring(2, 4),
      timedetailcode_H_New: e['timedetailcode'].substring(0, 2),
      timedetailcode_M_New: e['timedetailcode'].substring(2, 4),
      timedetailTH: e['timedetailTH'],
    });
    _window.$(`#timeDetailModal`).modal('show');
  }

  async submitUpdateTimeDetail() {
    if (this.formTimeDetail.valid) {
      let H = this.formTimeDetail.value.timedetailcode_H_New;
      let M = this.formTimeDetail.value.timedetailcode_M_New;

      if (parseInt(H) >= 0 && parseInt(H) < 24) {
        if (parseInt(M) >= 0 && parseInt(M) < 60) {
          H = H.padStart(2, 0);
          M = M.padStart(2, 0);
          await this.services
            .confirm(
              'warning',
              'ยืนยันที่จะเปลี่ยนแปลงข้อมูล',
              this.formTimeDetail.value.timedetail_H_Old +
                '' +
                this.formTimeDetail.value.timedetail_M_Old +
                ' -> ' +
                H +
                '' +
                M
            )
            .then((cf: any) => {
              if (cf) {
                let formData = {
                  timecode: this.formTimeDetail.value.timecode,
                  timedetailOld:
                    this.formTimeDetail.value.timedetail_H_Old +
                    '' +
                    this.formTimeDetail.value.timedetail_M_Old,
                  timedetailcodeNew: H + '' + M,
                  timedetailTH: this.formTimeDetail.value.timedetailTH,
                };
                // console.log(formData);
                this.services
                  .post('updateTimeDetail', formData)
                  .then((value: any) => {
                    // console.log(value);
                    if (value.connect) {
                      if (value.result.affectedRows > 0) {
                        _window.$(`#timeDetailModal`).modal('hide');
                        this.services.alertTimer(
                          'success',
                          'แก้ไขข้อมูลสำเร็จ',
                          ' '
                        );
                        this.getTimeDetail();
                      } else {
                        this.services.alertTimer(
                          'error',
                          'แก้ไขข้อมูลไม่สำเร็จ',
                          'โปรดติดต่อผู้ดูแลระบบ'
                        );
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
            });
        } else {
          this.services.alert(
            'warning',
            'รูปแบบ นาที ไม่ถูกต้อง',
            'กรุณากรอกข้อมูลระหว่าง 00 - 59'
          );
        }
      } else {
        this.services.alert(
          'warning',
          'รูปแบบ ชั่วโมง ไม่ถูกต้อง',
          'กรุณากรอกข้อมูลระหว่าง 00 - 23'
        );
      }
    } else {
      this.services.alert('warning', 'กรุณากรอกข้อมูลให้ครบถ้วน', '');
    }
  }

  async insertTime() {
    this.timeText = 'เพิ่ม';
    this.formTime.patchValue({
      timecodeOld: '0',
      timecodeNew: '',
      timeTH: '',
      timecount: '',
    });
    _window.$(`#timeModal`).modal('show');
  }

  async submitInsertTime() {
    if (this.formTime.valid) {
      await this.services
        .confirm('warning', 'ยืนยันที่จะเพิ่มข้อมูล')
        .then((cf: any) => {
          if (cf) {
            let formData = {
              timecodeNew: this.formTime.value.timecodeNew,
              timeTH: this.formTime.value.timeTH,
              timecount: this.formTime.value.timecount,
            };
            this.services.post('insertTime', formData).then((value: any) => {
              // console.log(value);
              if (value.connect) {
                if (value.result.affectedRows > 0) {
                  _window.$(`#timeModal`).modal('hide');
                  this.services.alertTimer('success', 'เพิ่มข้อมูลสำเร็จ', ' ');
                  this.getAllTime();
                  this.getTimeDetail();
                } else {
                  this.services.alertTimer(
                    'error',
                    'เพิ่มข้อมูลไม่สำเร็จ',
                    'โปรดติดต่อผู้ดูแลระบบ'
                  );
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
        });
    } else {
      this.services.alert('warning', 'กรุณากรอกข้อมูลให้ครบถ้วน', '');
    }
  }

  async insertTimeDetail() {
    // console.log(this.selectTimecode);
    this.timeText = 'เพิ่ม';
    this.formTimeDetail.patchValue({
      timecode: '0',
      timedetail_H_Old: '00',
      timedetail_M_Old: '00',
      timedetailcode_H_New: '',
      timedetailcode_M_New: '',
      timedetailTH: '',
    });
    _window.$(`#timeDetailModal`).modal('show');
  }

  async submitInsertTimeDetail() {
    if (this.formTimeDetail.valid) {
      await this.services
        .confirm('warning', 'ยืนยันที่จะเพิ่มข้อมูล')
        .then((cf: any) => {
          if (cf) {
            let formData = {
              timecode: this.selectTimecode,
              timedetailcode_H_New:
                this.formTimeDetail.value.timedetailcode_H_New,
              timedetailTH: this.formTimeDetail.value.timedetailTH,
            };
            this.services
              .post('insertTimeDetail', formData)
              .then((value: any) => {
                // console.log(value);
                if (value.connect) {
                  if (value.result.affectedRows > 0) {
                    _window.$(`#timeDetailModal`).modal('hide');
                    this.services.alertTimer(
                      'success',
                      'เพิ่มข้อมูลสำเร็จ',
                      ' '
                    );
                    this.getTimeDetail();
                  } else {
                    this.services.alertTimer(
                      'error',
                      'เพิ่มข้อมูลไม่สำเร็จ',
                      'โปรดติดต่อผู้ดูแลระบบ'
                    );
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
        });
    } else {
      this.services.alert('warning', 'กรุณากรอกข้อมูลให้ครบถ้วน', '');
    }
  }

  async deleteTimeDetail(e: any) {
    // console.log(e);
    await this.services
      .confirm('warning', 'ยืนยันที่จะลบข้อมูล')
      .then((cf: any) => {
        if (cf) {
          let formData = {
            timecode: this.selectTimecode,
            timedetailcode: e.timedetailcode,
          };
          this.services
            .post('deleteTimeDetail', formData)
            .then((value: any) => {
              // console.log(value);
              if (value.connect) {
                if (value.result.affectedRows > 0) {
                  this.services.alertTimer('success', 'ลบข้อมูลสำเร็จ', ' ');
                  this.getTimeDetail();
                } else {
                  this.services.alertTimer(
                    'error',
                    'ลบข้อมูลไม่สำเร็จ',
                    'โปรดติดต่อผู้ดูแลระบบ'
                  );
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
      });
  }

  async deleteTime(e: any) {
    // console.log(e);
    await this.services
      .confirm('warning', 'ยืนยันที่จะลบข้อมูล')
      .then((cf: any) => {
        if (cf) {
          let formData = {
            timecode: e.timecode,
          };
          this.services.post('deleteTime', formData).then((value: any) => {
            // console.log(value);
            if (value.connect) {
              if (value.result.affectedRows > 0) {
                this.services.alertTimer('success', 'ลบข้อมูลสำเร็จ', ' ');
                this.getAllTime();
                this.getTimeDetail();
              } else {
                this.services.alertTimer(
                  'error',
                  'ลบข้อมูลไม่สำเร็จ',
                  'โปรดติดต่อผู้ดูแลระบบ'
                );
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
      });
  }

  drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAllTime.filter = filterValue.trim().toLowerCase();
  }
}
