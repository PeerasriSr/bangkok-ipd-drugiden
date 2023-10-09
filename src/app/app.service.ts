import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public production: boolean = false;
  // public rootPath: string = 'http://localhost:3000/';

  //ตากสิน
  public rootPath: string = 'http://192.168.123.111:3000/';

  //เวชการุญ
  // public rootPath: string = "http://192.168.106.127:3000/";

  //ราชพิพัฒน์
  // public rootPath: string = "http://192.168.148.57:3000/";

  //เจริญกรุง
  // public rootPath: string = "http://192.168.64.246:3000/";

  //สิรินธร
  // public rootPath: string = 'http://192.168.110.34:3000/';

  //กลาง
  // public rootPath: string = 'http://192.168.32.126:3000/';

  constructor(private http: HttpClient, private router: Router) {}

  public get(path: string) {
    this.production = true;
    return new Promise((resolve) => {
      this.http
        .get(this.rootPath + path)
        .toPromise()
        .then((value: any) => {
          resolve({ connect: true, ...value });
          this.production = false;
        })
        .catch((reason: any) => {
          resolve({ connect: false, ...reason });
          this.production = false;
        });
    });
  }

  public post(path: string, data: any) {
    this.production = true;
    return new Promise((resolve) => {
      this.http
        .post(this.rootPath + path, data)
        .toPromise()
        .then((value: any) => {
          resolve({ connect: true, ...value });
          this.production = false;
        })
        .catch((reason: any) => {
          resolve({ connect: false, ...reason });
          this.production = false;
        });
    });
  }

  public alertTimer = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  public alert = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: `ตกลง`,
      confirmButtonColor: '#3085d6',
    });
  };

  public confirm = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    return new Promise((res) => {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        cancelButtonColor: '#6c757d',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ตกลง',
        reverseButtons: true,
        focusCancel: true,
        focusConfirm: false,
      }).then((result) => {
        res(result.isConfirmed);
      });
    });
  };

  public navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };
}
