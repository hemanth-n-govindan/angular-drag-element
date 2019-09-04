# Angular Drag Element

An angular directive to enable html elements to drag in available space. We can control drag option with vertically/horizontally by using axis.

## Usages

## Including in module

```js
import { DragElementModule } from 'angular-drag-element';
@NgModule({
    imports: [
        ....,
        DragElementModule
    ],
    declarations: [YourComponent ],
    exports: [YourComponent],
    bootstrap: [YourComponent],
})
.....


```

## Including in HTML

```html
<div class="card card-small" tabindex="0" [ngx-drag-element]="true">
  <p>Drag Me !</p>
  <p>Based on 'y' axis set input dragAxis="y"</p>
</div>
```

```html
<div
  class="card card-small"
  tabindex="0"
  [ngx-drag-element]="true"
  dragAxis="x"
>
  <p>Drag Me !</p>
  <p>Based on 'x' axis set input dragAxis="x"</p>
</div>
```

```html
<div
  class="card card-small"
  tabindex="0"
  [ngx-drag-element]="true"
  dragAxis="xy"
>
  <p>Drag Me !</p>
  <p>Based on 'xy' axis set input dragAxis="xy"</p>
</div>
```

```html
<div
  class="card card-small"
  tabindex="0"
  [ngx-drag-element]="true"
  dragAxis="x"
  [dragIcon]="true"
  [dragIconInnerText]="dragIconInnerText"
  style="top:450px;left:550px"
  dragElementClass="test"
>
  <p>Drag Me !</p>
  <p>Darg Icon InnerText value as "{{dragIconInnerText}}"</p>
</div>
```

# Example angular-drag-element

[#demo](https://github.com/hemanth-n-govindan/angular-drag-element)
