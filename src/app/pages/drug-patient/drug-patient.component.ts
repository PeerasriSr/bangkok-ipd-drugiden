import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drug-patient',
  templateUrl: './drug-patient.component.html',
  styleUrls: ['./drug-patient.component.scss'],
})
export class DrugPatientComponent implements OnInit {
  constructor(private services: AppService) {}

  ngOnInit(): void {
    this.formatDate = new Date(new Date().setDate(new Date().getDate()));
    this.getAllWard();
  }

  isLoading = false;

  formatDate: any = null;
  formattedDate = moment(new Date()).format('YYYY-MM-DD');
  campaign = new FormGroup({
    picker: new FormControl(new Date(new Date().setDate(new Date().getDate()))),
  });

  listWard: Array<any> = [];

  wardSelect: any = null;

  listPatientInWard: Array<any> = [];
  dataPatientInWard: any;
  displayPatientInWard = ['bedcode', 'hnPnt', 'anPnt', 'patientname'];
  @ViewChild('sortPatientInWard') sortPatientInWard!: MatSort;
  @ViewChild('paginPatientInWard') paginPatientInWard!: MatPaginator;

  patientDetail: any = null;
  listOrderDetail: Array<any> = [];
  dataOrderDetail: any;
  displayOrderDetail = [
    'prescriptionno',
    // 'detail'
  ];
  @ViewChild('sortOrderDetail') sortOrderDetail!: MatSort;
  @ViewChild('paginOrderDetail') paginOrderDetail!: MatPaginator;

  async getAllWard() {
    this.isLoading = true;
    this.listWard = [];
    this.services.get('listAllWard').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listWard = value.result;
          // console.log(this.listWard);
        }
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

  async dateChange(event: any) {
    this.formatDate = new Date(event.value);
    this.formattedDate = moment(this.formatDate).format('YYYY-MM-DD');
  }

  async selectWard(e: any) {
    // console.log(e.value.wardcode);
    this.wardSelect = e.value.wardcode;
  }

  async submitSeach() {
    // console.log(this.formattedDate);
    // console.log(this.wardSelect);
    this.wardSelect
      ? this.getPatientInWard()
      : this.services.alert('warning', 'กรุณาเลือกหอผู้ป่วย', '');
  }

  async getPatientInWard() {
    this.isLoading = true;
    this.listPatientInWard = [];
    let key = {
      dateCode: this.formattedDate,
      wardCode: this.wardSelect,
    };
    this.services.post('listPatientInWard', key).then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listPatientInWard = value.result;
          // console.log(this.listPatientInWard);
          this.dataPatientInWard = new MatTableDataSource(
            this.listPatientInWard
          );
          this.dataPatientInWard.sort = this.sortPatientInWard;
          this.dataPatientInWard.paginator = this.paginPatientInWard;
        } else {
          this.services.alert(
            'warning',
            'ไม่พบข้อมูลของหอผู้ป่วยที่ท่านเลือก',
            ''
          );
        }
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

  async selectPatient(e: any) {
    // console.log(e);
    this.patientDetail = e;
    this.isLoading = true;
    this.listOrderDetail = [];
    let key = {
      dateCode: this.formattedDate,
      wardCode: this.wardSelect,
      hn: e.hn,
    };
    this.services.post('listOderPatient', key).then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listOrderDetail = value.result;
          // console.log(this.listOrderDetail);
          this.listOrderDetail.forEach((e) => {
            let key = {
              prescriptionno: e.prescriptionno,
            };
            this.services.post('listOderDetail', key).then((value: any) => {
              // console.log(value);
              if (value.connect) {
                if (value.rowCount > 0) {
                  let arr: Array<any> = [];
                  arr = value.result;
                  arr.forEach((a) => {
                    let path = {
                      orderitemcode: a.orderitemcode,
                    };
                    this.services
                      .post('atmsSelectImg', path)
                      .then((value: any) => {
                        // console.log(value);
                        if (value.connect) {
                          if (value.rowCount > 0) {
                            const bytes = new Uint8Array(
                              value.result[0]['tblt_image1']['data']
                            );
                            const binary = bytes.reduce(
                              (acc, byte) => acc + String.fromCharCode(byte),
                              ''
                            );
                            const base64String = btoa(binary);
                            a.img = `data:image/png;base64,${base64String}`;
                            // console.log(e.img)
                          }
                        } else {
                        }
                      });
                  });
                  e.detail = arr;
                } else {
                }
              } else {
                this.services.alert(
                  'error',
                  'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
                  'โปรดติดต่อผู้ดูแลระบบ'
                );
              }
            });
          });
          this.dataOrderDetail = new MatTableDataSource(this.listOrderDetail);
          this.dataOrderDetail.sort = this.sortOrderDetail;
          this.dataOrderDetail.paginator = this.paginOrderDetail;
        } else {
        }
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

  viewImg(e: any) {
    // console.log(e);
    Swal.fire({
      title: e.orderitemname,
      imageUrl: e.img,
      imageAlt: 'Popup Image',
      // confirmButtonText: 'ปิด',
      showCloseButton: true,
      showConfirmButton: false,
      width: `800px`,
    });
  }

  back() {
    this.listOrderDetail = [];
    this.patientDetail = null;
  }
}
