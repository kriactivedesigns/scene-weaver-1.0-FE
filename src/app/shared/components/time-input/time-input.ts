import { Component, effect, input, OnDestroy, output, signal } from "@angular/core";
import { debounceTime, distinctUntilChanged, Subject, Subscription } from "rxjs";

@Component({
    selector: 'time-input',
    templateUrl: 'time-input.html',
    styleUrl: 'time-input.scss'
})
export class TimeInputComponent implements OnDestroy {

    // Input: The total duration in seconds from the parent component
  durationInSeconds = input.required<number>({ alias: 'duration' });
  
  // Output: Emits the new total duration when the user makes a change
  ondurationchange = output<number>();

  // Local properties to bind to our three input fields
  hours = signal('00');
  minutes = signal('00');
  seconds = signal('00');
  milliseconds = signal('000');

  private durationChangeSubject = new Subject<number>();
  private subscription: Subscription;

  constructor() {
    effect(() => {
        if (this.durationInSeconds()) {
          this.secondsToTimeParts(this.durationInSeconds());
        }
    })

    this.subscription = this.durationChangeSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.ondurationchange.emit(value)
    })
    
  }

  // Converts total seconds into HH, MM, SS for display
  private secondsToTimeParts(totalSeconds: number): void {
    if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;

    const totalIntegerSeconds = Math.floor(totalSeconds);
    const msPart = Math.round((totalSeconds - totalIntegerSeconds) * 1000);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const ms = Math.floor(totalSeconds % 60);
    
    this.hours.set(String(Math.floor(totalIntegerSeconds / 3600)).padStart(2, '0'));
    this.minutes.set(String(Math.floor((totalIntegerSeconds % 3600) / 60)).padStart(2, '0'));
    this.seconds.set(String(totalIntegerSeconds % 60).padStart(2, '0'));
    this.milliseconds.set(String(msPart).padStart(3, '0'));
  }

  // Called whenever the user types in any of the input fields
  onInputChange(part: 'h' | 'm' | 's' | 'ms', value: string): void {
    // Update the corresponding signal
    if (part === 'h') this.hours.set(value);
    if (part === 'm') this.minutes.set(value);
    if (part === 's') this.seconds.set(value);
    if (part === 'ms') this.milliseconds.set(value);

    // Convert the parts back to total seconds and emit the change
    const h = parseInt(this.hours(), 10) || 0;
    const m = parseInt(this.minutes(), 10) || 0;
    const s = parseInt(this.seconds(), 10) || 0;
    const ms = parseInt(this.milliseconds(), 10) || 0;

    const totalDuration = h * 3600 + m * 60 + s + (ms / 1000);

    this.durationChangeSubject.next(totalDuration);
  }

  // Helper to move focus for better keyboard navigation
  onKeyDown(event: KeyboardEvent, currentInput: 'h' | 'm' | 's' | 'ms'): void {
    
    if (event.key !== 'Tab') {
      return;
    }
    event.preventDefault();
   
    const parent = (event.target as HTMLElement).parentElement;
    if (!parent) return;
   
    // Determine the next element to focus
    let nextInputId: string;
    if (event.shiftKey) { // Handle Shift+Tab for reverse tabbing
        if (currentInput === 'h') nextInputId = 'millisecondInput';
        else if (currentInput === 'm') nextInputId = 'hoursInput';
        else if (currentInput === 's') nextInputId = 'minuteInput';
        else nextInputId = 'secondInput'; // from 'ms'
    } else { // Handle forward tabbing
        if (currentInput === 'h') nextInputId = 'minuteInput';
        else if (currentInput === 'm') nextInputId = 'secondInput';
        else if (currentInput === 's') nextInputId = 'millisecondInput';
        else nextInputId = 'hoursInput'; // from 'ms'
    }

    const nextElement = parent.querySelector<HTMLInputElement>(`#${nextInputId}`);
    if (nextElement) {
        nextElement.focus();
    }
  }

  selectText(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}