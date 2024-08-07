/**
 * 创建一个topic节点
 * 目前视图和数据的绑定在这里，如果变得复杂，之后需要额外移动到单独的类下
 * @todo 支持latex https://jsfiddle.net/3aHQc/39/
 */

import {
    Box,
    Text,
    defineKey,
    PropertyEvent
} from 'leafer-ui';
import { Node, NodeToCanvasContext, Theme, TopicStyle } from '@ymindmap/model';
// import { HTMLText } from '@leafer-in/html'

import type { ITopicNodeAttrs } from './attr';
import type { YXmlEvent } from 'yjs';

function getTopicTheme(node: Node<ITopicNodeAttrs>, theme: Theme): TopicStyle {
    let topicTheme = theme.childTopic;
    if (node.depth === 0) {
        topicTheme = theme.centerTopic;
    }
    if (node.depth === 1) {
        topicTheme = theme.subTopic
    }
    return topicTheme;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createTopic(node: Node<ITopicNodeAttrs>, context: NodeToCanvasContext) {
    const topicStyle = Object.assign(
        {},
        getTopicTheme(node, context.theme),
        node.attributes,
    );

    const padding: [number, number, number, number] = Array.isArray(topicStyle.padding)
        ? topicStyle.padding
        : new Array(4).fill(topicStyle.padding || 0) as [number, number, number, number];

    const topic = new Box({
        fill: topicStyle.backgroundColor,
        className: 'topic',
        fontSize: topicStyle.fontSize || 14,
        cornerRadius: topicStyle.borderRadius,
        draggable: true,
        id: node.attributes?.id,
        editable: true,
        cursor: 'pointer',
        children: [
        ]
    })

    const title = new Text({
        className: 'topic-title',
        tag: 'Text',
        padding,
        editable: false,
        // tag: 'title',
        text: node.attributes?.title || '请输入内容',
        fill: topicStyle.color,
    })

    topic.add(title);
    // 内容更新同步
    title.on(PropertyEvent.CHANGE, (e: PropertyEvent) => {
        if (e.attrName === 'text') node.setAttribute('title', e.newValue);
    })

    node.state.observe((e: any) => {
        (e as YXmlEvent).attributesChanged.forEach(key => {
            if (key === 'title') {
                title.setAttr('text', node.attributes.title || '');
            }
        })
    })

    // const title = new HTMLText({
    //     className: 'topic-title',
    //     padding,
    //     editable: false,
    //     // tag: 'title',
    //     text: node.attributes?.title || '请输入内容',
    //     fill: topicStyle.color,
    // })

    // 设置无法缩放等功能
    defineKey(topic, 'editConfig', {
        get() {
            return {
                moveable: true,
                resizeable: false,
                rotateable: false,
                skewable: false
            }
        }
    })

    return topic;
}