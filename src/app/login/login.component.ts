import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  userLogin: any = null;
  hospital_name: any;

  constructor(private fb: FormBuilder, private services: AppService) {
    this.hospital_name = sessionStorage.getItem('hospital_name');
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginSubmit() {
    let formData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };
    this.services.post('Login', formData).then(async (value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.success) {
          this.userLogin = value.result;
          // console.log(this.user.fName);
          sessionStorage.setItem(
            'userName',
            this.userLogin.fName + ' ' + this.userLogin.lName
          );
          sessionStorage.setItem('userRole', this.userLogin.role);
          await this.services.alertTimer('success', 'เข้าสู่ระบบสำเร็จ');
          this.services.navRouter('/Drug/List');
        } else {
          this.services.alert('warning', value.message, '');
          sessionStorage.clear();
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
