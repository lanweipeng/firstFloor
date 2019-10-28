class Vue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;
        this.observe(this.$data);
        new Watcher();
        this.$data.name;
        new Watcher();
        this.$data.foo.bar;

    }
    observe(value) {
        if (!value || typeof value !== 'object') {
            return;
        }
        Object.keys(value).forEach(key => {
            this.defineReactive(value, key, value[key])
        })
    }
    defineReactive(obj, key, val) {
        this.observe(val);
        const dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addDep(Dep.target)
                return val;
            },
            set(newVal) {
                if (newVal == val) {
                    return;
                } else {
                    val = newVal;
                    // console.log(`${key}change${val}`)
                    dep.notify();
                }
            }
        })
    }
}
class Dep {
    constructor() {
        this.deps = [];
    }
    addDep(dep) {
        this.deps.push(dep)
    }
    notify() {
        this.deps.forEach(dep => {
            dep.update();
        })
    }
}
class Watcher {
    constructor() {
        Dep.target = this;
    }
    update() {
        console.log('属性更新')
    }
}