import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas-drag-drop',
  standalone: true,
  imports: [],
  templateUrl: './canvas-drag-drop.component.html',
  styleUrl: './canvas-drag-drop.component.scss',
})
export class CanvasDragDropComponent implements AfterViewInit {
  @ViewChild('myCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement> | undefined;

  private ctx: CanvasRenderingContext2D | any;
  private rect = { x: 50, y: 50, width: 100, height: 50 };
  private drag = false;
  private startY: number | any;
  private offsetY: number = 0;

  ngAfterViewInit(): void {
    this.ctx = this.canvas?.nativeElement.getContext('2d');
    this.draw();

    this.canvas?.nativeElement.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this)
    );
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas?.nativeElement.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this)
    );
  }

  private draw() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas?.nativeElement.width,
      this.canvas?.nativeElement.height
    );
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      this.rect.x,
      this.rect.y + this.offsetY,
      this.rect.width,
      this.rect.height
    );
  }

  private onMouseDown(event: MouseEvent) {
    const rect: any = this.canvas?.nativeElement.getBoundingClientRect();
    const y = event.clientY - rect.top;
    if (y > this.rect.y && y < this.rect.y + this.rect.height) {
      this.drag = true;
      this.startY = y - this.rect.y;
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (this.drag) {
      const rect: any = this.canvas?.nativeElement.getBoundingClientRect();
      let y = event.clientY - rect.top;
      let deltaY = y - this.startY - this.rect.y;
      this.offsetY = Math.round(deltaY / 15) * 15; // Snap to 15px increments
      console.log(this.rect.y);
      this.draw();
    }
  }

  private onMouseUp(event: MouseEvent) {
    this.drag = false;
  }
}
