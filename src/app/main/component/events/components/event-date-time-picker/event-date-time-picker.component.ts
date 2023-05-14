import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { DateEventResponceDto, DateFormObj, OfflineDto } from '../../models/events.interface';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-event-date-time-picker',
  templateUrl: './event-date-time-picker.component.html',
  styleUrls: ['./event-date-time-picker.component.scss']
})
export class EventDateTimePickerComponent implements OnInit, OnChanges, AfterViewInit {
  public minDate = new Date();
  public timeArrStart = [];
  public timeArrEnd = [];

  public timeArr: Array<string> = [];

  coordinates: OfflineDto = {
    latitude: 50.43353,
    longitude: 30.53789
  };
  public zoom = 13;
  private geoCoder;
  address: string;

  public isOfline: boolean;
  public autocomplete: google.maps.places.Autocomplete;
  private pipe = new DatePipe('en-US');
  public checkTime = false;
  public checkOfflinePlace = false;
  public checkOnlinePlace = false;
  private regionOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };

  @Input() check: boolean;
  @Input() editDate: DateEventResponceDto;

  @Output() status = new EventEmitter<boolean>();
  @Output() datesForm = new EventEmitter<DateFormObj>();
  @Output() coordOffline = new EventEmitter<OfflineDto>();

  @ViewChild('placesRef') placesRef: ElementRef;

  public dateForm: FormGroup;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit(): void {
    const curDay = new Date().getDate();
    this.minDate.setDate(curDay + 1);
    this.fillTimeArray();

    this.dateForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required])
    });

    this.dateForm.valueChanges.subscribe((value) => {
      this.checkStartTime(value.startTime);
      this.checkEndTime(value.endTime);

      this.coordOffline.emit(this.coordinates);
      this.status.emit(this.dateForm.valid);

      this.datesForm.emit(value);
    });
    if (this.editDate) {
      this.setEditData();
    }
  }

  private setEditData(): void {
    const startEditTime = this.pipe.transform(this.editDate.startDate, 'H:mm');
    const endEditTime = this.pipe.transform(this.editDate.finishDate, 'H:mm');
    if (endEditTime === '23:59') {
      this.checkTime = true;
      this.dateForm.get('startTime').disable();
      this.dateForm.get('endTime').disable();
    }
    this.dateForm.patchValue({
      date: this.editDate.startDate,
      startTime: startEditTime,
      endTime: endEditTime
    });

    if (this.editDate.coordinates.latitude) {
      this.checkOfflinePlace = true;
      this.dateForm.addControl('place', new FormControl('', [Validators.required]));
      setTimeout(() => this.setPlaceAutocomplete(), 0);
      this.coordinates.latitude = this.editDate.coordinates.latitude;
      this.coordinates.longitude = this.editDate.coordinates.longitude;
      this.zoom = 8;
      this.coordOffline.emit(this.coordinates);

      this.dateForm.patchValue({
        place: this.editDate.coordinates.addressEn
      });

      this.coordinates.latitude = this.editDate.coordinates.latitude;
      this.coordinates.longitude = this.editDate.coordinates.longitude;
    }

    if (this.editDate.onlineLink) {
      this.checkOnlinePlace = true;
      this.dateForm.addControl('onlineLink', new FormControl('', [Validators.required, Validators.pattern(Patterns.linkPattern)]));
      this.dateForm.patchValue({
        onlineLink: this.editDate.onlineLink
      });
    }
  }

  public checkIfAllDay(): void {
    this.checkTime = !this.checkTime;
    if (this.checkTime) {
      this.dateForm.get('startTime').disable();
      this.dateForm.get('endTime').disable();
    } else {
      this.dateForm.get('startTime').enable();
      this.dateForm.get('endTime').enable();
    }
  }

  ngOnChanges(): void {
    if (this.check) {
      this.dateForm.markAllAsTouched();
    }
  }

  ngAfterViewInit(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.coordinates.latitude = position.coords.latitude;
        this.coordinates.longitude = position.coords.longitude;
        this.zoom = 15;
        this.getAddress(position.coords.latitude, position.coords.longitude);
      });
    }
  }

  public checkIfOnline(): void {
    this.checkOnlinePlace = !this.checkOnlinePlace;
    this.checkOnlinePlace
      ? this.dateForm.addControl('onlineLink', new FormControl('', [Validators.required, Validators.pattern(Patterns.linkPattern)]))
      : this.dateForm.removeControl('onlineLink');
  }

  public checkIfOffline(): void {
    this.checkOfflinePlace = !this.checkOfflinePlace;
    if (this.checkOfflinePlace) {
      this.isOfline = true;
      this.dateForm.addControl('place', new FormControl('', [Validators.required]));
      setTimeout(() => this.setPlaceAutocomplete(), 0);
    } else {
      this.isOfline = false;
      this.coordinates.latitude = null;
      this.coordinates.longitude = null;
      this.coordOffline.emit(this.coordinates);
      this.autocomplete.unbindAll();
      this.dateForm.removeControl('place');
    }
  }

  private setPlaceAutocomplete(): void {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      this.autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this.regionOptions);

      this.autocomplete.addListener('place_changed', () => {
        const locationName = this.autocomplete.getPlace();

        this.coordinates.latitude = locationName.geometry.location.lat();
        this.coordinates.longitude = locationName.geometry.location.lng();

        this.coordOffline.emit(this.coordinates);

        this.dateForm.patchValue({
          place: locationName.formatted_address
        });
      });
    });
  }
  onChangePickerOnMap(event): void {
    this.coordinates.latitude = event.coords.lat;
    this.coordinates.longitude = event.coords.lng;

    this.getAddress(this.coordinates.latitude, this.coordinates.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          this.dateForm.get('place').setValue(this.address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  private fillTimeArray(): void {
    for (let i = 0; i < 24; i++) {
      this.timeArr.push(`${i}:00`);
      this.timeArrStart.push(`${i}:00`);
      this.timeArrEnd.push(`${i}:00`);
    }
  }

  private checkEndTime(time: string): void {
    if (time) {
      const checkTime = time.split(':');

      this.timeArrStart = [...this.timeArr.slice(0, +checkTime[0])];
    }
  }

  private checkStartTime(time: string): void {
    if (time) {
      const checkTime = time.split(':');
      this.timeArrEnd = +checkTime[0] === 23 ? ['23 : 59'] : [...this.timeArr.slice(+checkTime[0] + 1)];
    }
  }
}
