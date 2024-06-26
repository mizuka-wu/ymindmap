import { VIEW_KEY, NodeView } from '@ymindmap/view'
import { topic, mindmap } from './schema'
import { LayoutController } from './layout'
import type { IExtensionConfig } from '@ymindmap/core'

type IOptions = NonNullable<unknown>
type IStorage = {
    nodeLayoutControllerMap: WeakMap<NodeView, LayoutController>
}

export const MindmapExtension: IExtensionConfig<IOptions, IStorage> = {
    addNodes() {
        return {
            topic,
            mindmap
        }
    },

    addStorage() {
        return {
            yoga: null,
            nodeLayoutControllerMap: new WeakMap()
        }
    },

    async onCreate(board) {

        // 目前mindmap必须在第一层可以直接靠getObjects获取，之后可能会改成迭代遍历
        const mindmapViews: NodeView[] = board.canvas
            .getObjects('mindmap')
            .map(item => Reflect.get(item, VIEW_KEY))
            .filter(item => !!item);
        mindmapViews.forEach(mindmap => {
            this.storage.nodeLayoutControllerMap.set(mindmap, new LayoutController({
                mindmap,
                board,
                margin: {
                    height: 20,
                    width: 20,
                    childWidth: 20,
                    childHeight: 20
                }
            }))
        })
    }
}

export default MindmapExtension;