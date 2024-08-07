import type { NodeType } from '@ymindmap/model';
import type { Board } from '../board';
import type {
    Command,
    RawCommands
} from '../command/type.d'

export interface IExtensionConfig<IOptions = any, IStorage = any> {
    // 注册命令
    addCommands?: (this: Extension<IOptions, IStorage>, extension: Extension<IOptions, IStorage>) => RawCommands

    addNodes?: (this: Board) => Record<string, NodeType>

    addOptions?: (this: Extension<IOptions, IStorage>) => IOptions

    addStorage?: (this: Extension<IOptions, IStorage>) => IStorage

    addKeymap?: (this: Extension<IOptions, IStorage>) => Record<string, Command>

    onBeforeCreate?: (this: Extension<IOptions, IStorage>, board: Board) => void;

    onCreate?: (this: Extension<IOptions, IStorage>, board: Board) => void;

    onDestroy?: (this: Extension<IOptions, IStorage>, board: Board) => void;

    onUpdate?: (this: Extension<IOptions, IStorage>, board: Board) => void;
}

export type IExtensionOptions = IExtensionConfig & {
    name: string,
    board: Board
}

export class Extension<IOptions = Record<string, any>, IStorage = Record<string, any>> {
    name: string
    board: Board
    options: IOptions = {} as any
    storage: IStorage = {} as any

    constructor(options: IExtensionOptions, boardOptions: Record<string, any>) {
        this.board = options.board
        this.name = options.name
        this.options = Reflect.get((boardOptions.options || {}), options.name)
        if (options.addOptions) {
            this.options = {
                ...options.addOptions.call(this),
                ...this.options
            }
        }

        // 创建storage
        if (options.addStorage) this.storage = options.addStorage.call(this) as any;

        // 绑定命令
        if (options.addCommands && this.board.commandManager) this.board.commandManager.registerCommands(options.addCommands.call(this, this))

        // 绑定快捷键
        if (options.addKeymap) Object.assign(this.board.keymapBinding, options.addKeymap.call(this));
    }

    static create(options: IExtensionOptions, boardOptions: Record<string, any>) {
        return new Extension(options, boardOptions);
    }
}

export class ExtensionManager {
    board: Board;
    _extension: Extension[] = [];

    // 缓存的callback列表
    onUpdateCallbackList: ({
        name: string,
        callback: (this: Extension, board: Board) => void
    })[] = []

    onCreateCallbackList: ({
        name: string,
        callback: (this: Extension, board: Board) => void
    })[] = []

    onDestroyCallbackList: ({
        name: string,
        callback: (this: Extension, board: Board) => void
    })[] = []

    constructor(board: Board) {
        this.board = board;
    }

    invokeUpdate() {
        const { extensions } = this;
        this.onUpdateCallbackList.forEach(({
            name,
            callback
        }) => {
            const extensionInstance = extensions[name];
            if (extensionInstance) callback.call(extensionInstance, this.board)
        });
    }

    invokeCreate() {
        const { extensions } = this;
        this.onCreateCallbackList.forEach(({
            name,
            callback
        }) => {
            const extensionInstance = extensions[name];
            if (extensionInstance) callback.call(extensionInstance, this.board)
        });
    }

    invokeDestroy() {
        const { extensions } = this;
        this.onDestroyCallbackList.forEach(({
            name,
            callback
        }) => {
            const extensionInstance = extensions[name];
            if (extensionInstance) callback.call(extensionInstance, this.board)
        });
    }

    get extensions() {
        return Object.fromEntries(this._extension.map((extension) => [extension.name, extension]))
    }

    registerExtension(extensions: Record<string, IExtensionConfig>, defaultOptions: Record<string, any>) {
        Object.entries(extensions).forEach(([name, extensionConfig]) => {
            const extensionInstance = Extension.create({ ...extensionConfig, name, board: this.board }, defaultOptions);
            this._extension.push(extensionInstance)
            if (extensionConfig.onUpdate) {
                this.onUpdateCallbackList.push({
                    name,
                    callback: extensionConfig.onUpdate
                });
            }

            if (extensionConfig.onCreate) {
                this.onCreateCallbackList.push({
                    name,
                    callback: extensionConfig.onCreate
                });
            }

            if (extensionConfig.onDestroy) {
                this.onDestroyCallbackList.push({
                    name,
                    callback: extensionConfig.onDestroy
                });
            }

            if (extensionConfig.onBeforeCreate) extensionConfig.onBeforeCreate.call(extensionInstance, this.board);
        })
    }
}