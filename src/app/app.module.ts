import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { MaterialModules } from './materialModule';
import { AppService } from './app.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
// LOAD_WASM().subscribe((res: any) => console.log('LOAD_WASM', res));

// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DrugListComponent } from './pages/drug-list/drug-list.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { LoginComponent } from './login/login.component';

import { MatTableExporterModule } from 'mat-table-exporter';
import { DatePipe } from '@angular/common';
import { CassetteRequiredComponent } from './pages/cassette-required/cassette-required.component';
import { MduRequiredComponent } from './pages/mdu-required/mdu-required.component';
import { CassetteDispensComponent } from './pages/cassette-dispens/cassette-dispens.component';
import { DrugTimeComponent } from './pages/drug-time/drug-time.component';
import { DrugPatientComponent } from './pages/drug-patient/drug-patient.component';
import { BatchScannerComponent } from './pages/batch-scanner/batch-scanner.component';


@NgModule({
  declarations: [
    AppComponent,
    DrugListComponent,
    NavbarComponent,
    LoginComponent,
    CassetteRequiredComponent,
    MduRequiredComponent,
    CassetteDispensComponent,
    DrugTimeComponent,
    DrugPatientComponent,
    BatchScannerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModules,
    MatTableExporterModule,
    NgxScannerQrcodeModule
    // MatProgressSpinnerModule
  ],
  providers: [
    AppService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
