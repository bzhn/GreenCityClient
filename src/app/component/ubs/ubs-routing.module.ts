import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageGuardService } from '@global-service/route-guards/auth-page-guard.service';
import { UBSOrderFormComponent } from './components/ubs-order-form/ubs-order-form.component';
import { UbsComponent } from './ubs.component';

const ubsRoutes: Routes = [
  { path: '',
    component: UbsComponent,
    canActivate: [ AuthPageGuardService ],
    children: [
      { path: '', component: UBSOrderFormComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(ubsRoutes)],
  exports: [RouterModule]
})
export class UbsRoutingModule { }
