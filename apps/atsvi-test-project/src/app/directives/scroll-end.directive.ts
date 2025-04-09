import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appScrollEnd]',
})
export class ScrollEndDirective {
  readonly scrollEnd = output<void>();

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;

    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 480) {
      this.scrollEnd.emit();
    }
  }
}
