import { Component, EventEmitter, Inject, ViewChild, ElementRef, Output, AfterViewInit } from '@angular/core';
import { EditOnClickComponent, InputComponentConfig, MinMax } from './common';
import { INPUT_PORTAL_DATA } from './injection-token';

@Component({
  selector: 'app-minmax-input',
  template: `
        <nz-input-group nzCompact (keyup.enter)="enter()" (keyup.esc)="noop()">
            <input #minInput nz-input class="min"
                type="number"
                placeholder="最小值"
                [required]="required"
                [attr.max]="max"
                [attr.min]="limitMin"
                [attr.step]="step"
                [nzSize]="size"
                [ngModel]="min"
                (ngModelChange)="minChange($event)">
            <input type="text" disabled nz-input placeholder="~" class="middle">
            <input #maxInput nz-input class="max"
                type="number"
                placeholder="最大值"
                [required]="required"
                [attr.max]="limitMax"
                [attr.min]="min"
                [attr.step]="step"
                [nzSize]="size"
                [ngModel]="max"
                (ngModelChange)="maxChange($event)">
        </nz-input-group>
    `,
  styles: [`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            /* display: none; <- Crashes Chrome on hover */
            -webkit-appearance: none;
            margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
        }
        .min{
            width:60px;
            text-align: center;
        }
        .middle{
            width: 30px;
            border-left: 0px;
            pointer-events: none;
            background-color: rgb(255, 255, 255);
        }
        .max{
            width: 60px;
            text-align: center;
            border-left: 0px;
        }
    `],
})
export class MinmaxInputComponent implements EditOnClickComponent, AfterViewInit {
  @Output() valueChange = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  get valid(): boolean {
    if (this.minInput && this.maxInput) {
      return this.minInput.nativeElement.validity.valid && this.maxInput.nativeElement.validity.valid;
    } else {
      return false;
    }
  }

  min: number;
  max: number;
  private minmax: MinMax;
  limitMin: number;
  limitMax: number;
  step: number;
  required: boolean = true;
  width: number = 60;
  size: 'small' | 'large' | 'default' = 'small';
  @ViewChild('minInput') minInput: ElementRef<HTMLInputElement>;
  @ViewChild('maxInput') maxInput: ElementRef<HTMLInputElement>;
  constructor(@Inject(INPUT_PORTAL_DATA) public data: InputComponentConfig) {
    const config = data.config;
    if (this.data.initialValue instanceof MinMax) {
      this.minmax = this.data.initialValue;
      if (this.data.initialValue.decimal !== null && this.data.initialValue.decimal !== undefined)
        this.step = 1 / Math.pow(10, this.data.initialValue.decimal);
    } else {
      this.minmax = new MinMax(this.data.initialValue.min, this.data.initialValue.max);
    }
    this.min = this.minmax.min;
    this.max = this.minmax.max;
    if (!config) return;
    if (config.step) {
      this.step = config.step;
    }
    if (config.required === false) {
      this.required = false;
    }
    if (typeof config.max === 'number') {
      this.limitMax = config.max;
    }
    if (typeof config.min === 'number') {
      this.limitMin = config.min;
    }
    if (config.size) {
      this.size = config.size;
    }
  }
  ngAfterViewInit(): void {
    this.minInput.nativeElement.focus();
  }

  enter() {
    if (this.valid) {
      this.submit.emit(this.minmax);
    }
  }
  noop() {
    this.cancel.emit();
  }
  minChange($event) {
    this.min = Number($event);
    this.minmaxChange();
  }
  maxChange($event) {
    this.max = Number($event);
    this.minmaxChange();
  }

  minmaxChange() {
    this.minmax.min = this.min;
    this.minmax.max = this.max;
    this.minmax = new MinMax(this.minmax);
    if (this.maxInput.nativeElement.validity.valid && this.minInput.nativeElement.validity.valid) {
      this.valueChange.emit(this.minmax);
    }
  }
}
