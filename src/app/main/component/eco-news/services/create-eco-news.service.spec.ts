import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateEcoNewsService } from './create-eco-news.service';
import { environment } from '@environment/environment';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

describe('CreateEcoNewsService', () => {
  let service: CreateEcoNewsService;
  let httpTestingController: HttpTestingController;
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(true, true);

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const form = new FormGroup({
    title: new FormControl('mock news'),
    content: new FormControl('This is mock news content Greencity!!!!!!!!!!!!'),
    tags: new FormArray([new FormControl('News'), new FormControl('Ads')]),
    image: new FormControl(''),
    source: new FormControl('http://mocknews.com')
  });

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [CreateEcoNewsService, { provide: Store, useValue: storeMock }]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(CreateEcoNewsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    service.file = { file: null, url: defaultImagePath };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set newsId', () => {
    const id = 11;
    service.setNewsId(id);
    expect(service.newsId).toEqual(id);
  });

  it('should return formData', () => {
    service.currentForm = new FormGroup({});
    expect(service.getFormData().value).toEqual(service.currentForm.value);
  });

  it('should return newsId', () => {
    service.newsId = 1555;
    expect(service.getNewsId()).toEqual(service.newsId);
  });

  it('should set current form using setForm method', () => {
    service.setForm(form);
    expect(service.currentForm).toEqual(form);
  });

  it('should make POST request', () => {
    service.sendFormData(form).subscribe((newsData) => {
      expect(newsData.title).toEqual('mock news');
    });

    const req = httpTestingController.expectOne(environment.backendLink + `econews`);
    expect(req.request.method).toEqual('POST');
    req.flush(form.value);
  });

  it('should make PUT request', () => {
    service.editNews(form).subscribe((newsData) => {
      expect(newsData.tags[0]).toEqual('News');
    });

    const req = httpTestingController.expectOne(environment.backendLink + 'econews/update');
    expect(req.request.method).toEqual('PUT');
    req.flush(form.value);
  });
});
