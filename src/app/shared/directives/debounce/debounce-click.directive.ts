import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Directive({
  selector: '[debounceClick]'
})
export class DebounceClickDirective {
    @Input() debounceTime = 1000;
    @Output() debounceClick = new EventEmitter();
    private clicks = new Subject();
    private subscription: Subscription;
  constructor() { }
  ngOnInit() {
    this.subscription = this.clicks
      .pipe(debounceTime(this.debounceTime))
      .subscribe(e => this.debounceClick.emit(e));
    }

    ngOnDestroy() {
      if(this.subscription)
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event) { 
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
        console.log('debounce click');
    }

}
