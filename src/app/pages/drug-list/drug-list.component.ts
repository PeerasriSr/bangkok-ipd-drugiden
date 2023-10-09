import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.scss'],
})
export class DrugListComponent implements OnInit {
  constructor(private services: AppService) {
    this.userRole = sessionStorage.getItem('userRole');

    if (this.userRole) {
      if (this.userRole == 'admin') {
        this.displayAllDrug = [
          'orderitemcode',
          'orderitemTHname',
          'cstnum',
          'shape',
          'color',
          'img',
          'uses',
          'sendmachine',
        ];
      } else {
        this.displayAllDrug = [
          'orderitemcode',
          'orderitemTHname',
          'cstnum',
          'shape',
          'color',
          'img',
          'uses',
        ];
      }
    } else {
      this.displayAllDrug = [
        'orderitemTHname',
        'shape',
        'color',
        'img',
        'uses',
      ];
    }
  }

  ngOnInit(): void {
    this.getAllDrug();
    this.getAllImg();
  }

  isLoading = false;
  showBtnPrint = false;
  userRole: any = null;

  listAllDrug: Array<any> = [];
  dataAllDrug: any;
  @ViewChild('sortAllDrug') sortAllDrug!: MatSort;
  @ViewChild('paginAllDrug') paginAllDrug!: MatPaginator;
  displayAllDrug: string[] = [];

  listImg: Array<any> = [];
  arrPrint: Array<any> = [];

  async getAllDrug() {
    this.showBtnPrint = false;
    this.isLoading = true;
    this.arrPrint = [];
    this.listAllDrug = [];
    this.dataAllDrug = null;
    this.services.get('ListAllDrug').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listAllDrug = value.result;
          // console.log(this.listAllDrug)
          // this.listAllDrug.forEach((e, i) => {
          //   let key = {
          //     orderitemcode: e.orderitemcode,
          //   };
          //   this.services.post('atmsSelectImg', key).then((value: any) => {
          //     // console.log(value);
          //     if (value.connect) {
          //       if (value.rowCount > 0) {
          //         const bytes = new Uint8Array(
          //           value.result[0]['tblt_image1']['data']
          //         );
          //         const binary = bytes.reduce(
          //           (acc, byte) => acc + String.fromCharCode(byte),
          //           ''
          //         );
          //         const base64String = btoa(binary);
          //         e.img = `data:image/png;base64,${base64String}`;
          //         // console.log(e.img)
          //         this.arrPrint.push(e);
          //       }
          //     } else {
          //       this.services.alert(
          //         'error',
          //         'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          //         'โปรดติดต่อผู้ดูแลระบบ'
          //       );
          //     }
          //   });
          // });

          // setTimeout(() => {
          //   this.showBtnPrint = true;
          // }, 2000);
          this.dataAllDrug = new MatTableDataSource(this.listAllDrug);
          this.dataAllDrug.sort = this.sortAllDrug;
          this.dataAllDrug.paginator = this.paginAllDrug;
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

  getAllImg() {
    this.listImg = [];
    this.services.get('atmsAllImg').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listImg = value.result;
          this.listAllDrug.forEach((e) => {
            this.listImg.forEach((i) => {
              if (e.orderitemcode === i.tblt_cd) {
                const bytes = new Uint8Array(i.tblt_image1.data);
                const binary = bytes.reduce(
                  (acc, byte) => acc + String.fromCharCode(byte),
                  ''
                );
                const base64String = btoa(binary);
                e.img = `data:image/png;base64,${base64String}`;
                this.arrPrint.push(e);
              }
            });
          });
          this.showBtnPrint = true;
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

  drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = filterValue.trim().toLowerCase();
  }

  async switchDrug(el: any) {
    // console.log(el);
    let txt: any = '';
    (await el.sendmachine) == 'Y' ? (txt = 'ไม่') : '';
    await this.services
      .confirm('warning', txt + 'ส่งเครื่อง', el.orderitemTHname)
      .then((cf: any) => {
        if (cf) {
          el.sendmachine == 'Y'
            ? (el.sendmachine = 'N')
            : (el.sendmachine = 'Y');
          let formData = {
            orderitemcode: el.orderitemcode,
            sendmachine: el.sendmachine,
          };
          this.services.post('SwitchSendRobot', formData).then((value: any) => {
            // console.log(value);
            if (value.connect) {
              if (value.result.affectedRows > 0) {
                this.services.alertTimer('success', 'แก้ไขข้อมูลสำเร็จ', ' ');
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
  }

  viewImg(e: any) {
    // console.log(e);
    Swal.fire({
      title: e.orderitemTHname + '\n(' + e.shape + ' ' + e.color + ')',
      imageUrl: e.img,
      imageAlt: 'Popup Image',
      // confirmButtonText: 'ปิด',
      showCloseButton: true,
      showConfirmButton: false,
      width: `800px`,
    });
  }

  async selectMachine(e: any) {
    // console.log(e);
    this.dataAllDrug = null;
    if (e == 'All') {
      this.dataAllDrug = new MatTableDataSource(this.listAllDrug);
    } else {
      let selectDrug: Array<any> = [];
      this.listAllDrug.forEach((el, i) => {
        if (el.sendmachine == e) {
          selectDrug.push(el);
        }
      });
      this.dataAllDrug = new MatTableDataSource(selectDrug);
    }
    this.dataAllDrug.sort = this.sortAllDrug;
    this.dataAllDrug.paginator = this.paginAllDrug;
  }

  printPreview() {
    // สร้างหน้าพรีวิว
    const printWindow = window.open('', '', 'width=800,height=600') as Window;

    // คัดลอก HTML ที่คุณต้องการพิมพ์ลงในหน้าพรีวิว
    const printElement = document.querySelector('.print');
    if (printElement) {
      const contentToPrint = printElement.outerHTML;

      // Use the existing printWindow variable to open the document
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>ระบบจัดยาอัตโนมัติ</title>
            <!-- Add any CSS or styles you want to apply to the print preview -->
            <link rel="stylesheet" href="styles.css">
          </head>
          <body>${contentToPrint}</body>
        </html>
      `);
      printWindow.document.close();

      printWindow.print();
      // printWindow.close();
    } else {
      console.error("Element with class 'print' not found.");
    }
  }
}
