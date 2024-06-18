import { XmlElement } from 'yjs'
import { fabric } from 'fabric'
import { Yoga, loadYoga } from 'yoga-layout/load';
import { NodeView } from './view/nodeView'
import { VIEW_KEY } from './view/baseView'
import type { Theme } from '@ymindmap/model'
import type { State } from '@ymindmap/state'

export type ViewOptions = {
    width?: number,
    height?: number
}

export class View extends NodeView {
    state: State
    private yoga: Yoga | null = null;
    constructor(state: State, theme: Theme, options: ViewOptions = {}) {
        let rootState = state.doc.getXmlFragment('default').firstChild;
        if (!rootState) {
            rootState = new XmlElement(state.schema.topNodeType.name);
            state.doc.getXmlFragment('default').insert(0, [rootState]);
        }
        const node = state.schema.parseNode(rootState);
        if (!node || node.type !== state.schema.topNodeType) throw new Error('Can not init view with error topNodeType')
        const canvas = new fabric.Canvas(null, {
            backgroundColor: theme.background,
            ...options
        });
        const viewContext = { canvas, theme };

        super(
            viewContext,
            node,
            node?.type.spec.toFabric && node.type.spec.toFabric(node, viewContext),
        );

        // 订阅state变化
        this.state = state;

        // 禁止group的时候拥有control
        fabric.Group.prototype.hasControls = false;

        this.bindAwareness();
        // 加载yoga进行排版
        loadYoga()
            .then((yoga) => {
                this.yoga = yoga;
                // 开始排版
            })
            .catch((e) => {
                throw e;
            })
    }

    get schema() {
        return this.state.schema;
    }

    get theme() {
        return this.context.theme
    }

    get canvas() {
        return this.context.canvas
    }

    bindAwareness() {
        /**
         * 订阅当前选中节点
         */
        const onCanvasSelectionChange = () => {
            const selectedObjects = this.canvas.getActiveObjects()
                .map(item => {
                    const view: NodeView | undefined = Reflect.get(item, VIEW_KEY);
                    return view?.node?.state;
                }).filter((item) => item)
            this.state.updateAwareness('selectedObjects', selectedObjects);
        }
        this.canvas.on('selection:cleared', onCanvasSelectionChange);
        this.canvas.on('selection:created', onCanvasSelectionChange);
        this.canvas.on('selection:updated', onCanvasSelectionChange);
    }

    renderAll() {
        this.canvas.requestRenderAll();
    }

    setTheme(theme: Theme) {
        if (theme !== this.theme) {
            this.context.theme = theme;
            // 重新绘制 需要所有节点重新绘制
            this.canvas.renderAll();
        }
    }

    toDataUrl(options: fabric.IDataURLOptions) {
        return this.canvas.toDataURL(options)
    }

    /**
     * 转为svg的方法
     * @todo 现在是
     * @param options 
     * @returns 
     */
    toSvg(options: fabric.IToSVGOptions) {
        return this.canvas.toSVG(options)
    }

    destroy() {
        super.destroy();
        this.canvas.dispose();
    }

    static create(state: State, theme: Theme, options?: ViewOptions) {
        return new View(state, theme, options);
    }
}

export * from './schema'
export * from './theme'
export * from './view'
