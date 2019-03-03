# Angular EditOnClick

在点击文本时变为输入框，配合 [NG-ZORRO](https://github.com/NG-ZORRO/ng-zorro-antd) 使用 

[Demo](http://sioxas.github.io/edit-on-click/) 

## 安装

```bash
npm install edit-on-click --save
```
```typescript
import { EditOnClickModule } from 'edit-on-click';

@NgModule({
  imports: [ EditOnClickModule ]
})
export class AppModule {
}
```

## 如何使用

### 基本用法
```html
<p [(editOnClick)]="text">{{text}}</p>
```
```typescript
text = 'Click me!';
```
### 使用配置项
#### 指定输入框类型为 number
```html
<p [(editOnClick)]="count" [editOnClickConfig]="{type:'number'}">{{count}}</p>
```
```typescript
count = 10;
```
#### 指定输入框类型为 select
```html
<p [(editOnClick)]="name" [editOnClickConfig]="selectConfig">{{name}}</p>
```
```typescript
name = '小笼包';
selectConfig: EditOnClickConfig = {
  type: 'select',
  selectOptions: [
    { label: '小笼包', value: '小笼包' },
    { label: '小龙虾', value: '小龙虾' },
    { label: '生煎', value: '生煎' },
    { label: '馄饨', value: '馄饨' },
  ]
};
```

## API
### `EditOnClickConfig`
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 输入框的类型 | `'text'｜'number'｜'minmax'｜'select'｜'email'｜'password'｜'textarea'` | `'text'` |
| `size` | 输入框的大小，和 NG-ZORRO 中 `input` `[nzSize]` 一致 | `'large'｜'small'｜'default'` | `'small'` |
| `width` | 输入框的宽度，单位为`px` | `number` | `60` `select` 类型默认为 `100` |
| `editable` | 是否可编辑 | `boolean` | `true` |
| `required` | 是否允必填 | `boolean` | `true` |
| `max` | 最大值 | `number` | - |
| `min` | 最小值 | `number` | - |
| `step` | 精度 | `number` | `1` |
| `maxLength` | 最大长度 | `number` | - |
| `pattern` | 用于验证输入字段的正则表达式 | `RegExp` | - |
| `selectOptions` | `select` 类型输入框的选项 | `Array<{ label: string｜number; value: any; selected?: boolean; }>` | - |
| `placeholder` | 表单元素的占位文本 | `string` | - |
