import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { GoogleMapsModule } from '@angular/google-maps';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedMainModule } from '@shared/shared-main.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuillModule } from 'ngx-quill';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { EventsListComponent } from './components';
import { HttpClient } from '@angular/common/http';
import { EventEditorComponent } from './components/event-editor/event-editor.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PlaceOnlineComponent } from './components/event-editor/components/create-event-dates/components/place-online/place-online.component';
import { MapEventComponent } from './components/map-event/map-event.component';
import { ImagesContainerComponent } from './components/event-editor/components/create-event-information/components/images-container/images-container.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ImagesSliderComponent } from './components/event-details/images-slider/images-slider.component';
import { MatMenuModule } from '@angular/material/menu';
import { EventScheduleOverlayComponent } from './components/event-details/event-schedule-overlay/event-schedule-overlay.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { EventScheduleComponent } from './components/event-details/event-schedule/event-schedule.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { CommentsModule } from '../comments/comments.module';
import { CommentsService } from '../comments/services/comments.service';
import { EventsCommentsService } from './services/events-comments.service';
import { CreateEventInformationComponent } from './components/event-editor/components/create-event-information/create-event-information.component';
import { CreateEventDatesComponent } from './components/event-editor/components/create-event-dates/create-event-dates.component';
import { MatChipsModule } from '@angular/material/chips';
import { DateTimeComponent } from './components/event-editor/components/create-event-dates/components/date-time/date-time.component';
import { UpdateEventComponent } from './components/update-event/update-event.component';
import { EventStoreService } from './services/event-store.service';

@NgModule({
  declarations: [
    EventsComponent,
    EventsListComponent,
    EventEditorComponent,
    PlaceOnlineComponent,
    MapEventComponent,
    ImagesContainerComponent,
    EventDetailsComponent,
    ImagesSliderComponent,
    EventScheduleOverlayComponent,
    EventScheduleComponent,
    CreateEventInformationComponent,
    CreateEventDatesComponent,
    DateTimeComponent,
    UpdateEventComponent
  ],
  imports: [
    MatDialogModule,
    RatingModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    EventsRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    NgxPaginationModule,
    GoogleMapsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    SharedMainModule,
    SharedModule,
    InfiniteScrollModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    QuillModule.forRoot(),
    MatMenuModule,
    DragDropModule,
    MatBottomSheetModule,
    NgbDropdownModule,
    MatIconModule,
    MatDividerModule,
    CommentsModule,
    MatChipsModule
  ],
  providers: [{ provide: CommentsService, useClass: EventsCommentsService }, EventStoreService],
  exports: [TranslateModule]
})
export class EventsModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
