Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = msg.Result();
        can.page.Select(can, output, "svg", function(svg) {svg.innerHTML = "",
            can.svg = svg, can.list = can.core.List(msg.data, function(value, index) {
                can.node = can.onaction.insert({}, can, can.node, parseInt(value))
            })
            can.onaction.draw({}, can)
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: ["恢复", "广度优先", "深度优先", "前序", "中序", "后序", "查找树", "平衡树", "红黑树"],
    insert: function(event, can, node, data, check) {
        if (!node) {
             node = {data: data}
        } else if (data > node.data) {
            node.right = can.onaction.insert(event, can, node.right, data, check);
        } else {
            node.left = can.onaction.insert(event, can, node.left, data, check);
        }
        return check && check(node, data) || node
    },
    height: function(event, can, node) {if (!node) {return 0}
        var left = node.left? can.onaction.height(event, can, node.left): 0
        var right = node.right? can.onaction.height(event, can, node.right): 0
        return (left > right? left: right) + 1
    },
    width: function(event, can, node) {if (!node) {return 0}
        return can.onaction.width(event, can, node.left)+1+can.onaction.width(event, can, node.right)
    },
    show: function(event, can, node, x, y, size) {
        var view = can.onaction.push(event, can, {cx: x, cy: y, r: 20}, "circle", can.svg)
        var text = can.onaction.push(event, can, {x: x, y: y}, "text", can.svg)
        text.innerHTML = node.data

        if (node.left) {
            var x2 = x - can.onaction.width(event, can, node.left.right) * size - size
            var y2 = y + size
            can.onaction.show(event, can, node.left, x2, y2, size)
            can.onaction.push(event, can, {x1: x-13, y1: y+13, x2: x2+13, y2: y2-13}, "line", can.svg)
        }
        if (node.right) {
            var x2 = x + can.onaction.width(event, can, node.right.left) * size + size
            var y2 = y + size
            can.onaction.show(event, can, node.right, x2, y2, size)
            can.onaction.push(event, can, {x1: x+13, y1: y+13, x2: x2-13, y2: y2-13}, "line", can.svg)
        }
        return node.view = view
    },

    draw: function(event, can, node, x, y, size) {
        can.svg.innerHTML = ""
        var size = 40;
        var height = can.onaction.height({}, can, can.node)*size+size
        var width = can.onaction.width({}, can, can.node)*size+size
        can.svg.setAttribute("width", width)
        can.svg.setAttribute("height", height)
        can.onaction.show({}, can, can.node, can.onaction.width({}, can, can.node.left)*size+size, size, size)
    },
    "恢复": function(event, can) {
        var list = []
        var data = [can.node]
        for (var i = 0; i < data.length; i++) {
            list.push(data[i])
            data[i].left && data.push(data[i].left)
            data[i].right && data.push(data[i].right)
        }
        can.core.Next(list, function(item, cb) {
            item.view.Value("fill", "purple")
            can.Timer(10, cb)
        }, function() {
        })
        return list
    },
    "广度优先": function(event, can) {
        var list = []
        var data = [can.node]
        for (var i = 0; i < data.length; i++) {
            list.push(data[i])
            data[i].left && data.push(data[i].left)
            data[i].right && data.push(data[i].right)
        }
        can.core.Next(list, function(item, cb) {
            item.view.Value("fill", "green")
            can.Timer(100, cb)
        }, function() {
        })
        return list
    },
    "深度优先": function(event, can) {
        var list = []

        function next(node) {
            list.push(node)
            node.left && next(node.left)
            node.right && next(node.right)
        }
        next(can.node)

        can.core.Next(list, function(item, cb) {
            item.view.Value("fill", "green")
            can.Timer(100, cb)
        }, function() {
        })
        return list
    },
    "前序": function(event, can) {
        var list = []

        function next(node) {
            list.push(node)
            node.left && next(node.left)
            node.right && next(node.right)
        }
        next(can.node)

        can.core.Next(list, function(item, cb) {
            item.view.Value("fill", "green")
            can.Timer(100, cb)
        }, function() {
        })
        return list
    },
    "中序": function(event, can) {
        var list = []

        function next(node) {
            node.left && next(node.left)
            list.push(node)
            node.right && next(node.right)
        }
        next(can.node)

        can.core.Next(list, function(item, cb) {
            item.view.Value("fill", "green")
            can.Timer(100, cb)
        }, function() {
        })
        return list
    },
    "后序": function(event, can) {
        var list = []

        function next(node) {
            node.left && next(node.left)
            node.right && next(node.right)
            list.push(node)
        }
        next(can.node)

        can.core.Next(list, function(item, cb) {
            item.view.Value("fill", "green")
            can.Timer(100, cb)
        }, function() {
        })
        return list
    },

    "查找树": function(event, can) {
        can.page.Select(can, can.target, "svg", function(svg) {svg.innerHTML = "",
            delete(can.node), can.svg = svg, can.list = can.core.Next(can.msg.data, function(value, cb) {
                can.node = can.onaction.insert({}, can, can.node, parseInt(value))
                can.onaction.draw({}, can)
                can.Timer(200, cb)
            })
        })
    },
    "平衡树": function(event, can) {
        function check(node, value) {
            var left = can.onaction.height(event, can, node.left)
            var right = can.onaction.height(event, can, node.right)

            if (left - right > 1) {
                var temp = node.left;
                if (value < node.data) { // LL
                    node.left = temp.right;
                    temp.right = node;
                    node = temp;
                } else { // LR
                    node.left = temp.right.right;
                    temp.right.right = node.left;

                    node = temp.right;
                    temp.right = node.left;
                    node.left = temp;
                }
            } else if (left - right < -1) {
                var temp = node.right;
                if (value > node.data) { // RR
                    node.right = temp.left;
                    temp.left = node;
                    node = temp;

                } else { // RL
                    node.right = temp.left.left;
                    temp.left.left = node.right;

                    node = temp.left
                    temp.left = node.right
                    node.right = temp;
                }
            }
            return node
        }

        can.page.Select(can, can.target, "svg", function(svg) {svg.innerHTML = "",
            delete(can.node), can.svg = svg, can.list = can.core.Next(can.msg.data, function(value, cb) {
                can.node = can.onaction.insert({}, can, can.node, parseInt(value), check)
                can.onaction.draw({}, can)
                can.Timer(200, cb)
            })
        })
    },

    init: function(event, can, msg, cmd, item) {
        item.ondblclick = item.oncontextmenu = function(event) {can.user.carte(event, shy("", can.ondetail, can.ondetail.list, function(event, key, meta) {var cb = meta[key];
            typeof cb == "function" && cb(event, can, msg, cmd, key, key, item);
        }), can), event.stopPropagation(), event.preventDefault()}
        item.onclick = function() {
        }
        item.Value = function(key, value) {return value && item.setAttribute(key, value), item.getAttribute(key||"class")||item[key]&&item[key].baseVal&&item[key].baseVal.value||item[key]&&item[key].baseVal||""}
        item.Val = function(key, value) {return parseInt(item.Value(key, value))}
        return item;
    },
    push: function(event, can, msg, cmd, target) {
        var rect = document.createElementNS("http://www.w3.org/2000/svg", cmd);
        target.appendChild(can.onaction.init(event, can, msg, cmd, rect));
        can.core.Item(msg, function(key, value) {rect.Value(key, value)});
        return rect;
    },
})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})



