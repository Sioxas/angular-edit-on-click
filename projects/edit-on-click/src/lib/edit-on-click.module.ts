import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { EditOnClickDirective } from './edit-on-click.directive';
import { InputComponent } from './input.component';
import { MinmaxInputComponent } from './minmax-input.component';
import { SelectInputComponent } from './select-input.component';

@NgModule({
  declarations: [
    EditOnClickDirective,
    InputComponent,
    MinmaxInputComponent,
    SelectInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
  ],
  exports: [
    EditOnClickDirective
  ],
  entryComponents:[
    InputComponent,
    MinmaxInputComponent,
    SelectInputComponent,
  ]
})
export class EditOnClickModule { }
