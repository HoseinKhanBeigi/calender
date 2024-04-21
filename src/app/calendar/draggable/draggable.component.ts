import {
  CdkDrag,
  CdkDragDrop,
  CdkDragStart,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
  selector: 'app-draggable',
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  templateUrl: './draggable.component.html',
  styleUrl: './draggable.component.scss',
})
export class DraggableComponent {
  movies = ['Episode I - The Phantom Menace'];
  start: any;
  drop(event: CdkDragDrop<string[]>) {
    console.log('drag');
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  dragEnded($event: any) {}

  dragStarted(event: CdkDragStart | any) {
    this.start = event.source.element.nativeElement.getBoundingClientRect();
  }

  computeDragRenderPos(pos: { y: number }) {
    const delta = pos.y - this?.start.y;

    return { y: this.start.y + Math.floor(delta / 15) * 15, x: this.start.x };
  }
}
