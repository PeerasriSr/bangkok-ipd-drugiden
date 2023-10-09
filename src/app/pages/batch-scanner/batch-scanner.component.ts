import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-batch-scanner',
  templateUrl: './batch-scanner.component.html',
  styleUrls: ['./batch-scanner.component.scss'],
})
export class BatchScannerComponent implements OnInit {
  constructor(private services: AppService) {}

  ngOnInit(): void {
    // this.test()
  }

  isLoading = false;
  isScan = false;
  batchId: any = null;
  patient: any = null;
  listDrug: Array<any> = [];

  onScan() {
    this.isScan = !this.isScan;
    this.listDrug = [];
    this.patient = null;
  }

  onEvent(e: any): void {
    // console.log(e[0]['value']);
    this.batchId = e[0]['value'];
    this.isLoading = true;
    let key = {
      batchId: this.batchId,
    };
    // console.log(key);
    this.services.post('getBatchId', key).then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listDrug = value.result;
          this.patient = value.result[0];
          // console.log(this.patient);
          this.patient.AdminDate = this.formatDate(this.patient.AdminDate);
          this.patient.AdminTime = this.formatTime(this.patient.AdminTime);
          this.listDrug.forEach((e) => {
            let path = {
              orderitemcode: e.MedicationId,
            };
            this.services.post('atmsSelectImg', path).then((value: any) => {
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
                  e.img = `data:image/png;base64,${base64String}`;
                  // console.log(e.img)
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
        } else {
          this.services.alert('warning', 'ไม่พบข้อมูล', '');
        }
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
      this.isLoading = false;
      this.isScan = false;
    });
  }

  test(): void {
    // console.log(e[0]['value']);
    this.batchId = '0815133000005';
    this.isLoading = true;
    let key = {
      batchId: this.batchId,
    };
    // console.log(key);
    this.services.post('getBatchId', key).then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listDrug = value.result;
          this.patient = value.result[0];
          // console.log(this.patient);
          this.patient.AdminDate = this.formatDate(this.patient.AdminDate);
          this.patient.AdminTime = this.formatTime(this.patient.AdminTime);
          this.listDrug.forEach((e) => {
            let path = {
              orderitemcode: e.MedicationId,
            };
            this.services.post('atmsSelectImg', path).then((value: any) => {
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
                  e.img = `data:image/png;base64,${base64String}`;
                  // console.log(e.img)
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
        } else {
          this.services.alert('warning', 'ไม่พบข้อมูล', '');
        }
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
      this.isLoading = false;
      this.isScan = false;
    });
  }

  formatDate(e: any) {
    const y = e.substring(0, 4);
    const m = e.substring(4, 6);
    const d = e.substring(6, 8);
    return d + '/' + m + '/' + y;
  }

  formatTime(e: any) {
    const h = e.substring(0, 2);
    const m = e.substring(2, 4);
    const s = e.substring(4, 6);
    return h + ':' + m + ':' + s;
  }

  clear() {
    this.listDrug = [];
  }
}
