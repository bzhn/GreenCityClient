import { ComponentFixture, TestBed, fakeAsync, flush, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CustomTooltipDirective } from './custom-tooltip.directive';

@Component({
  template: `<div appCustomTooltip [appCustomTooltip]="tooltipContent" [tooltip]="tooltip" [font]="font"></div>`
})
class TestComponent {
  tooltipContent = 'Test Tooltip';
  tooltip = {
    showTooltip: jasmine.createSpy('showTooltip'),
    hide: jasmine.createSpy('hide')
  };
  font = '16px Arial';
}

describe('CustomTooltipDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTooltipDirective, TestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directiveElement = fixture.debugElement.query(By.directive(CustomTooltipDirective));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind tooltipContent property', () => {
    expect(directiveElement.injector.get(CustomTooltipDirective).tooltipContent).toEqual(component.tooltipContent);
  });

  it('should apply to elements with appCustomTooltip selector', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const element = fixture.nativeElement.querySelector('[appCustomTooltip]');
    expect(element).toBeTruthy();
    const directive = fixture.debugElement.query(By.directive(CustomTooltipDirective)).injector;
    expect(directive).toBeTruthy();
  });

  xit('should hide tooltip on mouse enter if text width does not exceed container width', fakeAsync(() => {
    const eventMock = { target: { offsetWidth: 200, innerText: 'Some text' } };
    directiveElement.triggerEventHandler('mouseenter', eventMock);
    flush();
    fixture.detectChanges();

    expect(component.tooltip.hide).toHaveBeenCalled();
  }));

  it('should hide tooltip on mouse leave', () => {
    directiveElement.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect(component.tooltip.hide).toHaveBeenCalled();
  });

  it('should show tooltip when mouse enters with wide text', () => {
    const eventMock = {
      target: { offsetWidth: 200, innerText: 'Some text Some text Some text Some text Some text Some text Some text Some text' }
    };
    const tooltip = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    };
    directiveElement.triggerEventHandler('mouseenter', eventMock);
    fixture.detectChanges();
    component.tooltip.showTooltip(eventMock, tooltip, component.font);
    fixture.detectChanges();
    expect(tooltip.show).not.toHaveBeenCalled();
  });
});
