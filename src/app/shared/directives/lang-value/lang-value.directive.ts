import { Directive, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Directive({
  selector: '[appLangValue]'
})
export class LangValueDirective implements OnInit, OnDestroy, OnChanges {
  @Input() appLangValue: { ua: string; en: string } | { ua: string[]; en: string[] };
  @Input() prefix: string;
  @Input() suffix: string;

  private el: ElementRef = inject(ElementRef);
  private languageService: LanguageService = inject(LanguageService);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.languageService
      .getCurrentLangObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateLangValue();
      });
    this.updateLangValue(); // Initialize the value on directive load
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateLangValue();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateLangValue() {
    const prefix = this.prefix ?? '';
    const suffix = this.suffix ?? '';
    const langValue = this.languageService.getLangValue(this.appLangValue.ua, this.appLangValue.en);

    this.el.nativeElement.textContent = `${prefix}${langValue}${suffix}`;
  }
}
