/*
# TranSerPlugin for obsidian
This plugin is used to generate a serial of Sentenses for writting.
First , You need to build your API service for generating Sentenses.
I build the API service with GPT2. You can also use GPT2 to generate Sentenses directly , or Another one.

Author：https://github.com/zazaji
Thanks: https://github.com/tth05/obsidian-completr
*/
var __apiUrl;
var __appid;
var __appkey;
var __activeView;
var __remoteUrl;
var newView;
const TRANS_VIEW_TYPE = "Transboard";
var BARCONTAINER;
var statusBarItem;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
            if (__propIsEnum.call(b, prop))
                __defNormalProp(a, prop, b[prop]);
        }
    return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
    for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
        var fulfilled = (value) => {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        };
        var rejected = (value) => {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        };
        var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        step((generator = generator.apply(__this, __arguments)).next());
    });
};

// src/main.ts
var main_exports = {};
__export(main_exports, {
    default: () => TranSerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// src/snippet_manager.ts
var SnippetManager = class {
    constructor() {
        this.currentPlaceholderReferences = [];
    }
    onunload() {
        this.clearAllPlaceholders();
    }
    clearAllPlaceholders() {
        if (this.currentPlaceholderReferences.length === 0)
            return;
        const firstRef = this.currentPlaceholderReferences[0];
        const view = editorToCodeMirrorView(firstRef.editor);
        view.dispatch({
            effects: clearMarks.of(null)
        });
        this.currentPlaceholderReferences = [];
    }
};

// src/provider/provider.ts
function getTranslationDisplayName(translation, lowerCase = false) {
    const res = typeof translation === "string" ? translation : translation.displayName;
    return lowerCase ? res.toLowerCase() : res;
}

function content_text(input, output) {
    text = '#### ' + input + '\n' + '#### ' + output + ''
        // console.log(BARCONTAINER);
    BARCONTAINER.children[3].empty();
    BARCONTAINER.children[3].createDiv('ssmall markdown-preview-view', (el) => {
        obsidian.MarkdownRenderer.renderMarkdown(text, el, '', this);
    });
    bar_text("加载完成！🥦");
}


//状态栏信息提示
function bar_text(text) {
    statusBarItem.empty();
    statusBarItem.createEl("span", { text: text });
    setTimeout(() => { statusBarItem.empty(); }, 5000);
    return '';
}

// src/settings.ts
var DEFAULT_SETTINGS = {
    // apiUrl: "https://transformer.huggingface.co/autocomplete/",
    apiUrl: "https://fwzd.myfawu.com/trans",
    apiid: "20200125000377830",
    apikey: "Q9nZP8d3oDvjoFKVHhvL"
}
var obsidian = require('obsidian');
//    添加右侧栏


//全文检索函数 
function translate(query) {
    // query = BARCONTAINER.children[1].value;

    let idata = {
        "src": query,
        'appid': __appid,
        'appkey': __appkey,
    };
    bar_text("加载中...🍌");
    __async(this, null, function*() {
        let data = yield fetch(__apiUrl, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(idata)
        }).then((res) => res.json()).catch((err) => { return bar_text("加载失败！🍎"); });
        if (data != '') {
            content_text(query, data['dst']);
        }
    })
}




var import_obsidian3 = require("obsidian");
//    初始化右侧栏
class TRANSListView extends obsidian.ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;

        this.lastRerender = 0;
        this.groupedItems = [];
        this.itemsByFile = new Map();
        this.initialLoad = true;
        this.translate = "";
    }
    getViewType() {
        return TRANS_VIEW_TYPE;
    }
    getDisplayText() {
        return "Transboard List";
    }
    getIcon() {
        return "dice";
    }
    async onload() {
            // __apiUrl = "http://10.10.147.205:8080/trans"
            statusBarItem = this.plugin.addStatusBarItem();
            //等待1s
            setTimeout(() => {
                __apiUrl = this.plugin.settings.apiUrl;
                __remoteUrl = this.plugin.settings.remoteUrl;
                __appkey = this.plugin.settings.appkey;
                __appid = this.plugin.settings.appid;
                console.log(__apiUrl);
            }, 3000);
        }
        //    右侧栏
    async onOpen() {


        BARCONTAINER = this.containerEl.children[1];
        // BARCONTAINER = container;
        BARCONTAINER.empty();
        BARCONTAINER.createEl("h4", { text: "翻译助手", cls: 'col-10' });

        BARCONTAINER.createEl("input", { value: "", type: 'text', cls: 'col-10', placeholder: '请输入关键词' });
        BARCONTAINER.createEl("button", { text: "翻译", type: 'button', cls: 'col-1' }, (el) => {
            el.onClickEvent(() => {
                translate();
            })
        });

        BARCONTAINER.createDiv("content", (el) => {
            obsidian.MarkdownRenderer.renderMarkdown('', el, '', this);
        });
        BARCONTAINER.createDiv("news", (el) => {
            obsidian.MarkdownRenderer.renderMarkdown("<iframe src='https://i.tianqi.com/?c=code&id=34&bdc=%23&icon=4&site=14'></iframe>", el, '', this);
        });
        BARCONTAINER.createEl("js", (el) => {
            obsidian.createEl.div('<script>function show(url){$("#iframe").src=url;} </script>', el, '');
        });
    }

    async onClose() {
        // Nothing to clean up.
    }
}



//生成候选项
var SuggestionPopup = class extends import_obsidian3.EditorSuggest {
    constructor(app, settings, snippetManager) {
            var _a;
            super(app);

        }
};


// 设置内容，apiUrl：API服务地址
var import_obsidian4 = require("obsidian");
var TranSerSettingsTab = class extends import_obsidian4.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Settings for Translation Assistant." });

        containerEl.createDiv("content", (el) => {
            obsidian.MarkdownRenderer.renderMarkdown(this.plugin.settings.cn_note, el, '', this);
        });


        new import_obsidian4.Setting(containerEl).setName("Remote Markdown URL").setDesc("Remote Markdown URL")
            .addText((text) => text.setValue(this.plugin.settings.remoteUrl)
                .onChange(
                    (val) => __async(this, null, function*() {
                        try {
                            text.inputEl.removeClass("TranSer-settings-error");
                            this.plugin.settings.remoteUrl = val;
                            yield this.plugin.saveSettings();
                        } catch (e) {
                            text.inputEl.addClass("TranSer-settings-error");
                        }
                    })
                )
            );


            new import_obsidian4.Setting(containerEl).setName("API Address").setDesc("The service address ")
            .addText((text) => text.setValue(this.plugin.settings.apiUrl)
                .onChange(
                    (val) => __async(this, null, function*() {
                        try {
                            text.inputEl.removeClass("TranSer-settings-error");
                            this.plugin.settings.apiUrl = val;
                            yield this.plugin.saveSettings();
                        } catch (e) {
                            text.inputEl.addClass("TranSer-settings-error");
                        }
                    })
                )
            );

        new import_obsidian4.Setting(containerEl).setName("appid").setDesc("You can apply for baidu APP ID ")
            .addText((text) => text.setValue(this.plugin.settings.appid)
                .onChange(
                    (val) => __async(this, null, function*() {
                        try {
                            text.inputEl.removeClass("TranSer-settings-error");
                            this.plugin.settings.appid = val;
                            __appid = val;
                            yield this.plugin.saveSettings();
                        } catch (e) {
                            text.inputEl.addClass("TranSer-settings-error");
                        }
                    })
                )
            );


        new import_obsidian4.Setting(containerEl).setName("appkey").setDesc("You can apply for baidu APP KEY")
            .addText((text) => text.setValue(this.plugin.settings.appkey)
                .onChange(
                    (val) => __async(this, null, function*() {
                        try {
                            text.inputEl.removeClass("TranSer-settings-error");
                            this.plugin.settings.appkey = val;
                            __appkey = val;
                            yield this.plugin.saveSettings();
                        } catch (e) {
                            text.inputEl.addClass("TranSer-settings-error");
                        }
                    })
                )
            );
    }

    createEnabledSetting(propertyName, desc, container) {
        new import_obsidian4.Setting(container).setName("Enabled").setDesc(desc).addToggle((toggle) => toggle.setValue(this.plugin.settings[propertyName])
            .onChange((val) => __async(this, null, function*() {
                this.plugin.settings[propertyName] = val;
                yield this.plugin.saveSettings();
            })));
    }
};

// 设置操作快捷键
var TranSerPlugin = class extends import_obsidian5.Plugin {
    constructor() {
        super(...arguments);

    }

    async activateView() {
        if (this.app.workspace.getLeavesOfType(TRANS_VIEW_TYPE).length)
            return;
        this.app.workspace.getRightLeaf(false).setViewState({
            type: TRANS_VIEW_TYPE,
            active: true,
        });
    }
    onload() {
        this.registerView(TRANS_VIEW_TYPE, (leaf) => {
            newView = new TRANSListView(leaf, this);
            return newView;
        });

        setTimeout(() => { this.activateView(); }, 2000);
        return __async(this, null, function*() {

            var _a;
            yield this.loadSettings();
            this.snippetManager = new SnippetManager();

            this.addSettingTab(new TranSerSettingsTab(this.app, this));
            this.setupCommands();

        });
    }
    setupCommands() {
        const app = this.app;
        app.scope.keys = [];
        const isHotkeyMatch = (hotkey, context, id) => {
            const modifiers = hotkey.modifiers,
                key = hotkey.key;
            if (modifiers !== null && (id.contains("transer-bypass") ? !context.modifiers.contains(modifiers) : modifiers !== context.modifiers))
                return false;
            return !key || (key === context.vkey || !(!context.key || key.toLowerCase() !== context.key.toLowerCase()));
        };
        this.app.scope.register(null, null, (e, t) => {
            const hotkeyManager = app.hotkeyManager;
            hotkeyManager.bake();

            for (let bakedHotkeys = hotkeyManager.bakedHotkeys, bakedIds = hotkeyManager.bakedIds, r = 0; r < bakedHotkeys.length; r++) {
                const hotkey = bakedHotkeys[r];
                const id = bakedIds[r];
                if (isHotkeyMatch(hotkey, t, id)) {
                    const command = app.commands.findCommand(id);
                    if (!command || e.repeat && !command.repeatable) {
                        return false;
                    } else if (id.contains("transer-bypass")) {
                        const validMods = t.modifiers.replace(new RegExp(`${hotkey.modifiers},*`), "").split(",");
                        let event = new KeyboardEvent("keydown", {
                            key: hotkeyManager.defaultKeys[id][0].key,
                            ctrlKey: validMods.contains("Ctrl"),
                            shiftKey: validMods.contains("Shift"),
                            altKey: validMods.contains("Alt"),
                            metaKey: validMods.contains("Meta")
                        });
                        e.target.dispatchEvent(event);
                        console.log("Hotkey " + id + " entered")
                        return false;
                    }
                    if (app.commands.executeCommandById(id))
                        return false;
                } else {
                    this.justClosed = true;
                }
            }
        });
        //快捷键输出页面remoteUrl
        this.addCommand({
            id: "key-to-remoteUrl",
            name: "key-to-remoteUrl",
            hotkeys: [{
                key: ";",
                modifiers: ["Alt"]
            }],
            editorCallback: (editor) => {

                // 当前打开文件的文件路径
                // let vaultname=this.app.workspace.getActiveFile().vault.adapter.basePath.split('\\');
                content_text('当前文章的链接地址：',__remoteUrl+this.app.workspace.getActiveFile().name);
            },
        });
        //快捷键翻译
        this.addCommand({
            id: "key-to-translation",
            name: "key-to-translation",
            hotkeys: [{
                key: ";",
                modifiers: ["Ctrl"]
            }],
            editorCallback: (editor) => {

                // __activeView = this.app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
                // BARCONTAINER.children[1].value = editor.getSelection();
                // console.log(__apiUrl, BARCONTAINER.children[1].value);

                translate(editor.getSelection());
            },
        });
    }


    onunload() {
        return __async(this, null, function*() {
            this.snippetManager.onunload();
        });
    }
    loadSettings() {
            return __async(this, null, function*() {
                this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());

            });
        }
        // get SuggtestionPopup() {
        //     return this._TranslationPopup;
        // }
    saveSettings() {
        return __async(this, null, function*() {
            yield this.saveData(this.settings);
        });
    }
};
