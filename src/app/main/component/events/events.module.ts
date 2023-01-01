import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AgmCoreModule } from '@agm/core';
import { environment } from '@environment/environment.js';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedMainModule } from '@shared/shared-main.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuillModule } from 'ngx-quill';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { HttpClient } from '@angular/common/http';
import { CreateEditEventsComponent } from './components/create-edit-events/create-edit-events.component';
import { MatNativeDateModule } from '@angular/material/core';
import { EventDateTimePickerComponent } from './components/event-date-time-picker/event-date-time-picker.component';
import { MapEventComponent } from './components/map-event/map-event.component';
import { ImagesContainerComponent } from './components/images-container/images-container.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ImagesSliderComponent } from './components/event-details/images-slider/images-slider.component';
import { MatMenuModule } from '@angular/material/menu';
import { EventScheduleInfoComponent } from './components/event-details/event-schedule-info/event-schedule-info.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { EventScheduleButtonComponent } from './components/event-details/event-schedule-button/event-schedule-button.component';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    pan: { direction: Hammer.DIRECTION_ALL },
    swipe: { direction: Hammer.DIRECTION_ALL }
  };
}

@NgModule({
  declarations: [
    EventsComponent,
    EventsListComponent,
    CreateEditEventsComponent,
    EventDateTimePickerComponent,
    MapEventComponent,
    ImagesContainerComponent,
    EventDetailsComponent,
    ImagesSliderComponent,
    EventScheduleInfoComponent,
    EventScheduleButtonComponent
  ],
  imports: [
    RatingModule.forRoot(),
    ReactiveFormsModule,
    GooglePlaceModule,
    CommonModule,
    EventsRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    NgxPaginationModule,
    AgmCoreModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiMapKey,
      libraries: ['places']
    }),
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
    MatBottomSheetModule
  ],
  exports: [TranslateModule],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useFactory: () => new MyHammerConfig()
    }
  ]
})
export class EventsModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
