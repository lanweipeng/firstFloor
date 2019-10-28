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
    textUpdater(node, value) {
        node.textContent = value
    }
    isElement(node) {
        return node.nodeType == 1;
    }
    isInterpolation(node) {

        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
}