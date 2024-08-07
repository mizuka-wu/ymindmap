import type { NodeView } from '@ymindmap/view'
import type { Board } from '@ymindmap/core'
export interface ILayoutController {
    board: Board
    mindmap: NodeView
    _structure: string
    _margin: IMargin
    _autoAlign: boolean

    // 布局算法
    structures: Record<string, any>

    // 临时缓存区域
    cacheStorage: Record<string, any>
}

export type IMargin = {
    height: number;
    width: number;
    childHeight: number;
    childWidth: number;
}

export interface ILayoutControllerOptions {
    board: Board
    structure?: string
    mindmap: NodeView
    structures?: Record<string, any>
    margin: IMargin
    autoAlign?: boolean
}