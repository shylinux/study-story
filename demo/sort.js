Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = msg.Result();
        can.page.Select(can, output, "svg", function(svg) {svg.innerHTML = "",
            can.list = can.core.List(msg.data, function(value, index) {
                return can.onaction.push({}, can, {x: 20*index+10, y: 100-value, width: 10, height: value}, "rect", svg)
            })
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: ["恢复", "选择", "交换", "插入", "快速", "归并"],
    show: function(event, can, list) {
        can.core.Next(list, function(item, cb) {
            var a = can.list[item[0]], b = can.list[item[1]];
            can.list[item[1]] = a, can.list[item[0]] = b;

            if (a.Val("x") > a.Val("x")) {
                var c = a; a = b; b = c;
            }
            a.Val("y", a.Val("y") + 10)
            b.Val("y", b.Val("y") + 10)
            var step = (b.Val("x") - a.Val("x")) / 10
            can.Timer({value: parseInt(can.Option("speed"))||50, length: step}, function(value) {
                a.Val("x", a.Val("x")+10)
                b.Val("x", b.Val("x")-10)
            }, function() {
                a.Val("y", a.Val("y") - 10)
                b.Val("y", b.Val("y") - 10)
                typeof cb == "function" && cb()
            })
        }, function() {
        })
    },
    "恢复": function(event, can, msg, cmd, item) {
        can.page.Select(can, can.target, "svg", function(svg) {svg.innerHTML = "",
            can.list = can.core.List(msg.data, function(value, index) {
                return can.onaction.push({}, can, {x: 20*index+10, y: 100-value, width: 10, height: value}, "rect", svg)
            })
        })
    },
    "选择": function(event, can, msg, cmd, item) {
        var data = can.core.List(msg.data, function(item) {return parseInt(item)});
        var list = []
        for (var i = 0; i < data.length-1; i++) {
            var min = i;
            for (var j = i+1; j < data.length; j++) {
                if (data[j] < data[min]) {min = j}
            }
            if (min != i) {
                list.push([i, min]);
                var temp = data[i];
                data[i] = data[min];
                data[min] = temp;
            }
        }
        can.onaction.show(event, can, list)
    },
    "交换": function(event, can, msg, cmd, item) {
        var data = can.core.List(msg.data, function(item) {return parseInt(item)});
        var list = []
        for (var i = 1; i < data.length; i++) {
            for (var j = 0; j < data.length - i; j++) {
                if (data[j] > data[j+1]) {
                    list.push([j, j+1]);
                    var temp = data[j];
                    data[j] = data[j+1];
                    data[j+1] = temp;
                }
            }
        }
        can.onaction.show(event, can, list)
    },
    "插入": function(event, can, msg, cmd, item) {
        var data = can.core.List(msg.data, function(item) {return parseInt(item)});
        var list = []
        for (var i = 1; i < data.length; i++) {
            for (var j = i-1; j >= 0; j--) {
                if (data[j] > data[j+1]) {
                    list.push([j, j+1]);
                    var temp = data[j];
                    data[j] = data[j+1];
                    data[j+1] = temp;
                }
            }
        }
        can.onaction.show(event, can, list)
    },
    "快速": function(event, can, msg, cmd, item) {
        var data = can.core.List(msg.data, function(item) {return parseInt(item)});
        var list = []

        function qsort(left, right) {
            var l = left, m = left, r = right;
            while (l < r) {
                while (r > m && data[r] > data[m]) {r--}
                if (r == m) {break}

                list.push([m, r]);
                var temp = data[m];
                data[m] = data[r];
                data[r] = temp;
                m = r;

                while (l < m && data[l] <= data[m]) {l++}
                if (l == m) {break}

                list.push([l, m]);
                var temp = data[l];
                data[l] = data[m];
                data[m] = temp;
                m = l;
            }
            left < m-1 && qsort(left, m-1);
            m+1 < right && qsort(m+1, right);
        }

        qsort(0, data.length-1)
        can.onaction.show(event, can, list)
    },
    "归并": function(event, can, msg, cmd, item) {
        var data = can.core.List(msg.data, function(item) {return parseInt(item)});
        var list = []
        function merge(left, right) {
            var mid = parseInt((left+right)/2);
            left < mid && merge(left, mid);
            mid+1 < right && merge(mid+1, right);

            for (var i = mid+1; i <= right; i++) {
                for (var j = i; j >= left; j--) {
                    if (data[j] < data[j-1]) {
                        list.push([j-1, j]);
                        var temp = data[j-1];
                        data[j-1] = data[j];
                        data[j] = temp;
                    }
                }
            }
        }
        merge(0, data.length-1)
        can.onaction.show(event, can, list)
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



