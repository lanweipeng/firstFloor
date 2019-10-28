class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);

            this.compile(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }
    node2Fragment(el) {
        const frag = document.createDocumentFragment();
        let child;
        while (child = el.firstChild) {
            frag.appendChild(child)
        }
        return frag
    }
    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                //element
                // console.log('编译元素' + node.nodeName)
                const nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr => {
                    const attrName = attr.name;
                    const exp = attr.value;
                    if (this.isDirective(attrName)) {
                        const dir = attrName.substring(2);
                        this[dir] && this[dir](node, this.$vm, exp)
                    }
                    if (this.isEvent(attrName)) {

                    }
                })
            } else if (this.isInterpolation(node)) {
                //{{}}
                // console.log('编译文本', node.textContent)
                this.compileText(node)

            }
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })


    }
    compileText(node) {
        this.update(node, this.$vm, RegExp.$1, 'text')
            // node.textContent = this.$vm.$data[RegExp.$1]
    }
    update(node, vm, exp, dir) {
        const updaterFn = this[dir + 'Updater'];
        // init
        updaterFn && updaterFn(node, vm[exp])
            //依赖收集
        new Watcher(vm, exp, function(value) {
            updaterFn && updaterFn(node, value);
        })
    }
    text(node, vm, exp) {
        this.update(node, vm, exp, 'text')
    }
    textUpdater(node, value) {
        node.textContent = value
    }
    isDirective(attr) {
        return attr.indexOf('v-') == 0;
    }
    isEvent(attr) {
        return
    }
    isElement(node) {
        return node.nodeType == 1;
    }
    isInterpolation(node) {

        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
}