import OpenSeadragon from "openseadragon";

export class RectangleAnnotation {
  private annotations: Array<{ x: number; y: number; width: number; height: number }> = [];
  private startPoint: { x: number; y: number } | null = null;
  private currentRect: { x: number; y: number; width: number; height: number } | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private osdViewer: OpenSeadragon.Viewer // Add OpenSeadragon viewer here
  ) {}

  handleMouseDown(event: MouseEvent): void {
    this.startPoint = { x: event.offsetX, y: event.offsetY };
  }

  handleMouseMove(event: MouseEvent): void {
    if (!this.startPoint) return;

    this.currentRect = {
      x: Math.min(this.startPoint.x, event.offsetX),
      y: Math.min(this.startPoint.y, event.offsetY),
      width: Math.abs(event.offsetX - this.startPoint.x),
      height: Math.abs(event.offsetY - this.startPoint.y),
    };

    this.redrawCanvas();
  }

  handleMouseUp(): void {
    if (this.currentRect) {
      this.annotations.push(this.currentRect); // Save annotation in canvas coordinates
      this.currentRect = null;
    }
    this.startPoint = null;
    this.redrawCanvas();
  }

  redrawCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw saved annotations
    this.annotations.forEach(({ x, y, width, height }) => {
      if (this.osdViewer) {
        const viewport = this.osdViewer.viewport;

        // Convert image coordinates to viewport coordinates
        const topLeft = viewport.imageToWindowCoordinates(new OpenSeadragon.Point(x, y));
        const bottomRight = viewport.imageToWindowCoordinates(new OpenSeadragon.Point(x + width, y + height));

        const rect = {
          x: topLeft.x,
          y: topLeft.y,
          width: bottomRight.x - topLeft.x,
          height: bottomRight.y - topLeft.y,
        };

        this.context.strokeStyle = "red";
        this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      }
    });

    // Draw the current rectangle (while dragging)
    if (this.currentRect) {
      this.context.strokeStyle = "blue";
      this.context.strokeRect(
        this.currentRect.x,
        this.currentRect.y,
        this.currentRect.width,
        this.currentRect.height
      );
    }
  }

  // Convert a canvas annotation to image coordinates
  convertToImageCoordinates(annotation: { x: number; y: number; width: number; height: number }) {
    if (this.osdViewer) {
      const viewport = this.osdViewer.viewport;

      const topLeft = viewport.windowToImageCoordinates(new OpenSeadragon.Point(annotation.x, annotation.y));
      const bottomRight = viewport.windowToImageCoordinates(
        new OpenSeadragon.Point(annotation.x + annotation.width, annotation.y + annotation.height)
      );

      return {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
      };
    }
    return null;
  }

  getAnnotationsInImageCoordinates() {
    return this.annotations.map((annotation) => this.convertToImageCoordinates(annotation));
  }
}
