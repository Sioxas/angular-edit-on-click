import { Component, Inject, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { INPUT_PORTAL_DATA } from './injection-token';
import { EditOnClickComponent, InputComponentConfig } from './common';

@Component({
    selector: 'app-input',
    template: `
        <input #input nz-input [nzSize]="size"
            style="text-align:center;"
            [style.width.px]="width"
            [attr.type]="type"
            [required]="required"
            [attr.maxlength]="maxLength"
            [attr.max]="max"
            [attr.min]="min"
            [attr.step]="step"
            [attr.placeholder]="placeholder"
            [ngModel]="value"
            (ngModelChange)="change($event)"
            (keyup.enter)="enter()"
            (keyup.esc)="noop()">
    `,
    styles: [`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
        /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }`]
})
export class InputComponent implements AfterViewInit, OnInit, EditOnClickComponent {
    value: number | string;
    type: 'text' | 'number';
    required: boolean = true;
    width: number = 60;
    max: number;
    min: number;
    step: number;
    maxLength: number;
    placeholder: string;
    size: 'small' | 'large' | 'default' = 'small';
    @Output() valueChange = new EventEmitter();
    @Output() submit = new EventEmitter();
    @Output() cancel = new EventEmitter<void>();
    @ViewChild('input') input: ElementRef<HTMLInputElement>;
    get valid() {
        if (this.input)
            return this.input.nativeElement.validity.valid;
        else
            return false;
    }
    constructor(@Inject(INPUT_PORTAL_DATA) public data: InputComponentConfig) {
        this.value = data.initialValue;
        const config = data.config;
        if (!config) return;
        if (config.required === false) {
            this.required = false;
        }
        if (config.type === 'number') {
            this.type = 'number';
        } else {
            this.type = 'text';
        }
        if (typeof config.max === 'number') {
            this.max = config.max;
        }
        if (typeof config.min === 'number') {
            this.min = config.min;
        }
        this.step = config.step;
        this.maxLength = config.maxLength;
        this.placeholder = config.placeholder;
        if (config.size) {
            this.size = config.size;
        }
        if (config.width) {
            this.width = config.width;
        }
    }
    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        this.input.nativeElement.focus();
    }

    change($event) {
        if (this.input.nativeElement.validity) {
            if (this.type == 'number') {
                this.value = Number($event);
            } else {
                this.value = $event;
            }
            this.valueChange.emit(this.value);
        }
    }
    enter() {
        if (this.input.nativeElement.validity.valid) {
            this.submit.emit(this.value);
        }
    }
    noop() {
        this.cancel.emit();
    }
}
