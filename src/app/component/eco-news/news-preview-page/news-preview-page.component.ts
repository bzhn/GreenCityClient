import { Component, OnInit } from '@angular/core';
import { singleNewsImages } from '../../../../assets/img/icon/econews/single-news-images';
import { CreateEcoNewsService } from '../../../service/eco-news/create-eco-news.service';
import {NewsDTO, NewsResponseDTO} from '../create-news/create-news-interface';
import {Router} from "@angular/router";

@Component({
  selector: 'app-news-preview-page',
  templateUrl: './news-preview-page.component.html',
  styleUrls: ['./news-preview-page.component.css']
})
export class NewsPreviewPageComponent implements OnInit {
  private images = singleNewsImages;
  private previewItem: any;
  private validData: any;
  private actualDate = new Date();

  constructor(private createEcoNewsService: CreateEcoNewsService,
              private router: Router
  ) { }

  ngOnInit() {
    this.setPreviewItem();
    this.setValidData();
  }

  private setPreviewItem(): void {
    this.previewItem = this.createEcoNewsService.getFormData();
  }

  private setValidData(): void {
    this.validData = this.previewItem.valid;
  }

  private postNewsItem(): void {
    const language = this.createEcoNewsService.getLang();
    this.createEcoNewsService.sendFormData(this.previewItem,
                                           language).
                                           subscribe(
                                              (successRes: NewsResponseDTO) => {
                                               this.router.navigate(['/news']);
                                             }
      );
  }

}
