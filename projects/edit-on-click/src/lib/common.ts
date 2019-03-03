import { Type, EventEmitter } from '@angular/core';

export interface EditOnClickConfig {
  type?: 'text' | 'number' | 'time' | 'date' | 'datetime' | 'minmax' | 'select' | 'email' | 'password' | 'color' | 'textarea';
  size?: 'default' | 'small' | 'large';
  width?: number;
  editable?: boolean;
  required?: boolean;
  placeholder?: string;
  min?: number | Date;
  max?: number | Date;
  maxLength?: number;
  pattern?: RegExp;
  step?: number;
  selectOptions?: Array<{ label: string | number; value: any; selected?: boolean; }>;
  autoSize?: boolean | { minRows: number; maxRows: number };
}

export interface InputComponentConfig {
  initialValue: any;
  config?: EditOnClickConfig;
}

export interface EditOnClickComponent {
  valueChange: EventEmitter<any>;
  submit: EventEmitter<any>;
  cancel: EventEmitter<void>;
  valid: boolean;
}

export class MinMax {
  public min: number;
  public max: number;
  public decimal: number;
  constructor(minmax: MinMax, decimal?: number);
  constructor(min: number, max: number, decimal?: number);
  constructor(x: MinMax | number, y: number = 0, decimal?: number) {
    if (typeof x === 'number') {
      this.min = x;
      this.max = y;
      this.decimal = decimal;
    } else {
      this.min = x.min;
      this.max = x.max;
      this.decimal = x.decimal;
      if (y !== 0) {
        this.decimal = y;
      }
    }
  }
  toString() {
    if (this.decimal !== null && this.decimal !== undefined) {
      return `${this.min.toFixed(this.decimal)} ~ ${this.max.toFixed(this.decimal)}`;
    } else {
      return `${this.min} ~ ${this.max}`;
    }
  }
}
