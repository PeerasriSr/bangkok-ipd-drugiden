import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';

import { DrugListComponent } from './pages/drug-list/drug-list.component';
import { CassetteRequiredComponent } from './pages/cassette-required/cassette-required.component';
import { MduRequiredComponent } from './pages/mdu-required/mdu-required.component';
import { CassetteDispensComponent } from './pages/cassette-dispens/cassette-dispens.component';
import { DrugTimeComponent } from './pages/drug-time/drug-time.component';
import { DrugPatientComponent } from './pages/drug-patient/drug-patient.component';
import { BatchScannerComponent } from './pages/batch-scanner/batch-scanner.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: 'Drug/List',
        component: DrugListComponent,
      },
      {
        path: 'Drug/Patient',
        component: DrugPatientComponent,
      },
      {
        path: 'Batch/Scanner',
        component: BatchScannerComponent,
      },
      {
        path: '',
        redirectTo: 'Drug/List',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'Login',
    component: LoginComponent,
  },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'Drug/List',
        component: DrugListComponent,
      },
      {
        path: 'Drug/Patient',
        component: DrugPatientComponent,
      },
      {
        path: 'Batch/Scanner',
        component: BatchScannerComponent,
      },
      {
        path: 'Cassette/Required',
        component: CassetteRequiredComponent,
      },
      {
        path: 'MDU/Required',
        component: MduRequiredComponent,
      },
      {
        path: 'Cassette/Dispense',
        component: CassetteDispensComponent,
      },
      {
        path: 'Drug/Time',
        component: DrugTimeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
