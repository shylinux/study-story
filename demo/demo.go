package demo

import (
	"github.com/shylinux/icebergs"
	"github.com/shylinux/icebergs/core/wiki"
	"github.com/shylinux/toolkits"
	"math/rand"
)

var Index = &ice.Context{Name: "demo", Help: "demo",
	Caches: map[string]*ice.Cache{},
	Configs: map[string]*ice.Config{
		"demo": {Name: "demo", Help: "demo", Value: kit.Data(kit.MDB_SHORT, "name")},
	},
	Commands: map[string]*ice.Command{
		ice.ICE_INIT: {Hand: func(m *ice.Message, c *ice.Context, cmd string, arg ...string) {}},
		ice.ICE_EXIT: {Hand: func(m *ice.Message, c *ice.Context, cmd string, arg ...string) {}},

		"pi": {Name: "pi", Help: "圆周率", Hand: func(m *ice.Message, c *ice.Context, cmd string, arg ...string) {
			var res, item float64
			res = 4.0
			for i := 1; i < kit.Int(kit.Select("10000", arg, 0)); i++ {
				item = 4.0 / (2*float64(i) + 1)
				if i%2 == 1 {
					res -= item
				} else {
					res += item
				}
			}
			m.Echo("%g\n", res)
		}},
		"sort": {Name: "sort", Help: "排序", Meta: kit.Dict("display", "github.com/shylinux/study-story/demo/sort.js"), List: kit.List(
			kit.MDB_INPUT, "text", "name", "count",
			kit.MDB_INPUT, "text", "name", "speed",
			kit.MDB_INPUT, "button", "name", "随机",
		), Hand: func(m *ice.Message, c *ice.Context, cmd string, arg ...string) {
			n := kit.Int(kit.Select("20", arg, 0))
			m.Option("width", n*20)
			m.Option("height", 130)
			m.Option("font-size", kit.Select("16", arg, 3))
			m.Option("stroke", kit.Select("yellow", arg, 4))
			m.Option("fill", kit.Select("purple", arg, 5))

			m.Option("style", "")
			m.Option("compact", "false")
			m.Option("stroke-width", "2")

			for i := 0; i < n; i++ {
				m.Push("data", rand.Intn(100))
			}

			m.Render(m.Conf("chart", ice.Meta("prefix")))
			m.Render(m.Conf("chart", ice.Meta("suffix")))
		}},
		"tree": {Name: "tree", Help: "二叉树", Meta: kit.Dict("display", "github.com/shylinux/study-story/demo/tree.js"), List: kit.List(
			kit.MDB_INPUT, "text", "name", "count",
			kit.MDB_INPUT, "text", "name", "speed",
			kit.MDB_INPUT, "button", "name", "随机",
		), Hand: func(m *ice.Message, c *ice.Context, cmd string, arg ...string) {
			n := kit.Int(kit.Select("20", arg, 0))
			m.Option("width", n*20)
			m.Option("height", 130)
			m.Option("font-size", kit.Select("16", arg, 3))
			m.Option("stroke", kit.Select("yellow", arg, 4))
			m.Option("fill", kit.Select("purple", arg, 5))

			m.Option("style", "")
			m.Option("compact", "false")
			m.Option("stroke-width", "2")

			for i := 0; i < n; i++ {
				m.Push("data", rand.Intn(100))
			}

			m.Render(m.Conf("chart", ice.Meta("prefix")))
			m.Render(m.Conf("chart", ice.Meta("suffix")))
		}},
	},
}

func init() { wiki.Index.Register(Index, nil) }
