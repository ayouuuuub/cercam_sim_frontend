import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Directive({
  selector: '[debounceOut]'
})
export class DebounceOutDirective {
    @Input() debounceTime = 200;
    @Output() debounceOut = new EventEmitter();
    private moves = new Subject();
    private subscription: Subscription;
  constructor() { }
  ngOnInit() {
    this.subscription = this.moves
      .pipe(debounceTime(this.debounceTime))
      .subscribe(e => this.debounceOut.emit(e));
    }

    ngOnDestroy() {
      if(this.subscription)
        this.subscription.unsubscribe();
    }

    @HostListener('mouseleave', ['$event'])
    moveEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.moves.next(event);
        console.log('debounce out');
    }

}
