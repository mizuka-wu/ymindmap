/**
 * 生成domElement
 */
import type { LeaferCanvas } from 'leafer-ui'

export const CANVAS_CONTAINER_MAP = new Map<LeaferCanvas, HTMLDivElement>();

export function getElement(canvas: LeaferCanvas): HTMLDivElement {
    // 自动生成绑定的dom元素
    if (canvas.view.parentElement) return canvas.view.parentElement as HTMLDivElement;

    const container = document.createElement('div');
    CANVAS_CONTAINER_MAP.set(canvas, container);

    container.appendChild(canvas.view);
    return container;
}

export function destroy(canvas: LeaferCanvas) {
    if (canvas.view.parentElement) {
        canvas.view.parentElement.parentElement?.removeChild(canvas.view.parentElement);
        CANVAS_CONTAINER_MAP.delete(canvas);
        canvas.destroy();
    }
}