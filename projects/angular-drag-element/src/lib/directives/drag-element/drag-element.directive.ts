import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  AfterViewInit,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy
} from "@angular/core";
import { map, flatMap, takeUntil } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";

@Directive({
  selector: "[ngx-drag-element]"
})
export class DragElementDirective implements OnInit, AfterViewInit, OnDestroy {
  /**
   * @description
   * Turn on/off drag option.
   *
   * @usageNotes
   * 'x' axis for horizontal drag
   * 'y' axis for vertical drag
   * 'a' axis for all over document drag
   *  It's case sensitive (use lower case)
   *
   * @default
   * true
   */
  @Input("ngx-drag-element")
  dragElement = true;

  /**
   * @description
   * Set style for drag element
   *
   * @usageNotes
   * All css style can be applied
   *
   * @default
   * undefined
   */
  @Input()
  dragElementClass: string;

  /**
   * @description
   * Provide axis to drag.
   *
   * @usageNotes
   * 'x' axis for horizontal drag
   * 'y' axis for vertical drag
   * 'a' axis for all over document drag
   *  It's case sensitive (use lower case)
   *
   * @default
   * 'y'
   */
  @Input()
  dragAxis: "y" | "x" | "xy" = "y";

  /**
   * @description
   * Show drag icon or not.
   *
   * @usageNotes
   * 'true' will show icon
   * 'false' will hide icon
   *
   * @default
   * true
   */
  @Input()
  dragIcon = false;

  /**
   * @description
   * Specify drag icon element as innerText.
   *
   * @usageNotes
   * Give icon element as innerText in "string" value
   * @example '<i class="fa fa-arrows-v"></i>'
   *
   * @default
   * undefined
   */
  @Input()
  dragIconInnerText;

  private _dragPointerType: string;
  private _initialPosition: { left; top };

  private _mouseDown = new EventEmitter();
  private _mouseMove = new EventEmitter();
  private _mouseup = new EventEmitter();
  private _mouseOut = new EventEmitter();
  private _mouseDragSubscribe: Subscription;
  private _mouseDrag: Observable<any>;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {}

  @HostListener("mousedown", ["$event"])
  private onMouseDown(event) {
    this._mouseDown.next(event);
  }

  @HostListener("mousemove", ["$event"])
  private onMouseMove(event) {
    this._mouseMove.next(event);
  }

  @HostListener("mouseup", ["$event"])
  private onMouseUp(event) {
    this._mouseup.next(event);
  }

  @HostListener("mouseout", ["$event"])
  private onMouseOut(event) {
    this._mouseOut.next(event);
  }

  ngOnInit() {
    if (this.dragElement) {
      this.setupEventSubscriber();
      this._mouseDragSubscribe = this._mouseDrag.subscribe(position => {
        // console.log(position);
        this.updateElementPosition(position);
      });
    }
  }

  ngAfterViewInit() {
    if (this.dragElement) {
      this.setupData();
      this.setDragIcon();
    }
  }

  ngOnDestroy() {
    if (this._mouseDragSubscribe) {
      this._mouseDragSubscribe.unsubscribe();
    }
  }

  private setupData() {
    if (this.dragAxis === "y") {
      this._dragPointerType = "n-resize";
    } else if (this.dragAxis === "x") {
      this._dragPointerType = "e-resize";
    } else if (this.dragAxis === "xy") {
      this._dragPointerType = "move";
    } else {
      this._dragPointerType = null;
    }
  }

  private setupEventSubscriber() {
    this._mouseDrag = this._mouseDown.pipe(
      map((event: any) => {
        event.preventDefault();
        this._initialPosition = {
          left: this._elementRef.nativeElement.style.left,
          top: this._elementRef.nativeElement.style.top
        };
        return {
          left:
            event["clientX"] -
            this._elementRef.nativeElement.getBoundingClientRect().left,
          top:
            event["clientY"] -
            this._elementRef.nativeElement.getBoundingClientRect().top
        };
      }),
      flatMap(offset => {
        return this._mouseMove.pipe(
          map((event: Event) => {
            return {
              left: event["clientX"] - offset.left,
              top: event["clientY"] - offset.top
            };
          }),
          takeUntil(this._mouseup),
          takeUntil(this._mouseOut)
        );
      })
    );
  }

  private setDragIcon(): void {
    if (this.dragIcon) {
      const div = document.createElement("div");
      div.style.textAlign = "center";
      div.style.fontSize = " 1.5em";
      div.style.padding = "0.2em 0";
      div.style.color = "#1565c0";
      div.className = "drag-icon-wrapper";
      div.innerHTML = this.dragIconInnerText;
      this._renderer.appendChild(this._elementRef.nativeElement, div);
    }
    if (this._dragPointerType) {
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        "cursor",
        this._dragPointerType
      );
    }
    if (this.dragElementClass) {
      this._renderer.addClass(
        this._elementRef.nativeElement,
        this.dragElementClass
      );
    }
  }

  private updateElementPosition(position: { left; top }): void {
    if (!this._dragPointerType) {
      return;
    }
    if (this.dragAxis === "x") {
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        "left",
        position.left + "px"
      );
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        "top",
        this._initialPosition.top + "px"
      );
    } else if (this.dragAxis === "y") {
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        "left",
        this._initialPosition.left + "px"
      );
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        "top",
        position.top + "px"
      );
    } else if (this.dragAxis === "xy") {
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        "top",
        position.top + "px"
      );
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        "left",
        position.left + "px"
      );
    }
  }
}
