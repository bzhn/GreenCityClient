import { ChatModule } from './../chat/chat.module';
import { ConfirmRestorePasswordGuard } from './service/route-guards/confirm-restore-password.guard';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { environment } from '@environment/environment';
import { RestoreComponent } from '@global-auth/restore/restore.component';
import { InterceptorService } from '../shared/interceptors/interceptor.service';
import { CoreModule } from '@global-core/core.module';
import { AuthModule } from './component/auth/auth.module';
import { HomeModule } from './component/home/home.module';
import { LayoutModule } from './component/layout/layout.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorComponent } from '@global-errors/error/error.component';
import { PendingChangesGuard } from '@global-service/pending-changes-guard/pending-changes.guard';
import { MaterialModule } from '../material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditPhotoPopUpComponent } from '@shared/components/edit-photo-pop-up/edit-photo-pop-up.component';

@NgModule({
  declarations: [MainComponent, ErrorComponent],
  imports: [
    NgbModule,
    LayoutModule,
    AuthModule,
    CoreModule,
    HomeModule,
    InfiniteScrollModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxPaginationModule,
    MaterialModule,
    SharedModule,
    ChatModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false }
    },
    DatePipe,
    PendingChangesGuard,
    ConfirmRestorePasswordGuard
  ],
  exports: [MainComponent]
})
export class MainModule {}
