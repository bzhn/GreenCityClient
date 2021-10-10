import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbsAdminEmployeeComponent } from './components/ubs-admin-employee/ubs-admin-employee.component';
import { UbsClientProfilePageComponent } from './components/ubs-client-profile-page/ubs-client-profile-page.component';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UbsAdminOrderComponent } from './components/ubs-admin-order/ubs-admin-order.component';
import { UbsAdminGuardGuard } from './ubs-admin-guard.guard';
import { UbsAdminCertificateComponent } from './components/ubs-admin-certificate/ubs-admin-certificate.component';
import { UbsAdminTariffsLocationDashboardComponent } from './components/ubs-admin-tariffs/ubs-admin-tariffs-location-dashboard.component';
import { UbsAdminTariffsPricingPageComponent } from './components/ubs-admin-tariffs/ubs-admin-tariffs-pricing-page/ubs-admin-tariffs-pricing-page.component';

const ubsAdminRoutes: Routes = [
  {
    path: '',
    component: UbsAdminComponent,
    canActivate: [UbsAdminGuardGuard],
    children: [
      { path: 'certificates', component: UbsAdminCertificateComponent },
      { path: 'orders', component: UbsAdminTableComponent },
      { path: 'employee/:page', component: UbsAdminEmployeeComponent },
      { path: 'profile', component: UbsClientProfilePageComponent },
      { path: 'order', component: UbsAdminOrderComponent },
      { path: 'tariffs', component: UbsAdminTariffsLocationDashboardComponent },
      { path: `tariffs/location/:id`, component: UbsAdminTariffsPricingPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ubsAdminRoutes)],
  exports: [RouterModule]
})
export class UBSAdminRoutingModule {}
