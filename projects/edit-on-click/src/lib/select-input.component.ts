import { Component, EventEmitter, Inject, Output, ViewChild, ComponentRef, AfterViewInit } from '@angular/core';
import { NzSelectComponent } from 'ng-zorro-antd';
import { EditOnClickComponent, InputComponentConfig } from './common';
import { INPUT_PORTAL_DATA } from './injection-token';

@Component({
  selector: 'app-select-input',
  template: `
    <nz-select [style.width.px]="width"
        [nzAllowClear]="!required"
        [ngModel]="value"
        (ngModelChange)="change($event)"
        nzAllowClear
        [nzPlaceHolder]="placeholder"
        [nzSize]="size"
        [nzAutoFocus]="true"
        [nzOpen]="open"
        (keyup.enter)="enter()" (keyup.esc)="noop()">
        <nz-option *ngFor="let option of options" [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
    </nz-select>
    `,
  styles: [``],
})
export class SelectInputComponent implements EditOnClickComponent, AfterViewInit {
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  get valid(): boolean {
    return this.value !== undefined && this.value !== null;
  }
  value: any;
  required: boolean = true;
  width: number = 100;
  placeholder: string;
  size: 'small' | 'large' | 'default' = 'small';
  options: Array<{ label: string | number; value: any; selected?: boolean; }>;
  open = false;
  @ViewChild(NzSelectComponent) selectInput: NzSelectComponent;
  constructor(@Inject(INPUT_PORTAL_DATA) public data: InputComponentConfig) {
    this.value = data.initialValue;
    const config = data.config;
    if (!config) return;
    if (config.required === false) {
      this.required = false;
    }
    this.placeholder = config.placeholder;
    if (config.size) {
      this.size = config.size;
    }
    if (config.width) {
      this.width = config.width;
    }
    if (config.selectOptions) {
      this.options = config.selectOptions;
    }
  }
  ngAfterViewInit(): void {
    this.selectInput.focus();
    setTimeout(() => { this.open = true; }, 200);
  }

  change($event) {
    if ($event !== null && $event !== undefined) {
      this.value = $event;
      this.valueChange.emit($event);
      this.submit.emit(this.value);
    }
  }
  enter() {
    if (this.valid) {
      this.submit.emit(this.value);
    }
  }
  noop() {
    this.cancel.emit();
  }
}
