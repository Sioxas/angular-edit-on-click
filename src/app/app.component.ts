import { Component } from '@angular/core';
import { EditOnClickConfig } from 'edit-on-click';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-edit-on-click';
  text = '点我';
  count = 10;
  name = '小笼包';
  selectConfig:EditOnClickConfig = {
    type:'select',
    selectOptions:[
      {label:'小笼包',value:'小笼包'},
      {label:'小龙虾',value:'小龙虾'},
      {label:'生煎',value:'生煎'},
      {label:'馄饨',value:'馄饨'},
    ]
  };
}
