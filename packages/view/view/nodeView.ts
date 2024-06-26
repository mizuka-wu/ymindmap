import { XmlElement, XmlText } from 'yjs'
import { fabric } from 'fabric'
import { View, } from './view'
import { TextView } from './textView'
import type { Node, NodeToFabricContext } from '@ymindmap/model'

export class NodeView extends View<fabric.Object> {
    constructor(
        context: NodeToFabricContext,
        node: Node,
        fabricObject?: fabric.Object | null,
        parent?: View | null
    ) {
        super(context, node, fabricObject, parent);

        // 填充子节点
        if (this.node.state instanceof XmlElement) {
            this.node.state.forEach((childFragment) => this.createChildView(childFragment));
        }
    }

    update() {
        if (this.fabricObject && this.node.state instanceof XmlElement) {
            // 更新fabric对象
            this.fabricObject.set(this.node.attributes);
            return true;
        }
        return false;
    }

    createChildView(yFragment: XmlElement | XmlText) {
        const node = this.node.type.schema?.parseNode(yFragment);
        if (!node) return;

        const fabricObject = node.type.spec.toFabric && node.type.spec.toFabric(
            node,
            this.context
        );
        if (fabricObject) {
            fabricObject.set('borderScaleFactor', 4);
            fabricObject.set('padding', 2);
            fabricObject.set('hasControls', false);
        }

        const ChildViewConstructor = yFragment instanceof XmlText ? TextView : NodeView;

        this.children.push(new ChildViewConstructor(
            this.context,
            node,
            fabricObject as any, // TextView 是 fabric.Text 所以先改为any
            this
        ))
    }

    getMatrix(view: NodeView = this) {
        // 获取位置
        const { fabricObject } = view;
        if (fabricObject) {
            const transformMatrix = fabricObject.calcTransformMatrix();
            return fabric.util.qrDecompose(transformMatrix);
        }

        return null
    }
}