import { ConfirmRestorePasswordGuard } from './main/service/route-guards/confirm-restore-password.guard';
import { HomepageComponent } from 'src/app/main/component/home/components';
import { ConfirmRestorePasswordComponent } from '@global-auth/index';
import { SearchAllResultsComponent } from 'src/app/main/component/layout/components';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UbsAdminGuard } from '@ubs/ubs-admin/ubs-admin-guard.guard';
import { AchievementListComponent } from '@global-user/components';
import { UbsUserGuard } from '@ubs/ubs-user/ubs-user-guard.guard';
import { NonAdminGuard } from 'src/app/shared/guards/non-admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'ubs',
        loadChildren: () => import('./ubs/ubs/ubs-order.module').then((mod) => mod.UbsOrderModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ubs'
      },
      {
        path: 'about',
        loadChildren: () => import('./main/component/about/about.module').then((mod) => mod.AboutModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'places',
        loadChildren: () => import('./main/component/places/places.module').then((mod) => mod.PlacesModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'news',
        loadChildren: () => import('./main/component/eco-news/eco-news.module').then((mod) => mod.EcoNewsModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'events',
        loadChildren: () => import('./main/component/events/events.module').then((mod) => mod.EventsModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./main/component/user/user.module').then((mod) => mod.UserModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'search',
        component: SearchAllResultsComponent,
        canActivate: [NonAdminGuard]
      },
      {
        path: 'auth/restore',
        component: ConfirmRestorePasswordComponent,
        canActivate: [ConfirmRestorePasswordGuard, NonAdminGuard]
      },
      {
        path: 'greenCity',
        component: HomepageComponent,
        canActivate: [NonAdminGuard]
      },
      { path: 'achievements', component: AchievementListComponent, canActivate: [NonAdminGuard] }
    ]
  },
  {
    path: 'ubs-admin',
    loadChildren: () => import('./ubs/ubs-admin/ubs-admin.module').then((mod) => mod.UbsAdminModule),
    canLoad: [UbsAdminGuard]
  },
  {
    path: 'ubs-user',
    loadChildren: () => import('./ubs/ubs-user/ubs-user.module').then((mod) => mod.UbsUserModule),
    canLoad: [UbsUserGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
