import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgIf } from '@angular/common';
import {
  CdkDragPlaceholder,
  CdkDragStart,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-draggable-element',
  standalone: true,
  imports: [
    CdkDrag,
    NgIf,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    DraggableElementComponent,
  ],
  templateUrl: './draggable-element.component.html',
  styleUrl: './draggable-element.component.scss',
})
export class DraggableElementComponent implements OnInit, OnChanges {
  @Input() numberIndex: any;
  @Input() schedule: any;
  @Output() dataEvent = new EventEmitter<string>();
  index = 0;

  start: any;
  end: any;
  height: any;
  startTime: any;
  @ViewChild('resizeBox') resizeBox: ElementRef | undefined;
  @ViewChild('elementToManipulate', { static: true })
  elementToManipulate: ElementRef | undefined;

  @ViewChild('dragHandleBottom', { static: true }) dragHandleBottom:
    | ElementRef
    | undefined;
  @ViewChild(CdkDrag) draggableElement: CdkDrag | any;

  ngOnInit() {
    // Access the nativeElement property to get access to the DOM element
    const element = this.elementToManipulate?.nativeElement;
    const dragHandleBottom = this.dragHandleBottom?.nativeElement;

    // Manipulate the element's style
    element.style.backgroundColor = 'red';

    let startTime = parseInt(this.schedule.startTime.split(':')[0], 10);

    let endTime = parseInt(this.schedule.endTime.split(':')[0], 10);

    element.style.transform = `translateY(${startTime * 60}px)`;
    element.style.height = `${(endTime - startTime) * 60}px`;
    dragHandleBottom.style.top = `${(endTime - startTime) * 60}px`;
  }
  ngOnChanges(changes: SimpleChanges): void {}
  get resizeBoxElement(): HTMLElement {
    return this.resizeBox?.nativeElement;
  }

  get dragHandleBottomElement(): HTMLElement {
    return this.dragHandleBottom?.nativeElement;
  }

  sendDataToParent() {
    const element =
      this.elementToManipulate?.nativeElement.getBoundingClientRect().height;
    const data: any = {
      startTime: parseInt(this.startTime),
      endTime: parseInt(element / 60 + this.startTime),
      numberIndex: this.numberIndex,
    };
    this.dataEvent.emit(data);
  }

  dragMove(dragHandle: HTMLElement) {
    this.resize(dragHandle, this.resizeBoxElement);
  }

  resize(dragHandle: HTMLElement, target: HTMLElement) {
    const dragRect = dragHandle.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const height = dragRect.top - targetRect.top + dragRect.height;
    target.style.height = Math.floor(height / 15) * 15 + 'px';

    if (target.style.height) {
      this.startTime = parseInt(this.schedule.startTime.split(':')[0], 10);
      this.sendDataToParent();
    }
  }

  dragEnded(event: CdkDragStart | any) {
    this.startTime = event.event.pageY / 60;
    if (this.startTime) {
      this.sendDataToParent();
    }
  }

  dragStarted(event: CdkDragStart | any) {
    this.start = event.source.element.nativeElement.getBoundingClientRect();
  }

  computeDragRenderPos(pos: { y: number }) {
    const delta = pos.y - this?.start.y;
    return { y: this.start.y + Math.floor(delta / 15) * 15, x: this.start.x };
  }
}
