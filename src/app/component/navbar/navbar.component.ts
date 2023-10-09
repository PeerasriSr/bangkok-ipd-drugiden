import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userName: any = null;
  interval: any;

  constructor(private services: AppService) {
    this.getSetting();
    this.userName = sessionStorage.getItem('userName');
    this.timerOut(1);
  }

  ngOnInit(): void {}

  closeLink(){
    const button = document.querySelector(".navbar-toggler") as HTMLButtonElement;
    if (button) {
      button.click();
    }
  }

  goLogout() {
    this.services
      .confirm('warning', 'ออกจากระบบ', '')
      .then(async (val: any) => {
        if (val) {
          this.userName = null;
          sessionStorage.clear();
          window.location.reload();
        }
      });
  }

  timerOut = async (data: any) => {
    if (this.userName) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        // console.log(data);
        if (data == 60 * 15) {
          clearInterval(this.interval);
          this.services.alertTimer('error', 'หมดเวลาการใช้งาน');
          sessionStorage.clear();
          window.location.reload();
        } else {
          data++;
        }
      }, 1000);
    }
  };

  hospSetting: Array<any> = [];
  hospital_name: any;
  async getSetting() {
    this.hospSetting = [];
    this.services.get('hospSetting').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.hospSetting = value.result;
          // console.log(this.hospSetting);
          this.hospital_name = this.hospSetting[0]['hospital_name'];
          sessionStorage.setItem('hospital_name', this.hospital_name);
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
}
