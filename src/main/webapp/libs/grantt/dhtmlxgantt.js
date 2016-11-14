var timeunit ="day";
var labelTimeHeader = "";
gantt = {
        version: "4.0.0"
    }
    , gantt.event = function(t, e, n) {
        t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent && t.attachEvent("on" + e, n)
    }, gantt.eventRemove = function(t, e, n) {
        t.removeEventListener ? t.removeEventListener(e, n, !1) : t.detachEvent && t.detachEvent("on" + e, n)
    }, gantt._eventable = function(t) {
        t._silent_mode = !1, t._silentStart = function() {
            this._silent_mode = !0
        }, t._silentEnd = function() {
            this._silent_mode = !1
        }, t.attachEvent = function(t, e, n) {
            //t.unit = timeunit
            return t = "ev_" + t.toLowerCase(), this[t] || (this[t] = new this._eventCatcher(n || this)),
                t + ":" + this[t].addEvent(e)
        }, t.callEvent = function(t, e) {
            return this._silent_mode ? !0 : (t = "ev_" + t.toLowerCase(), this[t] ? this[t].apply(this, e) : !0)
        }, t.checkEvent = function(t) {
            return !!this["ev_" + t.toLowerCase()]
        }, t._eventCatcher = function(t) {
            var e = [],
                n = function() {
                    for (var n = !0, a = 0; a < e.length; a++)
                        if (e[a]) {
                            var i = e[a].apply(t, arguments);
                            n = n && i
                        }
                    return n
                };
            return n.addEvent = function(t) {
                return "function" == typeof t ? e.push(t) - 1 : !1
            }, n.removeEvent = function(t) {
                e[t] = null
            }, n
        }, t.detachEvent = function(t) {
            if (t) {
                var e = t.split(":");
                this[e[0]].removeEvent(e[1])
            }
        }, t.detachAllEvents = function() {
            for (var t in this) 0 === t.indexOf("ev_") && delete this[t]
        }, t = null
    }, gantt.copy = function(t) {
        var e, n, a;
        if (t && "object" == typeof t) {
            for (a = {}, n = [Array, Date, Number, String, Boolean], e = 0; e < n.length; e++) t instanceof n[e] && (a = e ? new n[e](t) : new n[e]);
            for (e in t) Object.prototype.hasOwnProperty.apply(t, [e]) && (a[e] = gantt.copy(t[e]))
        }
        return a || t
    }, gantt.mixin = function(t, e, n) {
        for (var a in e)(!t[a] || n) && (t[a] = e[a]);
        return t
    }, gantt.defined = function(t) {
        return "undefined" != typeof t;
    }, gantt.uid = function() {
        return this._seed || (this._seed = (new Date).valueOf()), this._seed++, this._seed
    }, gantt.bind = function(t, e) {
        return t.bind ? t.bind(e) : function() {
            return t.apply(e, arguments)
        }
    }, gantt._get_position = function(t) {
        var e = 0,
            n = 0;
        if (t.getBoundingClientRect) {
            var a = t.getBoundingClientRect(),
                i = document.body,
                s = document.documentElement,
                r = window.pageYOffset || s.scrollTop || i.scrollTop,
                o = window.pageXOffset || s.scrollLeft || i.scrollLeft,
                _ = s.clientTop || i.clientTop || 0,
                d = s.clientLeft || i.clientLeft || 0;
            return e = a.top + r - _,
                n = a.left + o - d, {
                    y: Math.round(e),
                    x: Math.round(n),
                    width: t.offsetWidth,
                    height: t.offsetHeight
                }
        }
        for (; t;) e += parseInt(t.offsetTop, 10), n += parseInt(t.offsetLeft, 10), t = t.offsetParent;
        return {
            y: e,
            x: n,
            width: t.offsetWidth,
            height: t.offsetHeight
        }
    }, gantt._detectScrollSize = function() {
        var t = document.createElement("div");
        t.style.cssText = "visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;", document.body.appendChild(t);
        var e = t.offsetWidth - t.clientWidth;
        return document.body.removeChild(t), e
    }, window.dhtmlx && (dhtmlx.attaches || (dhtmlx.attaches = {}), dhtmlx.attaches.attachGantt = function(t, e, n) {
        var a = document.createElement("DIV");
        n = n || window.gantt, a.id = "gantt_" + n.uid(), a.style.width = "100%", a.style.height = "100%", a.cmp = "grid", document.body.appendChild(a), this.attachObject(a.id);
        var i = this.vs[this.av];
        i.grid = n, n.init(a.id, t, e), a.firstChild.style.border = "none", i.gridId = a.id, i.gridObj = a;
        var s = "_viewRestore";
        return this.vs[this[s]()].grid
    }), "undefined" != typeof window.dhtmlXCellObject && (dhtmlXCellObject.prototype.attachGantt = function(t, e, n) {
        n = n || window.gantt;
        var a = document.createElement("DIV");
        a.id = "gantt_" + n.uid(), a.style.width = "100%", a.style.height = "100%", a.cmp = "grid", document.body.appendChild(a), this.attachObject(a.id), n.init(a.id, t, e), a.firstChild.style.border = "none";
        return a = null, this.callEvent("_onContentAttach", []), this.dataObj
    }), gantt._eventable(gantt), gantt._click = {}, gantt._dbl_click = {}, gantt._context_menu = {}, gantt._on_click = function(t) {
        t = t || window.event;
        var e = t.target || t.srcElement,
            n = gantt.locate(t),
            a = !0;
        if (null !== n ? a = !gantt.checkEvent("onTaskClick") || gantt.callEvent("onTaskClick", [n, t]) : gantt.callEvent("onEmptyClick", [t]),
            a) {
            var i = gantt._find_ev_handler(t, e, gantt._click, n);
            if (!i) return;
            n && gantt.getTask(n) && gantt.config.select_task && gantt.selectTask(n)
        }
    }, gantt._on_contextmenu = function(t) {
        t = t || window.event;
        var e = t.target || t.srcElement,
            n = gantt.locate(e),
            a = gantt.locate(e, gantt.config.link_attribute),
            i = !gantt.checkEvent("onContextMenu") || gantt.callEvent("onContextMenu", [n, a, t]);
        return i || (t.preventDefault ? t.preventDefault() : t.returnValue = !1), i
    }, gantt._find_ev_handler = function(t, e, n, a) {
        for (var i = !0; e;) {
            var s = gantt._getClassName(e);
            if (s) {
                s = s.split(" ");
                for (var r = 0; r < s.length; r++)
                    if (s[r] && n[s[r]]) {
                        var o = n[s[r]].call(gantt, t, a, e);
                        i = i && !("undefined" != typeof o && o !== !0)
                    }
            }
            e = e.parentNode
        }
        return i
    }, gantt._on_dblclick = function(t) {
        /*t = t || window.event;
        var e = t.target || t.srcElement,
            n = gantt.locate(t),
            a = !gantt.checkEvent("onTaskDblClick") || gantt.callEvent("onTaskDblClick", [n, t]);
        if (a) {
            var i = gantt._find_ev_handler(t, e, gantt._dbl_click, n);
            if (!i) return;
            null !== n && gantt.getTask(n) && a && gantt.config.details_on_dblclick && gantt.showLightbox(n)
        }*/
    }, gantt._on_mousemove = function(t) {
        /*if (gantt.checkEvent("onMouseMove")) {
            var e = gantt.locate(t);
            gantt._last_move_event = t, gantt.callEvent("onMouseMove", [e, t])
        }*/
    }, gantt._DnD = function(t, e) {
        e && (this._settings = e), gantt._eventable(this), gantt.event(t, "mousedown", gantt.bind(function(n) {
            e.original_target = {
                target: n.target || n.srcElement
            }, this.dragStart(t, n)
        }, this))
    }, gantt._DnD.prototype = {
        dragStart: function(t, e) {
            this.config = {
                obj: t,
                marker: null,
                started: !1,
                pos: this.getPosition(e),
                sensitivity: 4
            }, this._settings && gantt.mixin(this.config, this._settings, !0);
            var n = gantt.bind(function(e) {
                    return this.dragMove(t, e)
                }, this),
                a = (gantt.bind(function(e) {
                    return this.dragScroll(t, e)
                }, this), gantt.bind(function(t) {
                    return gantt.defined(this.config.updates_per_second) && !gantt._checkTimeout(this, this.config.updates_per_second) ? !0 : n(t)
                }, this)),
                i = gantt.bind(function(e) {
                    return gantt.eventRemove(document.body, "mousemove", a), gantt.eventRemove(document.body, "mouseup", i), this.dragEnd(t)
                }, this);
            gantt.event(document.body, "mousemove", a), gantt.event(document.body, "mouseup", i),
                document.body.className += " gantt_noselect"
        },
        dragMove: function(t, e) {
            /*if (!this.config.marker && !this.config.started) {
                var n = this.getPosition(e),
                    a = n.x - this.config.pos.x,
                    i = n.y - this.config.pos.y,
                    s = Math.sqrt(Math.pow(Math.abs(a), 2) + Math.pow(Math.abs(i), 2));
                if (s > this.config.sensitivity) {
                    if (this.config.started = !0, this.config.ignore = !1, this.callEvent("onBeforeDragStart", [t, this.config.original_target]) === !1) return this.config.ignore = !0, !0;
                    var r = this.config.marker = document.createElement("div");
                    r.className = "gantt_drag_marker",
                        r.innerHTML = "Dragging object", document.body.appendChild(r), this.callEvent("onAfterDragStart", [t, this.config.original_target])
                } else this.config.ignore = !0
            }
            this.config.ignore || (e.pos = this.getPosition(e), this.config.marker.style.left = e.pos.x + "px", this.config.marker.style.top = e.pos.y + "px", this.callEvent("onDragMove", [t, e]))
*/        },
        dragEnd: function(t) {
            //this.config.marker && (this.config.marker.parentNode.removeChild(this.config.marker), this.config.marker = null, this.callEvent("onDragEnd", [])), document.body.className = document.body.className.replace(" gantt_noselect", "");
        },
        getPosition: function(t) {
            var e = 0,
                n = 0;
            return t = t || window.event, t.pageX || t.pageY ? (e = t.pageX, n = t.pageY) : (t.clientX || t.clientY) && (e = t.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, n = t.clientY + document.body.scrollTop + document.documentElement.scrollTop), {
                x: e,
                y: n
            }
        }
    }, gantt._init_grid = function() {
        this._click.gantt_close = this.bind(function(t, e, n) {
            return this.close(e), !1
        }, this), this._click.gantt_open = this.bind(function(t, e, n) {
            return this.open(e), !1
        }, this), this._click.gantt_row = this.bind(function(t, e, n) {
            if (null !== e) {
                var a = this.getTask(e);
                this.config.scroll_on_click && this.showDate(a.start_date), this.callEvent("onTaskRowClick", [e, n])
            }
        }, this), this._click.gantt_grid_head_cell = this.bind(function(t, e, n) {
            var a = n.getAttribute("column_id");
            if (this.callEvent("onGridHeaderClick", [a, t])) {
                if ("add" == a) return void this._click.gantt_add(t, this.config.root_id);
                if (this.config.sort) {
                    for (var i, s = a, r = 0; this.config.columns.length; r++)
                        if (this.config.columns[r].name == a) {
                            i = this.config.columns[r];
                            break
                        }
                    if (i && void 0 !== i.sort && i.sort !== !0 && (s = i.sort, !s)) return;
                    var o = this._sort && this._sort.direction && this._sort.name == a ? this._sort.direction : "desc";
                    o = "desc" == o ? "asc" : "desc", this._sort = {
                        name: a,
                        direction: o
                    }, this.sort(s, "desc" == o)
                }
            }
        }, this), !this.config.sort && this.config.order_branch && this._init_dnd(), this._click.gantt_add = this.bind(function(t, e, n) {
            if (!this.config.readonly) {
                var a = {};
                return this.createTask(a, e ? e : this.config.root_id), !1
            }
        }, this), this._init_resize && this._init_resize()
    }, gantt._render_grid = function() {
        this._is_grid_visible() && (this._calc_grid_width(),
            this._render_grid_header())
    }, gantt._calc_grid_width = function() {
        for (var t = this.getGridColumns(), e = 0, n = [], a = [], i = 0; i < t.length; i++) {
            var s = parseInt(t[i].width, 10);
            window.isNaN(s) && (s = 50, n.push(i)), a[i] = s, e += s
        }
        if (this.config.autofit || n.length) {
            var r = this._get_grid_width() - e;
            r / (n.length > 0 ? n.length : a.length > 0 ? a.length : 1);
            if (n.length > 0)
                for (var o = r / (n.length ? n.length : 1), i = 0; i < n.length; i++) {
                    var _ = n[i];
                    a[_] += o
                } else
                    for (var o = r / (a.length ? a.length : 1), i = 0; i < a.length; i++) a[i] += o;
            for (var i = 0; i < a.length; i++) t[i].width = a[i];
        } else this.config.grid_width = e
    }, gantt._render_grid_header = function() {
        for (var t = this.getGridColumns(), e = [], n = 0, a = this.locale.labels, i = this.config.scale_height - 2, s = 0; s < t.length; s++) {
            var r = s == t.length - 1,
                o = t[s],
                _ = 1 * o.width;
            r && this._get_grid_width() > n + _ && (o.width = _ = this._get_grid_width() - n), n += _;
            var d = this._sort && o.name == this._sort.name ? "<div class='gantt_sort gantt_" + this._sort.direction + "'></div>" : "",
                l = ["gantt_grid_head_cell", "col-md-4 gantt_grid_head_" + o.name, r ? "gantt_last_cell" : "", this.templates.grid_header_class(o.name, o)].join(" "),
                g = "",
                h = o.label || a["column_" + o.name];
            h = h || "";
            var c = "<div class='" + l + "' style='" + g + "' column_id='" + o.name + "'>" + h + d + "</div>";
            e.push(c)
        }
        this.$grid_scale.style.height = this.config.scale_height - 1 + "px", this.$grid_scale.style.lineHeight = i + "px", this.$grid_scale.style.width = n - 1 + "px", this.$grid_scale.innerHTML = e.join("")
    }, gantt._render_grid_item = function(t) {
        //t.unit = timeunit
        if (!gantt._is_grid_visible()) return null;
        for (var e = this.getGridColumns(), n = [], a = 0; a <1; a++) {
            var i, s, r = a == e.length - 1,
                o = e[a];
            "add" == o.name ? s = "<div class='gantt_add'></div>" : (s = o.template ? o.template(t) : t[o.name],
                s instanceof Date && (s = this.templates.date_grid(s, t)), s = "<div class='gantt_tree_content'>" + s + "</div>");
            var _ = "gantt_cell" + (r ? " gantt_last_cell" : ""),
                d = "";
            if (o.tree) {
                for (var l = 0; l < t.$level; l++)
                 d += this.templates.grid_indent(t);
                var g = this._has_children(t.id);
                g ? (d += this.templates.grid_open(t), d += this.templates.grid_folder(t)) : (d += this.templates.grid_blank(t), d += this.templates.grid_file(t))
            }
            var h = "width:" + (o.width - (r ? 1 : 0)) + "px;";

            this.defined(o.align) && (h += "text-align:" + o.align + ";"), i = "<div class='" + _ + "' style='" + h + "'>" + d + s + "</div>",
                n.push(i)
        }
        var _ = t.$index % 2 === 0 ? "" : " odd";
        if (_ += t.$transparent ? " gantt_transparent" : "", _ += t.$dataprocessor_class ? " " + t.$dataprocessor_class : "", this.templates.grid_row_class) {
            var c = this.templates.grid_row_class.call(this, t.start_date, t.end_date, t);
            c && (_ += " " + c)
        }
        this.getState().selected_task == t.id && (_ += " gantt_selected");
        var u = document.createElement("div");
        return u.className = "gantt_row" + _, u.style.height = this.config.row_height + "px", u.style.lineHeight = gantt.config.row_height + "px", u.setAttribute(this.config.task_attribute, t.id),
            u.innerHTML = n.join(""), u
    }, gantt.open = function(t) {
       // t.unit = timeunit
        gantt._set_item_state(t, !0), this.callEvent("onTaskOpened", [t])
    }, gantt.close = function(t) {
        gantt._set_item_state(t, !1), this.callEvent("onTaskClosed", [t])
    }, gantt._set_item_state = function(t, e) {
        t && this._pull[t] && (this._pull[t].$open = e, gantt._refresh_on_toggle_element(t))
    }, gantt._refresh_on_toggle_element = function(t) {
        this.refreshData()
    }, gantt._is_grid_visible = function() {
        return this.config.grid_width && this.config.show_grid
    }, gantt._get_grid_width = function() {
        return this._is_grid_visible() ? this._is_chart_visible() ? this.config.grid_width : this._x : 0
    }, gantt.moveTask = function(t, e, n) {
       /* var a = arguments[3];
        if (a) {
            if (a === t) return;
            n = this.getParent(a), e = this.getTaskIndex(a)
        }
        if (t != n) {
            n = n || this.config.root_id;
            var i = this.getTask(t),
                s = this.getParent(i.id),
                r = (this.getChildren(this.getParent(i.id)), this.getChildren(n));
            if (-1 == e && (e = r.length + 1), s == n) {
                var o = this.getTaskIndex(t);
                if (o == e) return
            }
            if (this.callEvent("onBeforeTaskMove", [t, n, e]) !== !1) {
                this._replace_branch_child(s, t),
                    r = this.getChildren(n);
                var _ = r[e];
                _ ? r = r.slice(0, e).concat([t]).concat(r.slice(e)) : r.push(t), this.setParent(i, n), this._branches[n] = r, i.$level = this.calculateTaskLevel(i), 1 * e > 0 ? a ? i.$drop_target = (this.getTaskIndex(t) > this.getTaskIndex(a) ? "next:" : "") + a : i.$drop_target = "next:" + gantt.getPrevSibling(t) : r[1 * e + 1] ? i.$drop_target = r[1 * e + 1] : i.$drop_target = n, this.callEvent("onAfterTaskMove", [t, n, e]) && this.refreshData()
            }
        }*/
    }, gantt._init_dnd = function() {
        var t = new gantt._DnD(this.$grid_data, {
            updates_per_second: 60
        });
        this.defined(this.config.dnd_sensitivity) && (t.config.sensitivity = this.config.dnd_sensitivity),
            t.attachEvent("onBeforeDragStart", this.bind(function(e, n) {
                var a = this._locateHTML(n);
                if (!a) return !1;
                this.hideQuickInfo && this._hideQuickInfo();
                var i = this.locate(n),
                    s = gantt.getTask(i);
                return gantt._is_readonly(s) ? !1 : (t.config.initial_open_state = s.$open, this.callEvent("onRowDragStart", [i, n.target || n.srcElement, n]) ? void 0 : !1)
            }, this)), t.attachEvent("onAfterDragStart", this.bind(function(e, n) {
                var a = this._locateHTML(n);
                t.config.marker.innerHTML = a.outerHTML, t.config.id = this.locate(n);
                var i = this.getTask(t.config.id);
                t.config.index = this.getTaskIndex(t.config.id), t.config.parent = i.parent, i.$open = !1, i.$transparent = !0, this.refreshData()
            }, this)), t.lastTaskOfLevel = function(t) {
                for (var e = gantt._order, n = gantt._pull, a = null, i = 0, s = e.length; s > i; i++) n[e[i]].$level == t && (a = n[e[i]]);
                return a ? a.id : null
            }, t._getGridPos = this.bind(function(t) {
                var e = this._get_position(this.$grid_data),
                    n = e.x,
                    a = t.pos.y - 10;
                return a < e.y && (a = e.y), a > e.y + this.$grid_data.offsetHeight - this.config.row_height && (a = e.y + this.$grid_data.offsetHeight - this.config.row_height),
                    e.x = n, e.y = a, e
            }, this), t.attachEvent("onDragMove", this.bind(function(e, n) {
                function a(t, e) {

                    return t.$level == e.$level || gantt.config.order_branch_free
                }
                var i = t.config,
                    s = t._getGridPos(n);
                i.marker.style.left = s.x + 10 + "px", i.marker.style.top = s.y + "px", s = t._getGridPos(n);
                var r = (s.x, s.y),
                    o = document.documentElement.scrollTop || document.body.scrollTop,
                    _ = document.documentElement.scrollLeft || document.body.scrollLeft,
                    d = document.elementFromPoint(s.x - _ + 1, r - o),
                    l = this.locate(d),
                    g = this.getTask(t.config.id);
                if (this.isTaskExists(l) || (l = t.lastTaskOfLevel(gantt.config.order_branch_free ? g.$level : 0),
                        l == t.config.id && (l = null)), this.isTaskExists(l)) {
                    var h = gantt._get_position(d),
                        c = this.getTask(l);
                    if (h.y + d.offsetHeight / 2 < r) {
                        var u = this.getGlobalTaskIndex(c.id),
                            f = this._pull[this._order[u + 1]];
                        if (f) {
                            if (f.id == g.id) return;
                            c = f
                        } else if (f = this._pull[this._order[u]], a(f, g) && f.id != g.id) return void this.moveTask(g.id, -1, this.getParent(f.id))
                    }
                    for (var u = this.getGlobalTaskIndex(c.id), p = this._pull[this._order[u - 1]], v = 1;
                        (!p || p.id == c.id) && u - v >= 0;) p = this._pull[this._order[u - v]], v++;
                    if (g.id == c.id) return;
                    a(c, g) && g.id != c.id ? this.moveTask(g.id, 0, 0, c.id) : c.$level != g.$level - 1 || gantt.getChildren(c.id).length ? p && a(p, g) && g.id != p.id && this.moveTask(g.id, -1, this.getParent(p.id)) : this.moveTask(g.id, 0, c.id);
                }
                return !0
            }, this)), t.attachEvent("onDragEnd", this.bind(function() {
                var e = this.getTask(t.config.id);
                this.callEvent("onBeforeRowDragEnd", [t.config.id, t.config.parent, t.config.index]) === !1 ? (this.moveTask(t.config.id, t.config.index, t.config.parent), e.$drop_target = null) : this.callEvent("onRowDragEnd", [t.config.id, e.$drop_target]), e.$transparent = !1, e.$open = t.config.initial_open_state, this.refreshData()
            }, this))
    }, gantt.getGridColumns = function() {
        return this.config.columns
    }, gantt._has_children = function(t) {
       // t.unit = timeunit
        return this.getChildren(t).length > 0;
    }, gantt._scale_helpers = {
        getSum: function(t, e, n) {
            //t.unit = timeunit
            void 0 === n && (n = t.length - 1), void 0 === e && (e = 0);
            for (var a = 0, i = e; n >= i; i++) a += t[i];
            return a
        },
        setSumWidth: function(t, e, n, a) {
           // t.unit = timeunit
            var i = e.width;
            void 0 === a && (a = i.length - 1), void 0 === n && (n = 0);
            var s = a - n + 1;
            if (!(n > i.length - 1 || 0 >= s || a > i.length - 1)) {
                var r = this.getSum(i, n, a),
                    o = t - r;
                this.adjustSize(o, i, n, a), this.adjustSize(-o, i, a + 1), e.full_width = this.getSum(i)
            }
        },
        splitSize: function(t, e) {
            //t.unit = timeunit
            for (var n = [], a = 0; e > a; a++) n[a] = 0;
            return this.adjustSize(t, n), n
        },
        adjustSize: function(t, e, n, a) {
           // t.unit = timeunit
            

            n || (n = 0), void 0 === a && (a = e.length - 1);
            for (var i = a - n + 1, s = this.getSum(e, n, a), r = 0, o = n; a >= o; o++) {
                var _ = Math.floor(t * (s ? e[o] / s : 1 / i));
                s -= e[o], t -= _, i--, e[o] += _, r += _
            }
            e[e.length - 1] += t
        },
        sortScales: function(t) {
           // t.unit = timeunit
            function e(t, e) {
                var n = new Date(1970, 0, 1);
                return gantt.date.add(n, e, t) - n
            }
            t.sort(function(t, n) {
                return e(t.unit, t.step) < e(n.unit, n.step) ? 1 : e(t.unit, t.step) > e(n.unit, n.step) ? -1 : 0
            })
        },
        primaryScale: function() {
            
            return gantt._init_template("date_scale"), {
                unit: timeunit,
                step: gantt.config.step,
                template: gantt.templates.date_scale,
                date: labelTimeHeader,
                css: gantt.templates.scale_cell_class
            }
        },
        prepareConfigs: function(t, e, n, a) {
           // t.unit = timeunit
            for (var i = this.splitSize(a, t.length), s = n, r = [], o = t.length - 1; o >= 0; o--) {
                var _ = o == t.length - 1,
                    d = this.initScaleConfig(t[o]);
                _ && this.processIgnores(d), this.initColSizes(d, e, s, i[o]), this.limitVisibleRange(d), _ && (s = d.full_width), r.unshift(d)
            }
            for (var o = 0; o < r.length - 1; o++) this.alineScaleColumns(r[r.length - 1], r[o]);
            for (var o = 0; o < r.length; o++) this.setPosSettings(r[o]);
            return r
        },
        setPosSettings: function(t) {
            //t.unit = timeunit
            for (var e = 0, n = t.trace_x.length; n > e; e++) t.left.push((t.width[e - 1] || 0) + (t.left[e - 1] || 0));
        },
        _ignore_time_config: function(t) {
            //t.unit = timeunit
            return this.config.skip_off_time ? !this.isWorkTime(t) : !1
        },
        processIgnores: function(t) {
           // t.unit = timeunit
            t.ignore_x = {}, t.display_count = t.count
        },
        initColSizes: function(t, e, n, a) {
           // t.unit = timeunit
            var i = n;
            t.height = a;
            var s = void 0 === t.display_count ? t.count : t.display_count;
            s || (s = 1), t.col_width = Math.floor(i / s), e && t.col_width < e && (t.col_width = e, i = t.col_width * s), t.width = [];
            for (var r = t.ignore_x || {}, o = 0; o < t.trace_x.length; o++) r[t.trace_x[o].valueOf()] || t.display_count == t.count ? t.width[o] = 0 : t.width[o] = 1;
            this.adjustSize(i - this.getSum(t.width), t.width),
                t.full_width = this.getSum(t.width)
        },
        initScaleConfig: function(t) {
            var e = gantt.mixin({
                count: 0,
                col_width: 0,
                full_width: 0,
                height: 0,
                width: [],
                left: [],
                trace_x: []
            }, t);
            return this.eachColumn(t.unit, t.step, function(t) {
                e.count++, e.trace_x.push(new Date(t))
            }), e
        },
        iterateScales: function(t, e, n, a, i) {
            //t.unit = timeunit
            for (var s = e.trace_x, r = t.trace_x, o = n || 0, _ = a || r.length - 1, d = 0, l = 1; l < s.length; l++)
                for (var g = o; _ >= g; g++) + r[g] != +s[l] || (i && i.apply(this, [d, l, o, g]), o = g, d = l)
        },
        alineScaleColumns: function(t, e, n, a) {
            //t.unit = timeunit
            this.iterateScales(t, e, n, a, function(n, a, i, s) {
                var r = this.getSum(t.width, i, s - 1),
                    o = this.getSum(e.width, n, a - 1);
                o != r && this.setSumWidth(r, e, n, a - 1)
            })
        },
        eachColumn: function(t, e, n) {
            //t.unit = timeunit
            var a = new Date(gantt._min_date),
                i = new Date(gantt._max_date);
            gantt.date[t + "_start"] && (a = gantt.date[t + "_start"](a));
            var s = new Date(a);
            for (+s >= +i && (i = gantt.date.add(s, e, t)); + i > +s;) {
                n.call(this, new Date(s));
                var r = s.getTimezoneOffset();
                s = gantt.date.add(s, e, t), s = gantt._correct_dst_change(s, r, e, t), gantt.date[t + "_start"] && (s = gantt.date[t + "_start"](s))
            }
        },
        limitVisibleRange: function(t) {
           // t.unit = timeunit
            var e = t.trace_x,
                n = 0,
                a = t.width.length - 1,
                i = 0;
            if (+e[0] < +gantt._min_date && n != a) {
                var s = Math.floor(t.width[0] * ((e[1] - gantt._min_date) / (e[1] - e[0])));
                i += t.width[0] - s, t.width[0] = s, e[0] = new Date(gantt._min_date)
            }
            var r = e.length - 1,
                o = e[r],
                _ = gantt.date.add(o, t.step, t.unit);
            if (+_ > +gantt._max_date && r > 0) {
                var s = t.width[r] - Math.floor(t.width[r] * ((_ - gantt._max_date) / (_ - o)));
                i += t.width[r] - s, t.width[r] = s
            }
            if (i) {
                for (var d = this.getSum(t.width), l = 0, g = 0; g < t.width.length; g++) {
                    var h = Math.floor(i * (t.width[g] / d));
                    t.width[g] += h,
                        l += h
                }
                this.adjustSize(i - l, t.width)
            }
        }
    }, gantt._tasks_dnd = {
        drag: null,
        _events: {
            before_start: {},
            before_finish: {},
            after_finish: {}
        },
        _handlers: {},
        init: function() {
            this.clear_drag_state();
            var t = gantt.config.drag_mode;
            this.set_actions();
            var e = {
                before_start: "onBeforeTaskDrag",
                before_finish: "onBeforeTaskChanged",
                after_finish: "onAfterTaskDrag"
            };
            for (var n in this._events)
                for (var a in t) this._events[n][a] = e[n];
            this._handlers[t.move] = this._move, this._handlers[t.resize] = this._resize, this._handlers[t.progress] = this._resize_progress;
        },
        set_actions: function() {
           /* var t = gantt.$task_data;
            gantt.event(t, "mousemove", gantt.bind(function(t) {
                this.on_mouse_move(t || event)
            }, this)), gantt.event(t, "mousedown", gantt.bind(function(t) {
                this.on_mouse_down(t || event)
            }, this)), gantt.event(t, "mouseup", gantt.bind(function(t) {
                this.on_mouse_up(t || event)
            }, this))*/
        },
        clear_drag_state: function() {
            this.drag = {
                id: null,
                mode: null,
                pos: null,
                start_x: null,
                start_y: null,
                obj: null,
                left: null
            }
        },
        _resize: function(t, e, n) {
           // t.unit = timeunit
            var a = gantt.config,
                i = this._drag_task_coords(t, n);
            n.left ? (t.start_date = gantt.dateFromPos(i.start + e),
                t.start_date || (t.start_date = new Date(gantt.getState().min_date))) : (t.end_date = gantt.dateFromPos(i.end + e), t.end_date || (t.end_date = new Date(gantt.getState().max_date))), t.end_date - t.start_date < a.min_duration && (n.left ? t.start_date = gantt.calculateEndDate(t.end_date, -1) : t.end_date = gantt.calculateEndDate(t.start_date, 1)), gantt._init_task_timing(t)
        },
        _resize_progress: function(t, e, n) {
            //t.unit = timeunit
            var a = this._drag_task_coords(t, n),
                i = Math.max(0, n.pos.x - a.start);
            t.progress = Math.min(1, i / (a.end - a.start))
        },
        _move: function(t, e, n) {
           // t.unit = timeunit
            var a = this._drag_task_coords(t, n),
                i = gantt.dateFromPos(a.start + e),
                s = gantt.dateFromPos(a.end + e);
            i ? s ? (t.start_date = i, t.end_date = s) : (t.end_date = new Date(gantt.getState().max_date), t.start_date = gantt.dateFromPos(gantt.posFromDate(t.end_date) - (a.end - a.start))) : (t.start_date = new Date(gantt.getState().min_date), t.end_date = gantt.dateFromPos(gantt.posFromDate(t.start_date) + (a.end - a.start)))
        },
        _drag_task_coords: function(t, e) {
            //t.unit = timeunit
            var n = e.obj_s_x = e.obj_s_x || gantt.posFromDate(t.start_date),
                a = e.obj_e_x = e.obj_e_x || gantt.posFromDate(t.end_date);
            return {
                start: n,
                end: a
            }
        },
        on_mouse_move: function(t) {
           // t.unit = timeunit
            this.drag.start_drag && this._start_dnd(t);
            var e = this.drag;
            if (e.mode) {
                if (!gantt._checkTimeout(this, 40)) return;
                this._update_on_move(t)
            }
        },
        _update_on_move: function(t) {
            //t.unit = timeunit
            var e = this.drag;
            if (e.mode) {
                var n = gantt._get_mouse_pos(t);
                if (e.pos && e.pos.x == n.x) return;
                e.pos = n;
                var a = gantt.dateFromPos(n.x);
                if (!a || isNaN(a.getTime())) return;
                var i = n.x - e.start_x,
                    s = gantt.getTask(e.id);
                if (this._handlers[e.mode]) {
                    var r = gantt.mixin({}, s),
                        o = gantt.mixin({}, s);
                    this._handlers[e.mode].apply(this, [o, i, e]),
                        gantt.mixin(s, o, !0), gantt.callEvent("onTaskDrag", [s.id, e.mode, o, r, t]), gantt.mixin(s, o, !0), gantt._update_parents(e.id), gantt.refreshTask(e.id)
                }
            }
        },
        on_mouse_down: function(t, e) {
            //t.unit = timeunit
            if (2 != t.button) {
                var n = gantt.locate(t),
                    a = null;
                if (gantt.isTaskExists(n) && (a = gantt.getTask(n)), !gantt._is_readonly(a) && !this.drag.mode) {
                    this.clear_drag_state(), e = e || t.target || t.srcElement;
                    var i = gantt._getClassName(e);
                    if (!i || !this._get_drag_mode(i)) return e.parentNode ? this.on_mouse_down(t, e.parentNode) : void 0;
                    var s = this._get_drag_mode(i);
                    if (s)
                        if (s.mode && s.mode != gantt.config.drag_mode.ignore && gantt.config["drag_" + s.mode]) {
                            if (n = gantt.locate(e), a = gantt.copy(gantt.getTask(n) || {}), gantt._is_readonly(a)) return this.clear_drag_state(), !1;
                            if (gantt._is_flex_task(a) && s.mode != gantt.config.drag_mode.progress) return void this.clear_drag_state();
                            s.id = n;
                            var r = gantt._get_mouse_pos(t);
                            s.start_x = r.x, s.start_y = r.y, s.obj = a, this.drag.start_drag = s
                        } else this.clear_drag_state();
                    else if (gantt.checkEvent("onMouseDown") && gantt.callEvent("onMouseDown", [i.split(" ")[0]]) && e.parentNode) return this.on_mouse_down(t, e.parentNode);
                }
            }
        },
        _fix_dnd_scale_time: function(t, e) {
           // t.unit = timeunit
            function n(t) {
                t.unit = timeunit
                gantt.isWorkTime(t.start_date) || (t.start_date = gantt.calculateEndDate(t.start_date, -1, gantt.config.duration_unit))
            }

            function a(t) {

                //t.unit = timeunit
                gantt.isWorkTime(new Date(t.end_date - 1)) || (t.end_date = gantt.calculateEndDate(t.end_date, 1, gantt.config.duration_unit))
            }
            var i = gantt._tasks.unit,
                s = gantt._tasks.step;
            gantt.config.round_dnd_dates || (i = "minute", s = gantt.config.time_step), e.mode == gantt.config.drag_mode.resize ? e.left ? (t.start_date = gantt.roundDate({
                date: t.start_date,
                unit: i,
                step: s
            }), n(t)) : (t.end_date = gantt.roundDate({
                date: t.end_date,
                unit: i,
                step: s
            }), a(t)) : e.mode == gantt.config.drag_mode.move && (t.start_date = gantt.roundDate({
                date: t.start_date,
                unit: i,
                step: s
            }), n(t), t.end_date = gantt.calculateEndDate(t.start_date, t.duration, gantt.config.duration_unit))
        },
        _fix_working_times: function(t, e) {
           // t.unit = timeunit
            var e = e || {
                mode: gantt.config.drag_mode.move
            };
            gantt.config.work_time && gantt.config.correct_work_time && (e.mode == gantt.config.drag_mode.resize ? e.left ? t.start_date = gantt.getClosestWorkTime({
                date: t.start_date,
                dir: "future"
            }) : t.end_date = gantt.getClosestWorkTime({
                date: t.end_date,
                dir: "past"
            }) : e.mode == gantt.config.drag_mode.move && gantt.correctTaskWorkTime(t))
        },
        on_mouse_up: function(t) {
           // t.unit = timeunit
            var e = this.drag;
            if (e.mode && e.id) {
                var n = gantt.getTask(e.id);
                if (gantt.config.work_time && gantt.config.correct_work_time && this._fix_working_times(n, e), this._fix_dnd_scale_time(n, e), gantt._init_task_timing(n), this._fireEvent("before_finish", e.mode, [e.id, e.mode, gantt.copy(e.obj), t])) {
                    var a = e.id;
                    gantt._init_task_timing(n),
                        this.clear_drag_state(), gantt.updateTask(n.id), this._fireEvent("after_finish", e.mode, [a, e.mode, t])
                } else e.obj._dhx_changed = !1, gantt.mixin(n, e.obj, !0), gantt.updateTask(n.id)
            }
            this.clear_drag_state()
        },
        _get_drag_mode: function(t) {
            //t.unit = timeunit
            var e = gantt.config.drag_mode,
                n = (t || "").split(" "),
                a = n[0],
                i = {
                    mode: null,
                    left: null
                };
            switch (a) {
                case "gantt_task_line":
                case "gantt_task_content":
                    i.mode = e.move;
                    break;
                case "gantt_task_drag":
                    i.mode = e.resize, n[1] && -1 !== n[1].indexOf("left", n[1].length - "left".length) ? i.left = !0 : i.left = !1;
                    break;
                case "gantt_task_progress_drag":
                    i.mode = e.progress;
                    break;
                case "gantt_link_control":
                case "gantt_link_point":
                    i.mode = e.ignore;
                    break;
                default:
                    i = null
            }
            return i
        },
        _start_dnd: function(t) {
            var e = this.drag = this.drag.start_drag;
            delete e.start_drag;
            var n = gantt.config,
                a = e.id;
            n["drag_" + e.mode] && gantt.callEvent("onBeforeDrag", [a, e.mode, t]) && this._fireEvent("before_start", e.mode, [a, e.mode, t]) ? (delete e.start_drag, gantt.callEvent("onTaskDragStart", [])) : this.clear_drag_state()
        },
        _fireEvent: function(t, e, n) {
            gantt.assert(this._events[t], "Invalid stage:{" + t + "}");
            var a = this._events[t][e];
            return gantt.assert(a, "Unknown after drop mode:{" + e + "}"), gantt.assert(n, "Invalid event arguments"), gantt.checkEvent(a) ? gantt.callEvent(a, n) : !0
        }
    }, gantt.roundTaskDates = function(t) {
        var e = gantt._tasks_dnd.drag;
        e || (e = {
            mode: gantt.config.drag_mode.move
        }), gantt._tasks_dnd._fix_dnd_scale_time(t, e)
    }, gantt._render_link = function(t) {
        for (var e = this.getLink(t), n = gantt._get_link_renderers(), a = 0; a < n.length; a++) n[a].render_item(e)
    }, gantt._get_link_type = function(t, e) {
        var n = null;
        return t && e ? n = gantt.config.links.start_to_start : !t && e ? n = gantt.config.links.finish_to_start : t || e ? t && !e && (n = gantt.config.links.start_to_finish) : n = gantt.config.links.finish_to_finish,
            n
    }, gantt.isLinkAllowed = function(t, e, n, a) {
        var i = null;
        if (i = "object" == typeof t ? t : {
                source: t,
                target: e,
                type: this._get_link_type(n, a)
            }, !i) return !1;
        if (!(i.source && i.target && i.type)) return !1;
        if (i.source == i.target) return !1;
        var s = !0;
        return this.checkEvent("onLinkValidation") && (s = this.callEvent("onLinkValidation", [i])), s
    }, gantt._render_link_element = function(t) {
        var e = this._path_builder.get_points(t),
            n = gantt._drawer,
            a = n.get_lines(e),
            i = document.createElement("div"),
            s = "gantt_task_link";
        t.color && (s += " gantt_link_inline_color");
        var r = this.templates.link_class ? this.templates.link_class(t) : "";
        r && (s += " " + r), this.config.highlight_critical_path && this.isCriticalLink && this.isCriticalLink(t) && (s += " gantt_critical_link"), i.className = s, i.setAttribute(gantt.config.link_attribute, t.id);
        for (var o = 0; o < a.length; o++) {
            o == a.length - 1 && (a[o].size -= gantt.config.link_arrow_size);
            var _ = n.render_line(a[o], a[o + 1]);
            t.color && (_.firstChild.style.backgroundColor = t.color), i.appendChild(_)
        }
        var d = a[a.length - 1].direction,
            l = gantt._render_link_arrow(e[e.length - 1], d);
        return t.color && (l.style.borderColor = t.color), i.appendChild(l), i
    }, gantt._render_link_arrow = function(t, e) {
        var n = document.createElement("div"),
            a = gantt._drawer,
            i = t.y,
            s = t.x,
            r = gantt.config.link_arrow_size,
            o = gantt.config.row_height,
            _ = "gantt_link_arrow gantt_link_arrow_" + e;
        switch (e) {
            case a.dirs.right:
                i -= (r - o) / 2, s -= r;
                break;
            case a.dirs.left:
                i -= (r - o) / 2;
                break;
            case a.dirs.up:
                s -= r;
                break;
            case a.dirs.down:
                i += 2 * r, s -= r
        }
        return n.style.cssText = ["top:" + i + "px", "left:" + s + "px"].join(";"), n.className = _, n
    }, gantt._drawer = {
        current_pos: null,
        dirs: {
            left: "left",
            right: "right",
            up: "up",
            down: "down"
        },
        path: [],
        clear: function() {
            this.current_pos = null, this.path = []
        },
        point: function(t) {
            this.current_pos = gantt.copy(t)
        },
        get_lines: function(t) {
            this.clear(), this.point(t[0]);
            for (var e = 1; e < t.length; e++) this.line_to(t[e]);
            return this.get_path()
        },
        line_to: function(t) {
            var e = gantt.copy(t),
                n = this.current_pos,
                a = this._get_line(n, e);
            this.path.push(a), this.current_pos = e
        },
        get_path: function() {
            return this.path
        },
        get_wrapper_sizes: function(t) {
            var e, n = gantt.config.link_wrapper_width,
                a = (gantt.config.link_line_width,
                    t.y + (gantt.config.row_height - n) / 2);
            switch (t.direction) {
                case this.dirs.left:
                    e = {
                        top: a,
                        height: n,
                        lineHeight: n,
                        left: t.x - t.size - n / 2,
                        width: t.size + n
                    };
                    break;
                case this.dirs.right:
                    e = {
                        top: a,
                        lineHeight: n,
                        height: n,
                        left: t.x - n / 2,
                        width: t.size + n
                    };
                    break;
                case this.dirs.up:
                    e = {
                        top: a - t.size,
                        lineHeight: t.size + n,
                        height: t.size + n,
                        left: t.x - n / 2,
                        width: n
                    };
                    break;
                case this.dirs.down:
                    e = {
                        top: a,
                        lineHeight: t.size + n,
                        height: t.size + n,
                        left: t.x - n / 2,
                        width: n
                    }
            }
            return e
        },
        get_line_sizes: function(t) {
            var e, n = gantt.config.link_line_width,
                a = gantt.config.link_wrapper_width,
                i = t.size + n;
            switch (t.direction) {
                case this.dirs.left:
                case this.dirs.right:
                    e = {
                        height: n,
                        width: i,
                        marginTop: (a - n) / 2,
                        marginLeft: (a - n) / 2
                    };
                    break;
                case this.dirs.up:
                case this.dirs.down:
                    e = {
                        height: i,
                        width: n,
                        marginTop: (a - n) / 2,
                        marginLeft: (a - n) / 2
                    }
            }
            return e
        },
        render_line: function(t) {
            var e = this.get_wrapper_sizes(t),
                n = document.createElement("div");
            n.style.cssText = ["top:" + e.top + "px", "left:" + e.left + "px", "height:" + e.height + "px", "width:" + e.width + "px"].join(";"), n.className = "gantt_line_wrapper";
            var a = this.get_line_sizes(t),
                i = document.createElement("div");
            return i.style.cssText = ["height:" + a.height + "px", "width:" + a.width + "px", "margin-top:" + a.marginTop + "px", "margin-left:" + a.marginLeft + "px"].join(";"), i.className = "gantt_link_line_" + t.direction, n.appendChild(i), n
        },
        _get_line: function(t, e) {
            var n = this.get_direction(t, e),
                a = {
                    x: t.x,
                    y: t.y,
                    direction: this.get_direction(t, e)
                };
            return n == this.dirs.left || n == this.dirs.right ? a.size = Math.abs(t.x - e.x) : a.size = Math.abs(t.y - e.y), a
        },
        get_direction: function(t, e) {
            var n = 0;
            return n = e.x < t.x ? this.dirs.left : e.x > t.x ? this.dirs.right : e.y > t.y ? this.dirs.down : this.dirs.up;
        }
    }, gantt._y_from_ind = function(t) {
        return t * gantt.config.row_height
    }, gantt._path_builder = {
        path: [],
        clear: function() {
            this.path = []
        },
        current: function() {
            return this.path[this.path.length - 1]
        },
        point: function(t) {
            return t ? (this.path.push(gantt.copy(t)), t) : this.current()
        },
        point_to: function(t, e, n) {
            n = n ? {
                x: n.x,
                y: n.y
            } : gantt.copy(this.point());
            var a = gantt._drawer.dirs;
            switch (t) {
                case a.left:
                    n.x -= e;
                    break;
                case a.right:
                    n.x += e;
                    break;
                case a.up:
                    n.y -= e;
                    break;
                case a.down:
                    n.y += e
            }
            return this.point(n)
        },
        get_points: function(t) {
            var e = this.get_endpoint(t),
                n = gantt.config,
                a = e.e_y - e.y,
                i = e.e_x - e.x,
                s = gantt._drawer.dirs;
            this.clear(), this.point({
                x: e.x,
                y: e.y
            });
            var r = 2 * n.link_arrow_size,
                o = e.e_x > e.x;
            if (t.type == gantt.config.links.start_to_start) this.point_to(s.left, r), o ? (this.point_to(s.down, a), this.point_to(s.right, i)) : (this.point_to(s.right, i), this.point_to(s.down, a)), this.point_to(s.right, r);
            else if (t.type == gantt.config.links.finish_to_start)
                if (o = e.e_x > e.x + 2 * r, this.point_to(s.right, r), o) i -= r, this.point_to(s.down, a), this.point_to(s.right, i);
                else {
                    i -= 2 * r;
                    var _ = a > 0 ? 1 : -1;
                    this.point_to(s.down, _ * (n.row_height / 2)), this.point_to(s.right, i), this.point_to(s.down, _ * (Math.abs(a) - n.row_height / 2)), this.point_to(s.right, r)
                }
            else if (t.type == gantt.config.links.finish_to_finish) this.point_to(s.right, r), o ? (this.point_to(s.right, i), this.point_to(s.down, a)) : (this.point_to(s.down, a), this.point_to(s.right, i)), this.point_to(s.left, r);
            else if (t.type == gantt.config.links.start_to_finish)
                if (o = e.e_x > e.x - 2 * r, this.point_to(s.left, r), o) {
                    i += 2 * r;
                    var _ = a > 0 ? 1 : -1;
                    this.point_to(s.down, _ * (n.row_height / 2)),
                        this.point_to(s.right, i), this.point_to(s.down, _ * (Math.abs(a) - n.row_height / 2)), this.point_to(s.left, r)
                } else i += r, this.point_to(s.down, a), this.point_to(s.right, i);
            return this.path
        },
        get_endpoint: function(t) {
            var e = gantt.config.links,
                n = !1,
                a = !1;
            t.type == e.start_to_start ? n = a = !0 : t.type == e.finish_to_finish ? n = a = !1 : t.type == e.finish_to_start ? (n = !1, a = !0) : t.type == e.start_to_finish ? (n = !0, a = !1) : gantt.assert(!1, "Invalid link type");
            var i = gantt._get_task_visible_pos(gantt._pull[t.source], n),
                s = gantt._get_task_visible_pos(gantt._pull[t.target], a);
            return {
                x: i.x,
                e_x: s.x,
                y: i.y,
                e_y: s.y
            }
        }
    }, gantt._init_links_dnd = function() {
        function t(t, e, n) {
            var a = gantt._get_task_pos(t, !!e);
            return a.y += gantt._get_task_height() / 2, n = n || 0, a.x += (e ? -1 : 1) * n, a
        }

        function e(t) {
            var e = a(),
                n = ["gantt_link_tooltip"];
            e.from && e.to && (gantt.isLinkAllowed(e.from, e.to, e.from_start, e.to_start) ? n.push("gantt_allowed_link") : n.push("gantt_invalid_link"));
            var i = gantt.templates.drag_link_class(e.from, e.from_start, e.to, e.to_start);
            i && n.push(i);
            var s = "<div class='" + i + "'>" + gantt.templates.drag_link(e.from, e.from_start, e.to, e.to_start) + "</div>";
            t.innerHTML = s
        }

        function n(t, e) {
            t.style.left = e.x + 5 + "px", t.style.top = e.y + 5 + "px"
        }

        function a() {

            return {
                from: gantt._link_source_task,
                to: gantt._link_target_task,
                from_start: gantt._link_source_task_start,
                to_start: gantt._link_target_task_start
            }
        }

        function i() {
            gantt._link_source_task = gantt._link_source_task_start = gantt._link_target_task = null, gantt._link_target_task_start = !0
        }

        function s(t, e, n, i) {
            var s = _(),
                d = a(),
                l = ["gantt_link_direction"];
            gantt.templates.link_direction_class && l.push(gantt.templates.link_direction_class(d.from, d.from_start, d.to, d.to_start));
            var g = Math.sqrt(Math.pow(n - t, 2) + Math.pow(i - e, 2));
            if (g = Math.max(0, g - 3)) {
                s.className = l.join(" ");
                var h = (i - e) / (n - t),
                    c = Math.atan(h);
                2 == o(t, n, e, i) ? c += Math.PI : 3 == o(t, n, e, i) && (c -= Math.PI);
                var u = Math.sin(c),
                    f = Math.cos(c),
                    p = Math.round(e),
                    v = Math.round(t),
                    m = ["-webkit-transform: rotate(" + c + "rad)", "-moz-transform: rotate(" + c + "rad)", "-ms-transform: rotate(" + c + "rad)", "-o-transform: rotate(" + c + "rad)", "transform: rotate(" + c + "rad)", "width:" + Math.round(g) + "px"];
                if (-1 != window.navigator.userAgent.indexOf("MSIE 8.0")) {
                    m.push('-ms-filter: "' + r(u, f) + '"');
                    var k = Math.abs(Math.round(t - n)),
                        b = Math.abs(Math.round(i - e));
                    switch (o(t, n, e, i)) {
                        case 1:
                            p -= b;
                            break;
                        case 2:
                            v -= k, p -= b;
                            break;
                        case 3:
                            v -= k
                    }
                }
                m.push("top:" + p + "px"), m.push("left:" + v + "px"), s.style.cssText = m.join(";")
            }
        }

        function r(t, e) {
            return "progid:DXImageTransform.Microsoft.Matrix(M11 = " + e + ",M12 = -" + t + ",M21 = " + t + ",M22 = " + e + ",SizingMethod = 'auto expand')"
        }

        function o(t, e, n, a) {
            return e >= t ? n >= a ? 1 : 4 : n >= a ? 2 : 3
        }

        function _() {
            return l._direction || (l._direction = document.createElement("div"),
                gantt.$task_links.appendChild(l._direction)), l._direction
        }

        function d() {
            l._direction && (l._direction.parentNode && l._direction.parentNode.removeChild(l._direction), l._direction = null)
        }
        var l = new gantt._DnD(this.$task_bars, {
                sensitivity: 0,
                updates_per_second: 60
            }),
            g = "task_left",
            h = "task_right",
            c = "gantt_link_point",
            u = "gantt_link_control";
        l.attachEvent("onBeforeDragStart", gantt.bind(function(e, n) {
            var a = n.target || n.srcElement;
            if (i(), gantt.getState().drag_id) return !1;
            if (gantt._locate_css(a, c)) {
                gantt._locate_css(a, g) && (gantt._link_source_task_start = !0);
                var s = gantt._link_source_task = this.locate(n),
                    r = gantt.getTask(s);
                if (gantt._is_readonly(r)) return i(), !1;
                var o = 0;
                return gantt._get_safe_type(r.type) == gantt.config.types.milestone && (o = (gantt._get_visible_milestone_width() - gantt._get_milestone_width()) / 2), this._dir_start = t(r, !!gantt._link_source_task_start, o), !0
            }
            return !1
        }, this)), l.attachEvent("onAfterDragStart", gantt.bind(function(t, n) {
            e(l.config.marker)
        }, this)), l.attachEvent("onDragMove", gantt.bind(function(a, i) {
            var r = l.config,
                o = l.getPosition(i);
            n(r.marker, o);
            var _ = gantt._is_link_drop_area(i),
                d = gantt._link_target_task,
                g = gantt._link_landing,
                c = gantt._link_target_task_start,
                f = gantt.locate(i),
                p = !0;
            if (_ && (p = !gantt._locate_css(i, h), _ = !!f), gantt._link_target_task = f, gantt._link_landing = _, gantt._link_target_task_start = p, _) {
                var v = gantt.getTask(f),
                    m = gantt._locate_css(i, u),
                    k = 0;
                m && (k = Math.floor(m.offsetWidth / 2)), this._dir_end = t(v, !!gantt._link_target_task_start, k)
            } else this._dir_end = gantt._get_mouse_pos(i);
            var b = !(g == _ && d == f && c == p);
            return b && (d && gantt.refreshTask(d, !1),
                f && gantt.refreshTask(f, !1)), b && e(r.marker), s(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y), !0
        }, this)), l.attachEvent("onDragEnd", gantt.bind(function() {
            var t = a();
            if (t.from && t.to && t.from != t.to) {
                var e = gantt._get_link_type(t.from_start, t.to_start),
                    n = {
                        source: t.from,
                        target: t.to,
                        type: e
                    };
                n.type && gantt.isLinkAllowed(n) && gantt.addLink(n)
            }
            i(), t.from && gantt.refreshTask(t.from, !1), t.to && gantt.refreshTask(t.to, !1), d()
        }, this)), gantt._is_link_drop_area = function(t) {
            return !!gantt._locate_css(t, u);
        }
    }, gantt._get_link_state = function() {
        return {
            link_landing_area: this._link_landing,
            link_target_id: this._link_target_task,
            link_target_start: this._link_target_task_start,
            link_source_id: this._link_source_task,
            link_source_start: this._link_source_task_start
        }
    }, gantt._task_renderer = function(t, e, n, a) {
        return this._task_area_pulls || (this._task_area_pulls = {}), this._task_area_renderers || (this._task_area_renderers = {}), this._task_area_renderers[t] ? this._task_area_renderers[t] : (e || this.assert(!1, "Invalid renderer call"),
            n && n.setAttribute(this.config.layer_attribute, !0), this._task_area_renderers[t] = {
                render_item: function(t, i) {
                    if (i = i || n, a && !a(t)) return void this.remove_item(t.id);
                    var s = e.call(gantt, t);
                    this.append(t, s, i)
                },
                clear: function(e) {
                    this.rendered = gantt._task_area_pulls[t] = {}, this.clear_container(e)
                },
                clear_container: function(t) {
                    t = t || n, t && (t.innerHTML = "")
                },
                render_items: function(t, e) {
                    e = e || n;
                    var a = document.createDocumentFragment();
                    this.clear(e);
                    for (var i = 0, s = t.length; s > i; i++) this.render_item(t[i], a);
                    e.appendChild(a);
                },
                append: function(t, e, n) {
                    e && (this.rendered[t.id] && this.rendered[t.id].parentNode ? this.replace_item(t.id, e) : n.appendChild(e), this.rendered[t.id] = e)
                },
                replace_item: function(t, e) {
                    var n = this.rendered[t];
                    n && n.parentNode && n.parentNode.replaceChild(e, n), this.rendered[t] = e
                },
                remove_item: function(t) {
                    this.hide(t), delete this.rendered[t]
                },
                hide: function(t) {
                    var e = this.rendered[t];
                    e && e.parentNode && e.parentNode.removeChild(e)
                },
                restore: function(t) {
                    var e = this.rendered[t.id];
                    e ? e.parentNode || this.append(t, e, n) : this.render_item(t, n);
                },
                change_id: function(t, e) {
                    this.rendered[e] = this.rendered[t], delete this.rendered[t]
                },
                rendered: this._task_area_pulls[t],
                node: n,
                unload: function() {
                    this.clear(), delete gantt._task_area_renderers[t], delete gantt._task_area_pulls[t]
                }
            }, this._task_area_renderers[t])
    }, gantt._clear_renderers = function() {
        for (var t in this._task_area_renderers) this._task_renderer(t).unload()
    }, gantt._is_layer = function(t) {
        return t && t.hasAttribute && t.hasAttribute(this.config.layer_attribute)
    }, gantt._init_tasks = function() {
        function t(t, e, n, a) {
            for (var i = 0; i < t.length; i++) t[i].change_id(e, n), t[i].render_item(a)
        }
        this._tasks = {
            col_width: this.config.columnWidth,
            width: [],
            full_width: 0,
            trace_x: [],
            rendered: {}
        }, this._click.gantt_task_link = this.bind(function(t, e) {
            var n = this.locate(t, gantt.config.link_attribute);
            n && this.callEvent("onLinkClick", [n, t])
        }, this), this._click.gantt_scale_cell = this.bind(function(t, e) {
            var n = gantt._get_mouse_pos(t),
                a = gantt.dateFromPos(n.x),
                i = Math.floor(gantt._day_index_by_date(a)),
                s = gantt._tasks.trace_x[i];
            gantt.callEvent("onScaleClick", [t, s]);
        }, this), this._dbl_click.gantt_task_link = this.bind(function(t, e, n) {
            var e = this.locate(t, gantt.config.link_attribute);
            this._delete_link_handler(e, t)
        }, this), this._dbl_click.gantt_link_point = this.bind(function(t, e, n) {
            var e = this.locate(t),
                a = this.getTask(e),
                i = null;
            return n.parentNode && gantt._getClassName(n.parentNode) && (i = gantt._getClassName(n.parentNode).indexOf("_left") > -1 ? a.$target[0] : a.$source[0]), i && this._delete_link_handler(i, t), !1
        }, this), this._tasks_dnd.init(), this._init_links_dnd(), this._link_layers.clear();
        var e = this.addLinkLayer({
            renderer: this._render_link_element,
            container: this.$task_links,
            filter: gantt._create_filter([gantt._filter_link, gantt._is_chart_visible].concat(this._get_link_filters()))
        });
        this._linkRenderer = this._link_layers.getRenderer(e), this._task_layers.clear();
        var n = this.addTaskLayer({
            renderer: this._render_task_element,
            container: this.$task_bars,
            filter: gantt._create_filter([gantt._filter_task, gantt._is_chart_visible].concat(this._get_task_filters()))
        });
        this._taskRenderer = this._task_layers.getRenderer(n),
            this.addTaskLayer({
                renderer: this._render_grid_item,
                container: this.$grid_data,
                filter: gantt._create_filter([gantt._filter_task, gantt._is_grid_visible].concat(this._get_task_filters()))
            }), this.addTaskLayer({
                renderer: this._render_bg_line,
                container: this.$task_bg,
                filter: gantt._create_filter([gantt._filter_task, gantt._is_chart_visible, gantt._is_std_background].concat(this._get_task_filters()))
            }), this._onTaskIdChange && this.detachEvent(this._onTaskIdChange), this._onTaskIdChange = this.attachEvent("onTaskIdChange", function(e, n) {
                var a = this._get_task_renderers();
                t(a, e, n, this.getTask(n))
            }), this._onLinkIdChange && this.detachEvent(this._onLinkIdChange), this._onLinkIdChange = this.attachEvent("onLinkIdChange", function(e, n) {
                var a = this._get_link_renderers();
                t(a, e, n, this.getLink(n))
            })
    }, gantt._get_task_filters = function() {
        return []
    }, gantt._get_link_filters = function() {
        return []
    }, gantt._is_chart_visible = function() {
        return !!this.config.show_chart
    }, gantt._filter_task = function(t, e) {
        var n = null,
            a = null;
        return this.config.start_date && this.config.end_date && (n = this.config.start_date.valueOf(),
            a = this.config.end_date.valueOf(), +e.start_date > a || +e.end_date < +n) ? !1 : !0
    }, gantt._filter_link = function(t, e) {
        return this.config.show_links ? !gantt.isTaskVisible(e.source) || !gantt.isTaskVisible(e.target) || gantt._isAllowedUnscheduledTask(gantt.getTask(e.source)) || gantt._isAllowedUnscheduledTask(gantt.getTask(e.target)) ? !1 : this.callEvent("onBeforeLinkDisplay", [t, e]) : !1
    }, gantt._is_std_background = function() {
        return !this.config.static_background
    }, gantt._delete_link_handler = function(t, e) {
        if (t && this.callEvent("onLinkDblClick", [t, e])) {
            var n = gantt.getLink(t);
            if (gantt._is_readonly(n)) return;
            var a = "",
                i = gantt.locale.labels.link + " " + this.templates.link_description(this.getLink(t)) + " " + gantt.locale.labels.confirm_link_deleting;
            window.setTimeout(function() {
                gantt._dhtmlx_confirm(i, a, function() {
                    gantt.deleteLink(t)
                })
            }, gantt.config.touch ? 300 : 1)
        }
    }, gantt.getTaskNode = function(t) {
        return this._taskRenderer.rendered[t]
    }, gantt.getLinkNode = function(t) {
        return this._linkRenderer.rendered[t]
    }, gantt._get_tasks_data = function() {
        for (var t = [], e = this._get_data_range(), n = 0; n < e.length; n++) {
            var a = this._pull[e[n]];
            a.$index = n, this.resetProjectDates(a), t.push(a)
        }
        return t
    }, gantt._get_data_range = function() {
        return this._order
    }, gantt._get_links_data = function() {
        return this._links.slice()
    }, gantt._render_data = function() {
        if (this.callEvent("onBeforeDataRender", []), this._is_render_active()) {
            this._order_synced ? this._order_synced = !1 : this._sync_order(), this._update_layout_sizes(), this._scroll_resize();
            for (var t = this._get_tasks_data(), e = this._get_task_renderers(), n = 0; n < e.length; n++) e[n].render_items(t);
            var a = gantt._get_links_data();
            e = this._get_link_renderers();
            for (var n = 0; n < e.length; n++) e[n].render_items(a);
            this.callEvent("onDataRender", [])
        }
    }, gantt._update_layout_sizes = function() {
        var t = this._tasks;
        t.bar_height = this._get_task_height(), 
        this.$task_data.style.height = Math.max(this.$task.offsetHeight - this.config.scale_height, 0) + "px",
         gantt.config.smart_rendering ? this.$task_bg.style.height = gantt.config.row_height * this.getVisibleTaskCount() + "px" : this.$task_bg.style.height = "", this.$task_bg.style.backgroundImage = "";
        for (var e = this.$task_data.childNodes, n = 0, a = e.length; a > n; n++) {
            var i = e[n];
            this._is_layer(i) && i.style && (i.style.width = t.full_width + "px")
        }
        if (this._is_grid_visible()) {
            for (var s = this.getGridColumns(), r = 0, n = 0; n < s.length; n++) r += s[n].width;
            this.$grid_data.style.width = Math.max(r - 1, 0) + "px"
        }
    }, gantt._scale_range_unit = function() {
        var t = this.config.scale_unit;
        if (this.config.scale_offset_minimal) {
            var e = this._get_scales();
            t = e[e.length - 1].unit
        }
        return t
    }, gantt._init_tasks_range = function() {
        var t = this._scale_range_unit();
        if (this.config.start_date && this.config.end_date) {
            this._min_date = this.date[t + "_start"](new Date(this.config.start_date));
            var e = new Date(this.config.end_date),
                n = this.date[t + "_start"](new Date(e));
            return e = +e != +n ? this.date.add(n, 1, t) : n, void(this._max_date = e)
        }
        this._get_tasks_data();
        var a = this.getSubtaskDates();
        this._min_date = a.start_date, this._max_date = a.end_date, this._max_date && this._max_date || (this._min_date = new Date, this._max_date = new Date(this._min_date)), this._min_date = this.date[t + "_start"](this._min_date),
            this._min_date = this.calculateEndDate(this.date[t + "_start"](this._min_date), -1, t), this._max_date = this.date[t + "_start"](this._max_date), this._max_date = this.calculateEndDate(this._max_date, 2, t)
    }, gantt._prepare_scale_html = function(t) {

        var e = [],
            n = null,
            a = null,
            i = null;
        (t.template || t.date) && (a = t.template || this.date.date_to_str(t.date)), i = t.css || function() {}, !t.css && this.config.inherit_scale_class && (i = gantt.templates.scale_cell_class);
        for (var s = 0; s < t.count; s++) {
            n = new Date(t.trace_x[s]);
            var r = a.call(this, n),
                o = t.width[s],
                _ = "",
                d = "",
                l = "";

                
            if (o) {
                _ = "width:" + o + "px;", l = "gantt_scale_cell" + (s == t.count - 1 ? " gantt_last_cell" : ""), d = i.call(this, n), d && (l += " " + d);
                var g = "<div class='" + l + "' style='" + _ + "'>" + r + "</div>";
                e.push(g)
            }
        }
        return e.join("")
    }, gantt._get_scales = function() {
        var t = this._scale_helpers,
            e = [t.primaryScale()].concat(this.config.subscales);
        return t.sortScales(e), e
    }, gantt._render_tasks_scales = function() {
       
        this._init_tasks_range(), this._scroll_resize(), this._set_sizes();
        var t = "",
            e = 0,
            n = 0,
            a = 0;
        if (this._is_chart_visible()) {
            var i = this._scale_helpers,
                s = this._get_scales();
            a = this.config.scale_height - 1;
            for (var r = this._get_resize_options(), o = r.x ? Math.max(this.config.autosize_min_width, 0) : this.$task.offsetWidth, _ = i.prepareConfigs(s, this.config.min_column_width, o, a), d = this._tasks = _[_.length - 1], l = [], g = this.templates.scale_row_class, h = 0; h < _.length; h++) {
                var c = "gantt_scale_line",
                    u = g(_[h]);
                u && (c += " " + u), l.push('<div class="' + c + '" style="height:' + _[h].height + "px;line-height:" + _[h].height + 'px">' + this._prepare_scale_html(_[h]) + "</div>")
            }
            t = l.join(""), e = d.full_width + this.$scroll_ver.offsetWidth + "px",
                n = d.full_width + "px", a += "px"
        }
        this._is_chart_visible() ? this.$task.style.display = "" : this.$task.style.display = "none", this.$task_scale.style.height = a, this.$task_data.style.width = this.$task_scale.style.width = e, this.$task_scale.innerHTML = t
    }, gantt._render_bg_line = function(t) {
        var e = gantt._tasks,
            n = e.count,
            a = document.createElement("div");
        if (gantt.config.show_task_cells)
            for (var i = 0; n > i; i++) {
                var s = e.width[i],
                    r = "";
                if (s > 0) {
                    var o = document.createElement("div");
                    o.style.width = s + "px", r = "gantt_task_cell" + (i == n - 1 ? " gantt_last_cell" : ""),
                        d = this.templates.task_cell_class(t, e.trace_x[i]), d && (r += " " + d), o.className = r, a.appendChild(o)
                }
            }
        var _ = t.$index % 2 !== 0,
            d = gantt.templates.task_row_class(t.start_date, t.end_date, t),
            l = "gantt_task_row" + (_ ? " odd" : "") + (d ? " " + d : "");
        return this.getState().selected_task == t.id && (l += " gantt_selected"), a.className = l, gantt.config.smart_rendering && (a.style.position = "absolute", a.style.top = this.getTaskTop(t.id) + "px", a.style.width = "100%"), a.style.height = gantt.config.row_height + "px", a.setAttribute(this.config.task_attribute, t.id),
            a
    }, gantt._adjust_scales = function() {
        if (this.config.fit_tasks) {
            var t = +this._min_date,
                e = +this._max_date;
            if (this._init_tasks_range(), +this._min_date != t || +this._max_date != e) return this.render(), this.callEvent("onScaleAdjusted", []), !0
        }
        return !1
    }, gantt.refreshTask = function(t, e) {
        if (this._is_render_active()) {
            var n = this._get_task_renderers(),
                a = this.getTask(t);
            if (a && this.isTaskVisible(t)) {
                for (var i = 0; i < n.length; i++) n[i].render_item(a);
                if (void 0 !== e && !e) return;
                for (var i = 0; i < a.$source.length; i++) gantt.refreshLink(a.$source[i]);
                for (var i = 0; i < a.$target.length; i++) gantt.refreshLink(a.$target[i])
            }
        }
    }, gantt.refreshLink = function(t) {
        if (this._is_render_active())
            if (this.isLinkExists(t)) this._render_link(t);
            else
                for (var e = this._get_link_renderers(), n = 0; n < e.length; n++) e[n].remove_item(t)
    }, gantt._combine_item_class = function(t, e, n) {
        var a = [t];
        e && a.push(e);
        var i = gantt.getState(),
            s = this.getTask(n);
        this._get_safe_type(s.type) == this.config.types.milestone && a.push("gantt_milestone"), this._get_safe_type(s.type) == this.config.types.project && a.push("gantt_project"),
            this._is_flex_task(s) && a.push("gantt_dependent_task"), this.config.select_task && n == i.selected_task && a.push("gantt_selected"), n == i.drag_id && (a.push("gantt_drag_" + i.drag_mode), i.touch_drag && a.push("gantt_touch_" + i.drag_mode));
        var r = gantt._get_link_state();
        if (r.link_source_id == n && a.push("gantt_link_source"), r.link_target_id == n && a.push("gantt_link_target"), this.config.highlight_critical_path && this.isCriticalTask && this.isCriticalTask(s) && a.push("gantt_critical_task"), r.link_landing_area && r.link_target_id && r.link_source_id && r.link_target_id != r.link_source_id) {
            var o = r.link_source_id,
                _ = r.link_source_start,
                d = r.link_target_start,
                l = gantt.isLinkAllowed(o, n, _, d),
                g = "";
            g = l ? d ? "link_start_allow" : "link_finish_allow" : d ? "link_start_deny" : "link_finish_deny", a.push(g)
        }
        return a.join(" ")
    }, gantt._render_pair = function(t, e, n, a) {
        var i = gantt.getState(); + n.end_date <= +i.max_date && t.appendChild(a(e + " task_right")), +n.start_date >= +i.min_date && t.appendChild(a(e + " task_left"))
    }, gantt._get_task_height = function() {
        var t = this.config.task_height;
        return "full" == t && (t = this.config.row_height - 5),
            t = Math.min(t, this.config.row_height), Math.max(t, 0)
    }, gantt._get_milestone_width = function() {
        return this._get_task_height()
    }, gantt._get_visible_milestone_width = function() {
        var t = gantt._get_task_height();
        return Math.sqrt(2 * t * t)
    }, gantt.getTaskPosition = function(t, e, n) {
        var a = this.posFromDate(e || t.start_date),
            i = this.posFromDate(n || t.end_date);
        i = Math.max(a, i);
        var s = this.getTaskTop(t.id),
            r = gantt._get_task_height();
        return {
            left: a,
            top: s,
            height: r,
            width: Math.max(i - a, 0)
        }
    }, gantt._get_task_width = function(t, e, n) {
        return Math.round(this._get_task_pos(t, !1).x - this._get_task_pos(t, !0).x);
    }, gantt._is_readonly = function(t) {
        return t && t[this.config.editable_property] ? !1 : t && t[this.config.readonly_property] || this.config.readonly
    }, gantt._task_default_render = function(t) {
        if (!this._isAllowedUnscheduledTask(t)) {
            var e = this._get_task_pos(t),
                n = this.config,
                a = this._get_task_height(),
                i = Math.floor((this.config.row_height - a) / 2);
            this._get_safe_type(t.type) == n.types.milestone && n.link_line_width > 1 && (i += 1);
            var s = document.createElement("div"),
                r = gantt._get_task_width(t),
                o = this._get_safe_type(t.type);
            s.setAttribute(this.config.task_attribute, t.id),
                n.show_progress && o != this.config.types.milestone && this._render_task_progress(t, s, r);
            var _ = gantt._render_task_content(t, r);
            t.textColor && (_.style.color = t.textColor), s.appendChild(_);
            var d = this._combine_item_class("gantt_task_line", this.templates.task_class(t.start_date, t.end_date, t), t.id);
            (t.color || t.progressColor || t.textColor) && (d += " gantt_task_inline_color"), s.className = d;
            var l = ["left:" + e.x + "px", "top:" + (i + e.y) + "px", "height:" + a + "px", "line-height:" + a + "px", "width:" + r + "px"];
            t.color && l.push("background-color:" + t.color),
                t.textColor && l.push("color:" + t.textColor), s.style.cssText = l.join(";");
            var g = this._render_leftside_content(t);
            return g && s.appendChild(g), g = this._render_rightside_content(t), g && s.appendChild(g), this._is_readonly(t) || (n.drag_resize && !this._is_flex_task(t) && o != this.config.types.milestone && gantt._render_pair(s, "gantt_task_drag", t, function(t) {
                var e = document.createElement("div");
                return e.className = t, e
            }), n.drag_links && this.config.show_links && gantt._render_pair(s, "gantt_link_control", t, function(t) {
                var e = document.createElement("div");
                e.className = t, e.style.cssText = ["height:" + a + "px", "line-height:" + a + "px"].join(";");
                var n = document.createElement("div");
                return n.className = "gantt_link_point", e.appendChild(n), e
            })), s
        }
    }, gantt._render_task_element = function(t) {
        var e = this.config.type_renderers,
            n = e[this._get_safe_type(t.type)],
            a = this._task_default_render;
        return n || (n = a), n.call(this, t, this.bind(a, this))
    }, gantt._render_side_content = function(t, e, n) {
        if (!e) return null;
        var a = e(t.start_date, t.end_date, t);
        if (!a) return null;
        var i = document.createElement("div");
        return i.className = "gantt_side_content " + n, i.innerHTML = a, i
    }, gantt._render_leftside_content = function(t) {
        var e = "gantt_left " + gantt._get_link_crossing_css(!0, t);
        return gantt._render_side_content(t, this.templates.leftside_text, e)
    }, gantt._render_rightside_content = function(t) {
        var e = "gantt_right " + gantt._get_link_crossing_css(!1, t);
        return gantt._render_side_content(t, this.templates.rightside_text, e)
    }, gantt._get_conditions = function(t) {
        return t ? {
            $source: [gantt.config.links.start_to_start],
            $target: [gantt.config.links.start_to_start, gantt.config.links.finish_to_start]
        } : {
            $source: [gantt.config.links.finish_to_start, gantt.config.links.finish_to_finish],
            $target: [gantt.config.links.finish_to_finish]
        }
    }, gantt._get_link_crossing_css = function(t, e) {
        var n = gantt._get_conditions(t);
        for (var a in n)
            for (var i = e[a], s = 0; s < i.length; s++)
                for (var r = gantt.getLink(i[s]), o = 0; o < n[a].length; o++)
                    if (r.type == n[a][o]) return "gantt_link_crossing";
        return ""
    }, gantt._render_task_content = function(t, e) {
        var n = document.createElement("div");
        return this._get_safe_type(t.type) != this.config.types.milestone && (n.innerHTML = this.templates.task_text(t.start_date, t.end_date, t)),
            n.className = "gantt_task_content", n
    }, gantt._render_task_progress = function(t, e, n) {
        var a = 1 * t.progress || 0;
        n = Math.max(n - 2, 0);
        var i = document.createElement("div"),
            s = Math.round(n * a);
        if (s = Math.min(n, s), t.progressColor && (i.style.backgroundColor = t.progressColor, i.style.opacity = 1), i.style.width = s + "px", i.className = "gantt_task_progress", i.innerHTML = this.templates.progress_text(t.start_date, t.end_date, t), e.appendChild(i), this.config.drag_progress && !gantt._is_readonly(t)) {
            var r = document.createElement("div");
            r.style.left = s + "px",
                r.className = "gantt_task_progress_drag", i.appendChild(r), e.appendChild(r)
        }
    }, gantt._get_line = function(t) {
        var e = {
            second: 1,
            minute: 60,
            hour: 3600,
            day: 86400,
            week: 604800,
            month: 2592e3,
            year: 31536e3
        };
        return e[t] || 0
    }, gantt.dateFromPos = function(t) {
        var e = this._tasks;
        if (0 > t || t > e.full_width || !e.full_width) return null;
        var n = this._findBinary(this._tasks.left, t),
            a = this._tasks.left[n],
            i = e.width[n] || e.col_width,
            s = 0;
        i && (s = (t - a) / i);
        var r = 0;
        s && (r = gantt._get_coll_duration(e, e.trace_x[n]));
        var o = new Date(e.trace_x[n].valueOf() + Math.round(s * r));
        return o
    }, gantt.posFromDate = function(t) {
        var e = gantt._day_index_by_date(t);
        this.assert(e >= 0, "Invalid day index");
        var n = Math.floor(e),
            a = e % 1,
            i = gantt._tasks.left[Math.min(n, gantt._tasks.width.length - 1)];
        return n == gantt._tasks.width.length && (i += gantt._tasks.width[gantt._tasks.width.length - 1]), a && (i += n < gantt._tasks.width.length ? gantt._tasks.width[n] * (a % 1) : 1), i
    }, gantt._day_index_by_date = function(t) {
        var e = new Date(t).valueOf(),
            n = gantt._tasks.trace_x,
            a = gantt._tasks.ignore_x;
        if (e <= this._min_date) return 0;
        if (e >= this._max_date) return n.length;
        for (var i = gantt._findBinary(n, e), s = +gantt._tasks.trace_x[i]; a[s];) s = gantt._tasks.trace_x[++i];
        return s ? i + (t - n[i]) / gantt._get_coll_duration(gantt._tasks, n[i]) : 0
    }, gantt._findBinary = function(t, e) {
        for (var n, a, i, s = 0, r = t.length - 1; r >= s;)
            if (n = Math.floor((s + r) / 2), a = +t[n], i = +t[n - 1], e > a) s = n + 1;
            else {
                if (!(a > e)) return n;
                if (!isNaN(i) && e > i) return n - 1;
                r = n - 1
            }
        return t.length - 1
    }, gantt._get_coll_duration = function(t, e) {
      //  t.unit = timeunit
        return gantt.date.add(e, t.step, t.unit) - e
    }, gantt._get_x_pos = function(t, e) {
        e = e !== !1;
        gantt.posFromDate(e ? t.start_date : t.end_date);
    }, gantt.getTaskTop = function(t) {
        return this._y_from_ind(this.getGlobalTaskIndex(t))
    }, gantt._get_task_coord = function(t, e, n) {
        e = e !== !1, n = n || 0;
        var a = this._get_safe_type(t.type) == this.config.types.milestone,
            i = null;
        i = e || a ? t.start_date || this._default_task_date(t) : t.end_date || this.calculateEndDate(this._default_task_date(t));
        var s = this.posFromDate(i),
            r = this.getTaskTop(t.id);
        return a && (e ? s -= n : s += n), {
            x: s,
            y: r
        }
    }, gantt._get_task_pos = function(t, e) {
        e = e !== !1;
        var n = gantt._get_milestone_width() / 2;
        return this._get_task_coord(t, e, n);
    }, gantt._get_task_visible_pos = function(t, e) {
        e = e !== !1;
        var n = gantt._get_visible_milestone_width() / 2;
        return this._get_task_coord(t, e, n)
    }, gantt._correct_shift = function(t, e) {
        return t -= 6e4 * (new Date(gantt._min_date).getTimezoneOffset() - new Date(t).getTimezoneOffset()) * (e ? -1 : 1)
    }, gantt._get_mouse_pos = function(t) {
        if (t.pageX || t.pageY) var e = {
            x: t.pageX,
            y: t.pageY
        };
        var n = gantt.env.isIE ? document.documentElement : document.body,
            e = {
                x: t.clientX + n.scrollLeft - n.clientLeft,
                y: t.clientY + n.scrollTop - n.clientTop
            },
            a = gantt._get_position(gantt.$task_data);
        return e.x = e.x - a.x + gantt.$task_data.scrollLeft, e.y = e.y - a.y + gantt.$task_data.scrollTop, e
    }, gantt._is_layer = function(t) {
        return t && t.hasAttribute && t.hasAttribute(this.config.layer_attribute)
    }, gantt.attachEvent("onGanttReady", function() {
        gantt._task_layers.add(), gantt._link_layers.add()
    }), gantt._layers = {
        prepareConfig: function(t) {
            "function" == typeof t && (t = {
                renderer: t
            });
            t.id = gantt.uid();
            return t.container || (t.container = document.createElement("div")), t
        },
        create: function(t, e) {
            return {
                tempCollection: [],
                renderers: {},
                container: t,
                getRenderers: function() {
                    var t = [];
                    for (var e in this.renderers) t.push(this.renderers[e]);
                    return t
                },
                getRenderer: function(t) {
                    return this.renderers[t]
                },
                add: function(t) {
                    if (t && this.tempCollection.push(t), this.container())
                        for (var n = this.container(), a = this.tempCollection, i = 0; i < a.length; i++) {
                            var t = a[i],
                                s = t.container,
                                r = t.id,
                                o = t.topmost;
                            if (!s.parentNode)
                                if (o) n.appendChild(s);
                                else {
                                    var _ = e ? e() : n.firstChild;
                                    _ ? n.insertBefore(s, _) : n.appendChild(s)
                                }
                            this.renderers[r] = gantt._task_renderer(r, t.renderer, s, t.filter),
                                this.tempCollection.splice(i, 1), i--
                        }
                },
                remove: function(t) {
                    this.renderers[t].unload(), delete this.renderers[t]
                },
                clear: function() {
                    for (var t in this.renderers) this.renderers[t].unload();
                    this.renderers = {}
                }
            }
        }
    }, gantt._create_filter = function(t) {
        return t instanceof Array || (t = Array.prototype.slice.call(arguments, 0)),
            function(e) {
                for (var n = !0, a = 0, i = t.length; i > a; a++) {
                    var s = t[a];
                    s && (n = n && s.apply(gantt, [e.id, e]) !== !1)
                }
                return n
            }
    }, gantt._add_generic_layer = function(t, e) {
        return function(n) {
            return void 0 === n.filter && (n.filter = gantt._create_filter(e)),
                n = gantt._layers.prepareConfig(n), t.add(n), n.id
        }
    }, gantt._task_layers = gantt._layers.create(function() {
        return gantt.$task_data
    }, function() {
        return gantt.$task_links
    }), gantt._link_layers = gantt._layers.create(function() {
        return gantt.$task_data
    }), gantt.addTaskLayer = gantt._add_generic_layer(gantt._task_layers, [gantt._filter_task, gantt._is_chart_visible].concat(gantt._get_task_filters())), gantt.removeTaskLayer = function(t) {
        gantt._task_layers.remove(t)
    }, gantt.addLinkLayer = gantt._add_generic_layer(gantt._link_layers, [gantt._filter_link, gantt._is_chart_visible].concat(gantt._get_link_filters())),
    gantt.removeLinkLayer = function(t) {
        gantt._link_layers.remove(t)
    }, gantt._get_task_renderers = function() {
        return this._task_layers.getRenderers()
    }, gantt._get_link_renderers = function() {
        return this._link_layers.getRenderers()
    }, gantt._pull = {}, gantt._branches = {}, gantt._order = [], gantt._lpull = {}, gantt._links = [], gantt._order_full = [], gantt.load = function(t, e, n) {
        this._load_url = t, this.assert(arguments.length, "Invalid load arguments"), this.callEvent("onLoadStart", []);
        var a = "json",
            i = null;
        arguments.length >= 3 ? (a = e, i = n) : "string" == typeof arguments[1] ? a = arguments[1] : "function" == typeof arguments[1] && (i = arguments[1]),
            this._load_type = a, this.ajax.get(t, gantt.bind(function(t) {
                this.on_load(t, a), this.callEvent("onLoadEnd", []), "function" == typeof i && i.call(this)
            }, this))
    }, gantt.parse = function(t, e) {
        this.on_load({
            xmlDoc: {
                responseText: t
            }
        }, e)
    }, gantt.serialize = function(t) {
        return t = t || "json", this[t].serialize()
    }, gantt.on_load = function(t, e) {
        this.callEvent("onBeforeParse", []), e || (e = "json"), this.assert(this[e], "Invalid data type:'" + e + "'");
        var n = t.xmlDoc.responseText,
            a = this[e].parse(n, t);
        this._process_loading(a)
    }, gantt._load_task = function(t) {
        return this._init_task(t), this.callEvent("onTaskLoading", [t]) ? (this._pull[t.id] = t, !0) : !1
    }, gantt._build_pull = function(t) {
        for (var e = null, n = [], a = 0, i = t.length; i > a; a++) e = t[a], this._load_task(e) && n.push(e);
        return n
    }, gantt._build_hierarchy = function(t) {
        for (var e = null, n = 0, a = t.length; a > n; n++) e = t[n], this.setParent(e, this.getParent(e) || this.config.root_id);
        for (var n = 0, a = t.length; a > n; n++) e = t[n], this._add_branch(e), e.$level = this.calculateTaskLevel(e)
    }, gantt._process_loading = function(t) {
        t.collections && this._load_collections(t.collections);
        var e = this._build_pull(t.data);
        if (this._build_hierarchy(e), this._sync_order(), this._order_synced = !0, this._init_links(t.links || (t.collections ? t.collections.links : [])), this.callEvent("onParse", []), this.render(), this.config.initial_scroll) {
            var n = this._order[0] || this.config.root_id;
            n && this.showTask(n)
        }
    }, gantt._init_links = function(t) {
        if (t)
            for (var e = 0; e < t.length; e++)
                if (t[e]) {
                    var n = this._init_link(t[e]);
                    this._lpull[n.id] = n
                }
        this._sync_links()
    }, gantt._load_collections = function(t) {
        var e = !1;
        for (var n in t)
            if (t.hasOwnProperty(n)) {
                e = !0;
                var a = t[n],
                    i = this.serverList[n];
                if (!i) continue;
                i.splice(0, i.length);
                for (var s = 0; s < a.length; s++) {
                    var r = a[s],
                        o = this.copy(r);
                    o.key = o.value;
                    for (var _ in r)
                        if (r.hasOwnProperty(_)) {
                            if ("value" == _ || "label" == _) continue;
                            o[_] = r[_]
                        }
                    i.push(o)
                }
            }
        e && this.callEvent("onOptionsLoad", [])
    }, gantt._sync_order = function(t) {
        this._order = [], this._order_full = [], this._order_search = {}, this._sync_order_item({
            parent: this.config.root_id,
            $open: !0,
            $ignore: !0,
            id: this.config.root_id
        }), t || (this._scroll_resize(), this._set_sizes());
    }, gantt.attachEvent("onBeforeTaskDisplay", function(t, e) {
        return !e.$ignore
    }), gantt._sync_order_item = function(t, e) {
        t.id && (this._order_full.push(t.id), !e && this._filter_task(t.id, t) && this.callEvent("onBeforeTaskDisplay", [t.id, t]) && (this._order.push(t.id), this._order_search[t.id] = this._order.length - 1));
        var n = this.getChildren(t.id);
        if (n)
            for (var a = 0; a < n.length; a++) this._sync_order_item(this._pull[n[a]], e || !t.$open)
    }, gantt.getTaskCount = function() {
        return this._order_full.length
    }, gantt.getLinkCount = function() {
        return this._links.length
    }, gantt.getVisibleTaskCount = function() {
        return this._order.length
    }, gantt.getTaskIndex = function(t) {
        for (var e = this.getChildren(this.getParent(t)), n = 0; n < e.length; n++)
            if (e[n] == t) return n;
        return -1
    }, gantt.getGlobalTaskIndex = function(t) {
        this.assert(t, "Invalid argument");
        var e = this._order_search[t];
        return void 0 !== e ? e : -1
    }, gantt._get_visible_order = gantt.getGlobalTaskIndex, gantt.eachTask = function(t, e, n) {
        e = e || this.config.root_id, n = n || this;
        var a = this.getChildren(e);
        if (a)
            for (var i = 0; i < a.length; i++) {
                var s = this._pull[a[i]];
                t.call(n, s), this.hasChild(s.id) && this.eachTask(t, s.id, n)
            }
    }, gantt.json = {
        parse: function(t) {
            return gantt.assert(t, "Invalid data"), "string" == typeof t && (window.JSON ? t = JSON.parse(t) : gantt.assert(!1, "JSON is not supported")), t.dhx_security && (gantt.security_key = t.dhx_security), t
        },
        _copyLink: function(t) {
            var e = {};
            for (var n in t) e[n] = t[n];
            return e
        },
        _copyObject: function(t) {
            var e = {};
            for (var n in t) "$" != n.charAt(0) && (e[n] = t[n], e[n] instanceof Date && (e[n] = gantt.templates.xml_format(e[n])));
            return e;
        },
        serialize: function() {
            var t = [],
                e = [];
            return gantt.eachTask(function(e) {
                gantt.resetProjectDates(e), t.push(this._copyObject(e))
            }, gantt.config.root_id, this), e = gantt._links.slice(), {
                data: t,
                links: e
            }
        }
    }, gantt.xml = {
        _xmlNodeToJSON: function(t, e) {
            for (var n = {}, a = 0; a < t.attributes.length; a++) n[t.attributes[a].name] = t.attributes[a].value;
            if (!e) {
                for (var a = 0; a < t.childNodes.length; a++) {
                    var i = t.childNodes[a];
                    1 == i.nodeType && (n[i.tagName] = i.firstChild ? i.firstChild.nodeValue : "")
                }
                n.text || (n.text = t.firstChild ? t.firstChild.nodeValue : "");
            }
            return n
        },
        _getCollections: function(t) {
            for (var e = {}, n = gantt.ajax.xpath("//coll_options", t), a = 0; a < n.length; a++)
                for (var i = n[a].getAttribute("for"), s = e[i] = [], r = gantt.ajax.xpath(".//item", n[a]), o = 0; o < r.length; o++) {
                    for (var _ = r[o], d = _.attributes, l = {
                            key: r[o].getAttribute("value"),
                            label: r[o].getAttribute("label")
                        }, g = 0; g < d.length; g++) {
                        var h = d[g];
                        "value" != h.nodeName && "label" != h.nodeName && (l[h.nodeName] = h.nodeValue)
                    }
                    s.push(l)
                }
            return e
        },
        _getXML: function(t, e, n) {

            n = n || "data", e.getXMLTopNode || (e = gantt.ajax.parse(e));
            var a = gantt.ajax.xmltop(n, e.xmlDoc);
            if (a.tagName != n) throw "Invalid XML data";
            var i = a.getAttribute("dhx_security");
            return i && (gantt.security_key = i), a
        },
        parse: function(t, e) {
            e = this._getXML(t, e);
            for (var n = {}, a = n.data = [], i = gantt.ajax.xpath("//task", e), s = 0; s < i.length; s++) a[s] = this._xmlNodeToJSON(i[s]);
            return n.collections = this._getCollections(e), n
        },
        _copyLink: function(t) {
            return "<item id='" + t.id + "' source='" + t.source + "' target='" + t.target + "' type='" + t.type + "' />"
        },
        _copyObject: function(t) {
            return "<task id='" + t.id + "' parent='" + (t.parent || "") + "' start_date='" + t.start_date + "' duration='" + t.duration + "' open='" + !!t.open + "' progress='" + t.progress + "' end_date='" + t.end_date + "'><![CDATA[" + t.text + "]]></task>";
        },
        serialize: function() {
            for (var t = [], e = [], n = gantt.json.serialize(), a = 0, i = n.data.length; i > a; a++) t.push(this._copyObject(n.data[a]));
            for (var a = 0, i = n.links.length; i > a; a++) e.push(this._copyLink(n.links[a]));
            return "<data>" + t.join("") + "<coll_options for='links'>" + e.join("") + "</coll_options></data>"
        }
    }, gantt.oldxml = {
        parse: function(t, e) {
            e = gantt.xml._getXML(t, e, "projects");
            for (var n = {
                    collections: {
                        links: []
                    }
                }, a = n.data = [], i = gantt.ajax.xpath("//task", e), s = 0; s < i.length; s++) {
                a[s] = gantt.xml._xmlNodeToJSON(i[s]);
                var r = i[s].parentNode;
                "project" == r.tagName ? a[s].parent = "project-" + r.getAttribute("id") : a[s].parent = r.parentNode.getAttribute("id")
            }
            i = gantt.ajax.xpath("//project", e);
            for (var s = 0; s < i.length; s++) {
                var o = gantt.xml._xmlNodeToJSON(i[s], !0);
                o.id = "project-" + o.id, a.push(o)
            }
            for (var s = 0; s < a.length; s++) {
                var o = a[s];
                o.start_date = o.startdate || o.est, o.end_date = o.enddate, o.text = o.name, o.duration = o.duration / 8, o.open = 1, o.duration || o.end_date || (o.duration = 1), o.predecessortasks && n.collections.links.push({
                    target: o.id,
                    source: o.predecessortasks,
                    type: gantt.config.links.finish_to_start
                })
            }
            return n
        },
        serialize: function() {
            gantt.message("Serialization to 'old XML' is not implemented")
        }
    }, gantt.serverList = function(t, e) {
        return e ? this.serverList[t] = e.slice(0) : this.serverList[t] || (this.serverList[t] = []), this.serverList[t]
    }, gantt._working_time_helper = {
        units: ["year", "month", "week", "day", "hour", "minute"],
        hours: [8, 17],
        dates: {
            0: !1,
            6: !1
        },
        _working_units_cache: {
            _cache: {},
            get: function(t, e) {
                var n = -1,
                    a = this._cache;
                if (a && a[t]) {
                    var i = a[t],
                        s = e.getTime();
                    void 0 !== i[s] && (n = i[s]);
                }
                return n
            },
            put: function(t, e, n) {
                if (!t || !e) return !1;
                var a = this._cache,
                    i = e.getTime();
                return n = !!n, a ? (a[t] || (a[t] = {}), a[t][i] = n, !0) : !1
            },
            clear: function() {
                this._cache = {}
            }
        },
        _get_unit_order: function(t) {
            for (var e = 0, n = this.units.length; n > e; e++)
                if (this.units[e] == t) return e;
            gantt.assert(!1, "Incorrect duration unit")
        },
        _timestamp: function(t) {
            var e = null;
            return t.day || 0 === t.day ? e = t.day : t.date && (e = gantt.date.date_part(new Date(t.date)).valueOf()), e
        },
        set_time: function(t) {
            var e = void 0 !== t.hours ? t.hours : !0,
                n = this._timestamp(t);
            null !== n ? this.dates[n] = e : this.hours = e, this._working_units_cache.clear()
        },
        unset_time: function(t) {
            if (t) {
                var e = this._timestamp(t);
                null !== e && delete this.dates[e]
            } else this.hours = [];
            this._working_units_cache.clear()
        },
        is_working_unit: function(t, e, n) {
            if (!gantt.config.work_time) return !0;
            var a = this._working_units_cache.get(e, t);
            return -1 == a && (a = this._check_is_working_unit(t, e, n), this._working_units_cache.put(e, t, a)), a
        },
        _check_is_working_unit: function(t, e, n) {
            return void 0 === n && (n = this._get_unit_order(e)), void 0 === n ? !1 : n && !this.is_working_unit(t, this.units[n - 1], n - 1) ? !1 : this["is_work_" + e] ? this["is_work_" + e](t) : !0;
        },
        is_work_day: function(t) {
            var e = this.get_working_hours(t);
            return e instanceof Array ? e.length > 0 : !1
        },
        is_work_hour: function(t) {
            for (var e = this.get_working_hours(t), n = t.getHours(), a = 0; a < e.length; a += 2) {
                if (void 0 === e[a + 1]) return e[a] == n;
                if (n >= e[a] && n < e[a + 1]) return !0
            }
            return !1
        },
        get_working_hours: function(t) {
            var e = this._timestamp({
                    date: t
                }),
                n = !0;
            return void 0 !== this.dates[e] ? n = this.dates[e] : void 0 !== this.dates[t.getDay()] && (n = this.dates[t.getDay()]), n === !0 ? this.hours : n ? n : []
        },
        intern_dates_pull: {},
        next_date: function(t, e, n) {
            var a = +t,
                i = e + "_" + n,
                s = this.intern_dates_pull[i];
            return s || (s = this.intern_dates_pull[i] = {}), s[a] || (s[a] = gantt.date.add(t, n, e)), s[a]
        },
        get_work_units_between: function(t, e, n, a) {
            if (!n) return !1;
            for (var i = new Date(t), s = new Date(e), a = a || 1, r = 0; i.valueOf() < s.valueOf();) this.is_working_unit(i, n) && r++, i = this.next_date(i, n, a);
            return r
        },
        is_work_units_between: function(t, e, n, a) {
            if (!n) return !1;
            for (var i = new Date(t), s = new Date(e), a = a || 1; i.valueOf() < s.valueOf();) {
                if (this.is_working_unit(i, n)) return !0;
                i = this.next_date(i, n, a);
            }
            return !1
        },
        add_worktime: function(t, e, n, a) {
            if (!n) return !1;
            var i = new Date(t),
                s = 0,
                a = a || 1,
                e = 1 * e;
            if (gantt.config.work_time) {
                for (; e > s;) {
                    var r = this.next_date(i, n, a);
                    this.is_working_unit(a > 0 ? new Date(r.valueOf() - 1) : new Date(r.valueOf() + 1), n) && s++, i = r
                }
                return i
            }
            return gantt.date.add(i, a * e, n)
        },
        get_closest_worktime: function(t) {
            
            if (this.is_working_unit(t.date, t.unit)) return t.date;
            var e = t.unit,
                n = gantt.date[e + "_start"](t.date),
                a = new Date(n),
                i = new Date(n),
                s = !0,
                r = 3e3,
                o = 0,
                _ = "any" == t.dir || !t.dir,
                d = 1;
            for ("past" == t.dir && (d = -1); !this.is_working_unit(n, e);) {
                _ && (n = s ? a : i, d = -1 * d);
                var l = n.getTimezoneOffset();
                if (n = gantt.date.add(n, d, e), n = gantt._correct_dst_change(n, l, d, e), gantt.date[e + "_start"] && (n = gantt.date[e + "_start"](n)), _ && (s ? a = n : i = n), s = !s, o++, o > r) return gantt.assert(!1, "Invalid working time check"), !1
            }
            return (n == i || "past" == t.dir) && (n = gantt.date.add(n, 1, e)), n
        }
    }, gantt.getTask = function(t) {
        gantt.assert(t, "Invalid argument for gantt.getTask");
        var e = this._pull[t];
        return gantt.assert(e, "Task not found id=" + t), e
    }, gantt.getTaskByTime = function(t, e) {
        var n = this._pull,
            a = [];
        if (t || e) {
            t = +t || -(1 / 0), e = +e || 1 / 0;
            for (var i in n) {
                var s = n[i]; + s.start_date < e && +s.end_date > t && a.push(s)
            }
        } else
            for (var i in n) a.push(n[i]);
        return a
    }, gantt.isTaskExists = function(t) {
        return gantt.defined(this._pull[t])
    }, gantt.isUnscheduledTask = function(t) {
        return !!t.unscheduled || !t.start_date
    }, gantt._isAllowedUnscheduledTask = function(t) {
        return t.unscheduled && gantt.config.show_unscheduled
    }, gantt.isTaskVisible = function(t) {
        if (!this._pull[t]) return !1;
        var e = this._pull[t];
        return (+e.start_date < +this._max_date && +e.end_date > +this._min_date || gantt._isAllowedUnscheduledTask(e)) && void 0 !== this._order_search[t] ? !0 : !1;
    }, gantt.updateTask = function(t, e) {
        return gantt.defined(e) || (e = this.getTask(t)), this.callEvent("onBeforeTaskUpdate", [t, e]) === !1 ? !1 : (this._pull[e.id] = e, this._is_parent_sync(e) || this._resync_parent(e), this._isAllowedUnscheduledTask(e) && (this._init_task(e), this._sync_links()), this._update_parents(e.id), this.refreshTask(e.id), this.callEvent("onAfterTaskUpdate", [t, e]), this._sync_order(), void this._adjust_scales())
    }, gantt._add_branch = function(t, e) {
        var n = this.getParent(t);
        this.hasChild(n) || (this._branches[n] = []);
        for (var a = this.getChildren(n), i = !1, s = 0, r = a.length; r > s; s++)
            if (a[s] == t.id) {
                i = !0;
                break
            }
        i || (1 * e == e ? a.splice(e, 0, t.id) : a.push(t.id)), this._sync_parent(t)
    }, gantt._move_branch = function(t, e, n) {
        this.setParent(t, n), this._sync_parent(t), this._replace_branch_child(e, t.id), this.isTaskExists(n) || n == this.config.root_id ? this._add_branch(t) : delete this._branches[t.id], t.$level = this.calculateTaskLevel(t), this._sync_order()
    }, gantt._resync_parent = function(t) {
        this._move_branch(t, t.$rendered_parent, this.getParent(t))
    },
    gantt._sync_parent = function(t) {
        t.$rendered_parent = this.getParent(t)
    }, gantt._is_parent_sync = function(t) {
        return t.$rendered_parent == this.getParent(t)
    }, gantt._replace_branch_child = function(t, e, n) {
        var a = this.getChildren(t);
        if (a) {
            for (var i = [], s = 0; s < a.length; s++) a[s] != e ? i.push(a[s]) : n && i.push(n);
            this._branches[t] = i
        }
        this._sync_order()
    }, gantt.addTask = function(t, e, n) {
        return gantt.defined(e) || (e = this.getParent(t) || 0), this.isTaskExists(e) || (e = 0), this.setParent(t, e), t = this._init_task(t), this.callEvent("onBeforeTaskAdd", [t.id, t]) === !1 ? !1 : (this._pull[t.id] = t,
            this._add_branch(t, n), this.callEvent("onAfterTaskAdd", [t.id, t]), this.refreshData(), this._adjust_scales(), t.id)
    }, gantt._default_task_date = function(t, e) {
        var n = e && e != this.config.root_id ? this.getTask(e) : !1,
            a = "";
        if (n) a = n.start_date;
        else {
            var i = this._order[0];
            a = i ? this.getTask(i).start_date ? this.getTask(i).start_date : this.getTask(i).end_date ? this.calculateEndDate(this.getTask(i).end_date, -this.config.duration_step) : "" : this.config.start_date || this.getState().min_date
        }
        return gantt.assert(a, "Invalid dates"),
            new Date(a)
    }, gantt._set_default_task_timing = function(t) {
        t.start_date = t.start_date || gantt._default_task_date(t, this.getParent(t)), t.duration = t.duration || this.config.duration_step, t.end_date = t.end_date || this.calculateEndDate(t.start_date, t.duration)
    }, gantt.createTask = function(t, e, n) {
        if (t = t || {}, t.id = gantt.uid(), t.start_date || (t.start_date = gantt._default_task_date(t, e)), void 0 === t.text && (t.text = gantt.locale.labels.new_task), void 0 === t.duration && (t.duration = 1), e) {
            this.setParent(t, e);
            var a = this.getTask(e);
            a.$open = !0
        }
        return this.callEvent("onTaskCreated", [t]) ? (this.config.details_on_create ? (t.$new = !0, this._pull[t.id] = this._init_task(t), this._add_branch(t, n), t.$level = this.calculateTaskLevel(t), this.selectTask(t.id), this.refreshData(), this.showLightbox(t.id)) : this.addTask(t, e, n) && (this.showTask(t.id), this.selectTask(t.id)), t.id) : null
    }, gantt.deleteTask = function(t) {
        return this._deleteTask(t)
    }, gantt._getChildLinks = function(t) {
        var e = this.getTask(t);
        if (!e) return [];
        for (var n = e.$source.concat(e.$target), a = this.getChildren(e.id), i = 0; i < a.length; i++) n = n.concat(this._getChildLinks(a[i]));
        for (var s = {}, i = 0; i < n.length; i++) s[n[i]] = !0;
        n = [];
        for (var i in s) n.push(i);
        return n
    }, gantt._getTaskTree = function(t) {
        var e = this.getTask(t);
        if (!e) return [];
        for (var n = [], a = this.getChildren(e.id), i = 0; i < a.length; i++) n.push(a[i]), n = n.concat(this._getTaskTree(a[i]));
        return n
    }, gantt._deleteRelatedLinks = function(t, e) {
        var n = this._dp && !e,
            a = "",
            i = n ? "off" != this._dp.updateMode : !1;
        n && (a = this._dp.updateMode, this._dp.setUpdateMode("off"));
        for (var s = 0; s < t.length; s++) n && (this._dp.setGanttMode("links"), this._dp.setUpdated(t[s], !0, "deleted")),
            this._deleteLink(t[s], !0);
        n && (this._dp.setUpdateMode(a), i && this._dp.sendAllData())
    }, gantt._deleteRelatedTasks = function(t, e) {
        var n = this._dp && !e,
            a = "";
        n && (a = this._dp.updateMode, this._dp.setGanttMode("tasks"), this._dp.setUpdateMode("off"));
        for (var i = this._getTaskTree(t), s = 0; s < i.length; s++) {
            var r = i[s];
            this._unset_task(r), n && this._dp.setUpdated(r, !0, "deleted")
        }
        n && this._dp.setUpdateMode(a)
    }, gantt._unset_task = function(t) {
        var e = this.getTask(t);
        this._update_flags(t, null), delete this._pull[t], this._move_branch(e, this.getParent(e), null);
    }, gantt._deleteTask = function(t, e) {
        var n = this.getTask(t);
        if (!e && this.callEvent("onBeforeTaskDelete", [t, n]) === !1) return !1;
        var a = gantt._getChildLinks(t);
        return this._deleteRelatedTasks(t, e), this._deleteRelatedLinks(a, e), this._unset_task(t), e || (this.callEvent("onAfterTaskDelete", [t, n]), this.refreshData()), !0
    }, gantt.clearAll = function() {
        this._clear_data(), this.callEvent("onClear", []), this.refreshData()
    }, gantt._clear_data = function() {
        this._pull = {}, this._branches = {}, this._order = [], this._order_full = [], this._lpull = {},
            this._links = [], this._update_flags(), this.userdata = {}
    }, gantt._update_flags = function(t, e) {
        void 0 === t ? (this._lightbox_id = this._selected_task = null, this._tasks_dnd.drag && (this._tasks_dnd.drag.id = null)) : (this._lightbox_id == t && (this._lightbox_id = e), this._selected_task == t && (this._selected_task = e), this._tasks_dnd.drag && this._tasks_dnd.drag.id == t && (this._tasks_dnd.drag.id = e))
    }, gantt.changeTaskId = function(t, e) {
        var n = this._pull[e] = this._pull[t];
        this._pull[e].id = e, delete this._pull[t], this._update_flags(t, e),
            this._replace_branch_child(this.getParent(n), t, e);
        for (var a in this._pull) {
            var i = this._pull[a];
            this.getParent(i) == t && (this.setParent(i, e), this._resync_parent(i))
        }
        for (var s = this._get_task_links(n), r = 0; r < s.length; r++) {
            var o = this.getLink(s[r]);
            o.source == t && (o.source = e), o.target == t && (o.target = e)
        }
        this.callEvent("onTaskIdChange", [t, e])
    }, gantt._get_task_links = function(t) {
        var e = [];
        return t.$source && (e = e.concat(t.$source)), t.$target && (e = e.concat(t.$target)), e
    }, gantt._get_duration_unit = function() {
        return 1e3 * gantt._get_line(this.config.duration_unit) || this.config.duration_unit;
    }, gantt._get_safe_type = function(t) {
        return "task"
    }, gantt._get_type_name = function(t) {
        for (var e in this.config.types)
            if (this.config.types[e] == t) return e;
        return "task"
    }, gantt.getWorkHours = function(t) {
        return this._working_time_helper.get_working_hours(t)
    }, gantt.setWorkTime = function(t) {
        this._working_time_helper.set_time(t)
    }, gantt.isWorkTime = function(t, e) {
        var n = this._working_time_helper;
        return n.is_working_unit(t, e || this.config.duration_unit)
    }, gantt.correctTaskWorkTime = function(t) {
        gantt.config.work_time && gantt.config.correct_work_time && (gantt.isWorkTime(t.start_date) ? gantt.isWorkTime(new Date(+t.end_date - 1)) || (t.end_date = gantt.calculateEndDate(t.start_date, t.duration)) : (t.start_date = gantt.getClosestWorkTime({
            date: t.start_date,
            dir: "future"
        }), t.end_date = gantt.calculateEndDate(t.start_date, t.duration)))
    }, gantt.getClosestWorkTime = function(t) {
        
        var e = this._working_time_helper;
        return t instanceof Date && (t = {
            date: t
        }), t.dir = t.dir || "any", t.unit = t.unit || this.config.duration_unit, e.get_closest_worktime(t)
    }, gantt.calculateDuration = function(t, e) {
        //t.unit = timeunit
        var n = this._working_time_helper;
        return n.get_work_units_between(t, e, this.config.duration_unit, this.config.duration_step)
    }, gantt._hasDuration = function(t, e) {
        var n = this._working_time_helper;
        return n.is_work_units_between(t, e, this.config.duration_unit, this.config.duration_step)
    }, gantt.calculateEndDate = function(t, e, n) {
        var a = this._working_time_helper,
            i = e >= 0 ? 1 : -1;
        return a.add_worktime(t, Math.abs(e), n || this.config.duration_unit, i * this.config.duration_step)
    }, gantt._init_task = function(t) {
        return gantt.defined(t.id) || (t.id = gantt.uid()), t.start_date && (t.start_date = gantt.date.parseDate(t.start_date, "xml_date")), t.end_date && (t.end_date = gantt.date.parseDate(t.end_date, "xml_date")), t.start_date ? !t.end_date && t.duration && (t.end_date = this.calculateEndDate(t.start_date, t.duration)) : t.end_date && void 0 !== t.duration && (t.start_date = this.calculateEndDate(t.end_date, -t.duration)),
            this._isAllowedUnscheduledTask(t) && this._set_default_task_timing(t), gantt._init_task_timing(t), t.start_date && t.end_date && gantt.correctTaskWorkTime(t), t.$source = [], t.$target = [], void 0 === t.parent && this.setParent(t, this.config.root_id), gantt.defined(t.$open) || (t.$open = gantt.defined(t.open) ? t.open : this.config.open_tree_initially), t.$level = this.calculateTaskLevel(t), t
    }, gantt._init_task_timing = function(t) {
        var e = this._get_safe_type(t.type);
        void 0 === t.$rendered_type ? t.$rendered_type = e : t.$rendered_type != e && (delete t.$no_end,
            delete t.$no_start, t.$rendered_type = e), void 0 !== t.$no_end && void 0 !== t.$no_start || e == this.config.types.milestone || (e == this.config.types.project ? (t.$no_end = t.$no_start = !0, this._set_default_task_timing(t)) : (t.$no_end = !(t.end_date || t.duration), t.$no_start = !t.start_date, this._isAllowedUnscheduledTask(t) && (t.$no_end = t.$no_start = !1))), e == this.config.types.milestone && (t.end_date = t.start_date), t.start_date && t.end_date && (t.duration = this.calculateDuration(t.start_date, t.end_date)), t.duration = t.duration || 0
    },
    gantt._is_flex_task = function(t) {
        return !(!t.$no_end && !t.$no_start)
    }, gantt.resetProjectDates = function(t) {
        if (t.$no_end || t.$no_start) {
            var e = this.getSubtaskDates(t.id);
            this._assign_project_dates(t, e.start_date, e.end_date)
        }
    }, gantt.getSubtaskDates = function(t) {
        var e = null,
            n = null,
            a = void 0 !== t ? t : gantt.config.root_id;
        return this.eachTask(function(t) {
            this._get_safe_type(t.type) == gantt.config.types.project || this.isUnscheduledTask(t) || (t.start_date && !t.$no_start && (!e || e > t.start_date.valueOf()) && (e = t.start_date.valueOf()),
                t.end_date && !t.$no_end && (!n || n < t.end_date.valueOf()) && (n = t.end_date.valueOf()))
        }, a), {
            start_date: e ? new Date(e) : null,
            end_date: n ? new Date(n) : null
        }
    }, gantt._assign_project_dates = function(t, e, n) {
        t.$no_start && (e && e != 1 / 0 ? t.start_date = new Date(e) : t.start_date = this._default_task_date(t, this.getParent(t))), t.$no_end && (n && n != -(1 / 0) ? t.end_date = new Date(n) : t.end_date = this.calculateEndDate(t.start_date, this.config.duration_step)), (t.$no_start || t.$no_end) && this._init_task_timing(t)
    }, gantt._update_parents = function(t, e) {
        if (t) {
            var n = this.getTask(t),
                a = this.getParent(n),
                i = !0;
            if (n.$no_start || n.$no_end) {
                var s = n.start_date.valueOf(),
                    r = n.end_date.valueOf();
                gantt.resetProjectDates(n), s == n.start_date.valueOf() && r == n.end_date.valueOf() && (i = !1), i && !e && this.refreshTask(n.id, !0)
            }
            i && a && this.isTaskExists(a) && this._update_parents(a, e)
        }
    }, gantt.isChildOf = function(t, e) {
        if (!this.isTaskExists(t)) return !1;
        if (e === this.config.root_id) return this.isTaskExists(t);
        for (var n = this.getTask(t), a = this.getParent(t); n && this.isTaskExists(a);) {
            if (n = this.getTask(a),
                n && n.id == e) return !0;
            a = this.getParent(n)
        }
        return !1
    }, gantt.roundDate = function(t) {
        //t.unit = timeunit
        t instanceof Date && (t = {
            date: t,
            unit: gantt._tasks.unit,
            step: gantt._tasks.step
        });
        var e, n, a, i = t.date,
            s = t.step,
            r = t.unit;
        if (r == gantt._tasks.unit && s == gantt._tasks.step && +i >= +gantt._min_date && +i <= +gantt._max_date) a = Math.floor(gantt._day_index_by_date(i)), gantt._tasks.trace_x[a] || (a -= 1), n = new Date(gantt._tasks.trace_x[a]), e = new Date(n), e = gantt._tasks.trace_x[a + 1] ? new Date(gantt._tasks.trace_x[a + 1]) : gantt.date.add(n, s, r);
        else {
            for (a = Math.floor(gantt._day_index_by_date(i)),
                e = gantt.date[r + "_start"](new Date(this._min_date)), gantt._tasks.trace_x[a] && (e = gantt.date[r + "_start"](gantt._tasks.trace_x[a])); + i > +e;) {
                e = gantt.date[r + "_start"](gantt.date.add(e, s, r));
                var o = e.getTimezoneOffset();
                e = gantt.date.add(e, s, r), e = gantt._correct_dst_change(e, o, e, r), gantt.date[r + "_start"] && (e = gantt.date[r + "_start"](e))
            }
            n = gantt.date.add(e, -1 * s, r)
        }
        return t.dir && "future" == t.dir ? e : t.dir && "past" == t.dir ? n : Math.abs(i - n) < Math.abs(e - i) ? n : e
    }, gantt.attachEvent("onBeforeTaskUpdate", function(t, e) {
        return gantt._init_task_timing(e), !0
    }), gantt.attachEvent("onBeforeTaskAdd", function(t, e) {
        return gantt._init_task_timing(e), !0
    }), gantt.calculateTaskLevel = function(t) {
        for (var e = 0; this.getParent(t) && this.isTaskExists(this.getParent(t));) t = this.getTask(this.getParent(t)), e++;
        return e
    }, gantt.sort = function(t, e, n, a) {
        var i = !a;
        this.isTaskExists(n) || (n = this.config.root_id), t || (t = "order");
        var s = "string" == typeof t ? function(e, n) {
            if (e[t] == n[t]) return 0;
            var a = e[t] > n[t];
            return a ? 1 : -1
        } : t;
        if (e) {
            var r = s;
            s = function(t, e) {
                return r(e, t)
            }
        }
        var o = this.getChildren(n);
        if (o) {
            for (var _ = [], d = o.length - 1; d >= 0; d--) _[d] = this._pull[o[d]];
            _.sort(s);
            for (var d = 0; d < _.length; d++) o[d] = _[d].id, this.sort(t, e, o[d], !0)
        }
        i && this.render()
    }, gantt.getNext = function(t) {
        for (var e = 0; e < this._order.length - 1; e++)
            if (this._order[e] == t) return this._order[e + 1];
        return null
    }, gantt.getPrev = function(t) {
        for (var e = 1; e < this._order.length; e++)
            if (this._order[e] == t) return this._order[e - 1];
        return null
    }, gantt._get_parent_id = function(t) {
        var e = this.config.root_id;
        return t && (e = t.parent), e
    }, gantt.getParent = function(t) {
        var e = null;
        return e = t.id ? t : gantt.getTask(t), this._get_parent_id(e)
    }, gantt.setParent = function(t, e) {
        t.parent = e
    }, gantt.getSiblings = function(t) {
        if (!this.isTaskExists(t)) return [];
        var e = this.getParent(t);
        return this.getChildren(e)
    }, gantt.getNextSibling = function(t) {
        for (var e = this.getSiblings(t), n = 0, a = e.length; a > n; n++)
            if (e[n] == t) return e[n + 1] || null;
        return null
    }, gantt.getPrevSibling = function(t) {
        for (var e = this.getSiblings(t), n = 0, a = e.length; a > n; n++)
            if (e[n] == t) return e[n - 1] || null;
        return null
    }, gantt._dp_init = function(t) {
        t.setTransactionMode("POST", !0), t.serverProcessor += (-1 != t.serverProcessor.indexOf("?") ? "&" : "?") + "editing=true", t._serverProcessor = t.serverProcessor, t.styles = {
            updated: "gantt_updated",
            order: "gantt_updated",
            inserted: "gantt_inserted",
            deleted: "gantt_deleted",
            invalid: "gantt_invalid",
            error: "gantt_error",
            clear: ""
        }, t._methods = ["_row_style", "setCellTextStyle", "_change_id", "_delete_task"], t.setGanttMode = function(e) {
            var n = t.modes || {};
            t._ganttMode && (n[t._ganttMode] = {
                _in_progress: t._in_progress,
                _invalid: t._invalid,
                updatedRows: t.updatedRows
            });
            var a = n[e];
            a || (a = n[e] = {
                _in_progress: {},
                _invalid: {},
                updatedRows: []
            }), t._in_progress = a._in_progress, t._invalid = a._invalid, t.updatedRows = a.updatedRows, t.modes = n, t._ganttMode = e
        }, this._sendTaskOrder = function(e, n) {
            n.$drop_target && (t.setGanttMode("tasks"), this.getTask(e).target = n.$drop_target, t.setUpdated(e, !0, "order"), delete this.getTask(e).$drop_target)
        }, this.attachEvent("onAfterTaskAdd", function(e, n) {
            t.setGanttMode("tasks"), t.setUpdated(e, !0, "inserted")
        }), this.attachEvent("onAfterTaskUpdate", function(e, n) {
            t.setGanttMode("tasks"), t.setUpdated(e, !0), gantt._sendTaskOrder(e, n)
        }), this.attachEvent("onAfterTaskDelete", function(e, n) {
            t.setGanttMode("tasks"), t.setUpdated(e, !0, "deleted"), "off" == t.updateMode || t._tSend || t.sendAllData()
        }), this.attachEvent("onAfterLinkUpdate", function(e, n) {
            t.setGanttMode("links"), t.setUpdated(e, !0)
        }), this.attachEvent("onAfterLinkAdd", function(e, n) {
            t.setGanttMode("links"), t.setUpdated(e, !0, "inserted")
        }), this.attachEvent("onAfterLinkDelete", function(e, n) {
            t.setGanttMode("links"), t.setUpdated(e, !0, "deleted");
        }), this.attachEvent("onRowDragEnd", function(t, e) {
            gantt._sendTaskOrder(t, gantt.getTask(t))
        });
        var e = null,
            n = null;
        this.attachEvent("onTaskIdChange", function(a, i) {
            if (t._waitMode) {
                var s = gantt.getChildren(i);
                if (s.length) {
                    e = e || {};
                    for (var r = 0; r < s.length; r++) {
                        var o = this.getTask(s[r]);
                        e[o.id] = o
                    }
                }
                var _ = this.getTask(i),
                    d = this._get_task_links(_);
                if (d.length) {
                    n = n || {};
                    for (var r = 0; r < d.length; r++) {
                        var l = this.getLink(d[r]);
                        n[l.id] = l
                    }
                }
            }
        }), t.attachEvent("onAfterUpdateFinish", function() {
            (e || n) && (gantt.batchUpdate(function() {
                for (var t in e) gantt.updateTask(e[t].id);
                for (var t in n) gantt.updateLink(n[t].id);
                e = null, n = null
            }), e ? gantt._dp.setGanttMode("tasks") : gantt._dp.setGanttMode("links"))
        }), t.attachEvent("onBeforeDataSending", function() {
            var t = this._serverProcessor;
            if ("REST" == this._tMode) {
                var e = this._ganttMode.substr(0, this._ganttMode.length - 1);
                t = t.substring(0, t.indexOf("?") > -1 ? t.indexOf("?") : t.length), this.serverProcessor = t + ("/" == t.slice(-1) ? "" : "/") + e
            } else this.serverProcessor = t + gantt._urlSeparator(t) + "gantt_mode=" + this._ganttMode;
            return !0
        }), this._init_dp_live_update_hooks(t);
        var a = t.afterUpdate;
        t.afterUpdate = function() {
            var e;
            e = 3 == arguments.length ? arguments[1] : arguments[4];
            var n = t._ganttMode,
                i = e.filePath;
            n = "REST" != this._tMode ? -1 != i.indexOf("gantt_mode=links") ? "links" : "tasks" : i.indexOf("/link") > i.indexOf("/task") ? "links" : "tasks", t.setGanttMode(n);
            var s = a.apply(t, arguments);
            return t.setGanttMode(n), s
        }, t._getRowData = gantt.bind(function(e, n) {
            var a;
            a = "tasks" == t._ganttMode ? this.isTaskExists(e) ? this.getTask(e) : {
                id: e
            } : this.isLinkExists(e) ? this.getLink(e) : {
                id: e
            }, a = gantt.copy(a);
            var i = {};
            for (var s in a)
                if ("$" != s.substr(0, 1)) {
                    var r = a[s];
                    r instanceof Date ? i[s] = this.templates.xml_format(r) : null === r ? i[s] = "" : i[s] = r
                }
            return a.$no_start && (a.start_date = "", a.duration = ""), a.$no_end && (a.end_date = "", a.duration = ""), i[t.action_param] = this.getUserData(e, t.action_param), i
        }, this), this._change_id = gantt.bind(function(e, n) {
            "tasks" != t._ganttMode ? this.changeLinkId(e, n) : this.changeTaskId(e, n)
        }, this), this._row_style = function(e, n) {
            if ("tasks" == t._ganttMode && gantt.isTaskExists(e)) {
                var a = gantt.getTask(e);
                a.$dataprocessor_class = n, gantt.refreshTask(e)
            }
        }, this._delete_task = function(t, e) {}, this._dp = t
    }, gantt.getUserData = function(t, e) {
        return this.userdata || (this.userdata = {}), this.userdata[t] && this.userdata[t][e] ? this.userdata[t][e] : ""
    }, gantt.setUserData = function(t, e, n) {
        this.userdata || (this.userdata = {}), this.userdata[t] || (this.userdata[t] = {}), this.userdata[t][e] = n
    }, gantt._init_link = function(t) {
        return gantt.defined(t.id) || (t.id = gantt.uid()), t
    }, gantt._sync_links = function() {
        for (var t = null, e = 0, n = this._order_full.length; n > e; e++) t = this._pull[this._order_full[e]],
            t.$source = [], t.$target = [];
        this._links = [];
        for (var a in this._lpull) {
            var i = this._lpull[a];
            this._links.push(i), this._pull[i.source] && this._pull[i.source].$source.push(a), this._pull[i.target] && this._pull[i.target].$target.push(a)
        }
    }, gantt.getLink = function(t) {
        return gantt.assert(this._lpull[t], "Link doesn't exist"), this._lpull[t]
    }, gantt.getLinks = function() {
        var t = [];
        for (var e in gantt._lpull) t.push(gantt._lpull[e]);
        return t
    }, gantt.isLinkExists = function(t) {
        return gantt.defined(this._lpull[t])
    }, gantt.addLink = function(t) {
        return t = this._init_link(t), this.callEvent("onBeforeLinkAdd", [t.id, t]) === !1 ? !1 : (this._lpull[t.id] = t, this._sync_links(), this._render_link(t.id), this.callEvent("onAfterLinkAdd", [t.id, t]), t.id)
    }, gantt.updateLink = function(t, e) {
        return gantt.defined(e) || (e = this.getLink(t)), this.callEvent("onBeforeLinkUpdate", [t, e]) === !1 ? !1 : (this._lpull[t] = e, this._sync_links(), this._render_link(t), this.callEvent("onAfterLinkUpdate", [t, e]), !0)
    }, gantt.deleteLink = function(t) {
        return this._deleteLink(t)
    }, gantt._deleteLink = function(t, e) {
        var n = this.getLink(t);
        return e || this.callEvent("onBeforeLinkDelete", [t, n]) !== !1 ? (delete this._lpull[t], this._sync_links(), this.refreshLink(t), e || this.callEvent("onAfterLinkDelete", [t, n]), !0) : !1
    }, gantt.changeLinkId = function(t, e) {
        this._lpull[t] && (this._lpull[e] = this._lpull[t], this._lpull[e].id = e, delete this._lpull[t], this._sync_links(), this.callEvent("onLinkIdChange", [t, e]))
    }, gantt.getChildren = function(t) {
        return gantt.defined(this._branches[t]) ? this._branches[t] : []
    }, gantt.hasChild = function(t) {
        return gantt.defined(this._branches[t]) && this._branches[t].length;
    }, gantt.refreshData = function() {
        this._render_data()
    }, gantt._isTask = function(t) {
        return !(t.type && t.type == gantt.config.types.project || t.$no_start || t.$no_end)
    }, gantt._isProject = function(t) {
        return !this._isTask(t)
    }, gantt._configure = function(t, e, n) {
        for (var a in e)("undefined" == typeof t[a] || n) && (t[a] = e[a])
    }, gantt._init_skin = function() {
        gantt._get_skin(!1), gantt._init_skin = function() {}
    }, gantt._get_skin = function(t) {
        if (!gantt.skin || t)
            for (var e = document.getElementsByTagName("link"), n = 0; n < e.length; n++) {
                var a = e[n].href.match("dhtmlxgantt_([a-z]+).css");
                if (a) {
                    gantt.skin = a[1];
                    break
                }
            }
        gantt.skin || (gantt.skin = "terrace");
        var i = gantt.skins[gantt.skin];
        this._configure(gantt.config, i.config, t);
        var s = gantt.getGridColumns();
        s[1] && "undefined" == typeof s[1].width && (s[1].width = i._second_column_width), s[2] && "undefined" == typeof s[2].width && (s[2].width = i._third_column_width), i._lightbox_template && (gantt._lightbox_template = i._lightbox_template), gantt.resetLightbox()
    }, gantt.resetSkin = function() {
        this.skin = "", this._get_skin(!0)
    }, gantt.skins = {}, gantt._lightbox_methods = {},
    gantt._lightbox_template = "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span></div><div class='gantt_cal_larea'></div>", gantt.showLightbox = function(t) {
        if (t && !gantt._is_readonly(this.getTask(t)) && this.callEvent("onBeforeLightbox", [t])) {
            var e = this.getTask(t),
                n = this.getLightbox(this._get_safe_type(e.type));
            this._center_lightbox(n), this.showCover(), this._fill_lightbox(t, n), this.callEvent("onLightbox", [t])
        }
    }, gantt._get_timepicker_step = function() {
        if (this.config.round_dnd_dates) {
            var t = gantt._tasks,
                e = this._get_line(t.unit) * t.step / 60;
            return (e >= 1440 || !this._is_chart_visible()) && (e = this.config.time_step), e
        }
        return this.config.time_step
    }, gantt.getLabel = function(t, e) {
        //t.unit = timeunit
       // t.date = labelTimeHeader;
        for (var n = this._get_typed_lightbox_config(), a = 0; a < n.length; a++)
            if (n[a].map_to == t)
                for (var i = n[a].options, s = 0; s < i.length; s++)
                    if (i[s].key == e) return i[s].label;
        return ""
    }, gantt.updateCollection = function(t, e) {
        e = e.slice(0);
        var n = gantt.serverList(t);
        return n ? (n.splice(0, n.length), n.push.apply(n, e || []),
            void gantt.resetLightbox()) : !1
    }, gantt.getLightboxType = function() {
        return this._get_safe_type(this._lightbox_type)
    }, gantt.getLightbox = function(t) {
        if (void 0 === t && (t = this.getLightboxType()), !this._lightbox || this.getLightboxType() != this._get_safe_type(t)) {
            this._lightbox_type = this._get_safe_type(t);
            var e = document.createElement("DIV");
            e.className = "gantt_cal_light";
            var n = this._is_lightbox_timepicker();
            (gantt.config.wide_form || n) && (e.className += " gantt_cal_light_wide"), n && (gantt.config.wide_form = !0, e.className += " gantt_cal_light_full"),
                e.style.visibility = "hidden";
            for (var a = this._lightbox_template, i = this.config.buttons_left, s = 0; s < i.length; s++) {
                var r = this.config._migrate_buttons[i[s]] ? this.config._migrate_buttons[i[s]] : i[s];
                a += "<div class='gantt_btn_set gantt_left_btn_set " + r + "_set'><div dhx_button='1' class='" + r + "'></div><div>" + this.locale.labels[r] + "</div></div>"
            }
            i = this.config.buttons_right;
            for (var s = 0; s < i.length; s++) {
                var r = this.config._migrate_buttons[i[s]] ? this.config._migrate_buttons[i[s]] : i[s];
                a += "<div class='gantt_btn_set gantt_right_btn_set " + r + "_set' style='float:right;'><div dhx_button='1' class='" + r + "'></div><div>" + this.locale.labels[r] + "</div></div>";
            }
            a += "</div>", e.innerHTML = a, gantt.config.drag_lightbox && (e.firstChild.onmousedown = gantt._ready_to_dnd, e.firstChild.onselectstart = function() {
                return !1
            }, e.firstChild.style.cursor = "pointer", gantt._init_dnd_events()), document.body.insertBefore(e, document.body.firstChild), this._lightbox = e;
            var o = this._get_typed_lightbox_config(t);
            a = this._render_sections(o);
            for (var _ = e.getElementsByTagName("div"), s = 0; s < _.length; s++) {
                var d = _[s];
                if ("gantt_cal_larea" == d.className) {
                    d.innerHTML = a;
                    break
                }
            }
            this.resizeLightbox(), this._init_lightbox_events(this),
                e.style.display = "none", e.style.visibility = "visible"
        }
        return this._lightbox
    }, gantt._render_sections = function(t) {
        for (var e = "", n = 0; n < t.length; n++) {
            var a = this.form_blocks[t[n].type];
            if (a) {
                t[n].id = "area_" + this.uid();
                var i = t[n].hidden ? " style='display:none'" : "",
                    s = "";
                t[n].button && (s = "<div class='gantt_custom_button' index='" + n + "'><div class='gantt_custom_button_" + t[n].button + "'></div><div>" + this.locale.labels["button_" + t[n].button] + "</div></div>"), this.config.wide_form && (e += "<div class='gantt_wrap_section' " + i + ">"),
                    e += "<div id='" + t[n].id + "' class='gantt_cal_lsection'>" + s + this.locale.labels["section_" + t[n].name] + "</div>" + a.render.call(this, t[n]), e += "</div>"
            }
        }
        return e
    }, gantt.resizeLightbox = function() {
        var t = this._lightbox;
        if (t) {
            var e = t.childNodes[1];
            e.style.height = "0px", e.style.height = e.scrollHeight + "px", t.style.height = e.scrollHeight + this.config.lightbox_additional_height + "px", e.style.height = e.scrollHeight + "px"
        }
    }, gantt._center_lightbox = function(t) {
        if (t) {
            t.style.display = "block";
            var e = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
                n = window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft,
                a = window.innerHeight || document.documentElement.clientHeight;
            e ? t.style.top = Math.round(e + Math.max((a - t.offsetHeight) / 2, 0)) + "px" : t.style.top = Math.round(Math.max((a - t.offsetHeight) / 2, 0) + 9) + "px", document.documentElement.scrollWidth > document.body.offsetWidth ? t.style.left = Math.round(n + (document.body.offsetWidth - t.offsetWidth) / 2) + "px" : t.style.left = Math.round((document.body.offsetWidth - t.offsetWidth) / 2) + "px"
        }
    }, gantt.showCover = function() {
        if (!this._cover) {
            this._cover = document.createElement("DIV"), this._cover.className = "gantt_cal_cover";
            var t = void 0 !== document.height ? document.height : document.body.offsetHeight,
                e = document.documentElement ? document.documentElement.scrollHeight : 0;
            this._cover.style.height = Math.max(t, e) + "px", document.body.appendChild(this._cover)
        }
    }, gantt._init_lightbox_events = function() {
        gantt.lightbox_events = {}, gantt.lightbox_events.gantt_save_btn = function(t) {
            gantt._save_lightbox()
        }, gantt.lightbox_events.gantt_delete_btn = function(t) {
            gantt.callEvent("onLightboxDelete", [gantt._lightbox_id]) && (gantt.isTaskExists(gantt._lightbox_id) ? gantt.$click.buttons["delete"](gantt._lightbox_id) : gantt.hideLightbox())
        }, gantt.lightbox_events.gantt_cancel_btn = function(t) {
            gantt._cancel_lightbox();
        }, gantt.lightbox_events["default"] = function(t, e) {
            if (e.getAttribute("dhx_button")) gantt.callEvent("onLightboxButton", [e.className, e, t]);
            else {
                var n, a, i, s = gantt._getClassName(e); - 1 != s.indexOf("gantt_custom_button") && (-1 != s.indexOf("gantt_custom_button_") ? (n = e.parentNode.getAttribute("index"), i = e.parentNode.parentNode) : (n = e.getAttribute("index"), i = e.parentNode, e = e.firstChild));
                var r = gantt._get_typed_lightbox_config();
                n && (a = gantt.form_blocks[r[n].type], a.button_click(n, e, i, i.nextSibling))
            }
        }, this.event(gantt.getLightbox(), "click", function(t) {
            t = t || window.event;
            var e = t.target ? t.target : t.srcElement,
                n = gantt._getClassName(e);
            if (n || (e = e.previousSibling, n = gantt._getClassName(e)), e && n && 0 === n.indexOf("gantt_btn_set") && (e = e.firstChild, n = gantt._getClassName(e)), e && n) {
                var a = gantt.defined(gantt.lightbox_events[e.className]) ? gantt.lightbox_events[e.className] : gantt.lightbox_events["default"];
                return a(t, e)
            }
            return !1
        }), gantt.getLightbox().onkeydown = function(t) {
            switch ((t || event).keyCode) {
                case gantt.keys.edit_save:
                    if ((t || event).shiftKey) return;
                    gantt._save_lightbox();
                    break;
                case gantt.keys.edit_cancel:
                    gantt._cancel_lightbox()
            }
        }
    }, gantt._cancel_lightbox = function() {
        var t = this.getLightboxValues();
        this.callEvent("onLightboxCancel", [this._lightbox_id, t.$new]), gantt.isTaskExists(t.id) && t.$new && this._deleteTask(t.id, !0), this.refreshData(), this.hideLightbox()
    }, gantt._save_lightbox = function() {
        var t = this.getLightboxValues();
        this.callEvent("onLightboxSave", [this._lightbox_id, t, !!t.$new]) && (t.$new ? (delete t.$new, this._replace_branch_child(this.getParent(t.id), t.id), this.addTask(t)) : this.isTaskExists(t.id) && (this.mixin(this.getTask(t.id), t, !0),
            this.updateTask(t.id)), this.refreshData(), this.hideLightbox())
    }, gantt._resolve_default_mapping = function(t) {
        var e = t.map_to,
            n = {
                time: !0,
                time_optional: !0,
                duration: !0,
                duration_optional: !0
            };
        return n[t.type] && ("auto" == t.map_to ? e = {
            start_date: "start_date",
            end_date: "end_date",
            duration: "duration"
        } : "string" == typeof t.map_to && (e = {
            start_date: t.map_to
        })), e
    }, gantt.getLightboxValues = function() {
        var t = {};
        gantt.isTaskExists(this._lightbox_id) && (t = this.mixin({}, this.getTask(this._lightbox_id)));
        for (var e = this._get_typed_lightbox_config(), n = 0; n < e.length; n++) {
            var a = document.getElementById(e[n].id);
            a = a ? a.nextSibling : a;
            var i = this.form_blocks[e[n].type];
            if (i) {
                var s = i.get_value.call(this, a, t, e[n]),
                    r = gantt._resolve_default_mapping(e[n]);
                if ("string" == typeof r && "auto" != r) t[r] = s;
                else if ("object" == typeof r)
                    for (var o in r) r[o] && (t[r[o]] = s[o])
            }
        }
        return t
    }, gantt.hideLightbox = function() {
        var t = this.getLightbox();
        t && (t.style.display = "none"), this._lightbox_id = null, this.hideCover(), this.callEvent("onAfterLightbox", [])
    }, gantt.hideCover = function() {
        this._cover && this._cover.parentNode.removeChild(this._cover),
            this._cover = null
    }, gantt.resetLightbox = function() {
        gantt._lightbox && !gantt._custom_lightbox && gantt._lightbox.parentNode.removeChild(gantt._lightbox), gantt._lightbox = null
    }, gantt._set_lightbox_values = function(t, e) {
        var n = t,
            a = e.getElementsByTagName("span");
        gantt.templates.lightbox_header ? (a[1].innerHTML = "", a[2].innerHTML = gantt.templates.lightbox_header(n.start_date, n.end_date, n)) : (a[1].innerHTML = this.templates.task_time(n.start_date, n.end_date, n), a[2].innerHTML = (this.templates.task_text(n.start_date, n.end_date, n) || "").substr(0, 70));
        for (var i = this._get_typed_lightbox_config(this.getLightboxType()), s = 0; s < i.length; s++) {
            var r = i[s];
            if (this.form_blocks[r.type]) {
                var o = document.getElementById(r.id).nextSibling,
                    _ = this.form_blocks[r.type],
                    d = gantt._resolve_default_mapping(i[s]),
                    l = this.defined(n[d]) ? n[d] : r.default_value;
                _.set_value.call(gantt, o, l, n, r), r.focus && _.focus.call(gantt, o)
            }
        }
        t.id && (gantt._lightbox_id = t.id)
    }, gantt._fill_lightbox = function(t, e) {
        var n = this.getTask(t);
        this._set_lightbox_values(n, e)
    }, gantt.getLightboxSection = function(t) {
        var e = this._get_typed_lightbox_config(),
            n = 0;
        for (n; n < e.length && e[n].name != t; n++);
        var a = e[n];
        if (!a) return null;
        this._lightbox || this.getLightbox();
        var i = document.getElementById(a.id),
            s = i.nextSibling,
            r = {
                section: a,
                header: i,
                node: s,
                getValue: function(t) {
                    return gantt.form_blocks[a.type].get_value.call(gantt, s, t || {}, a)
                },
                setValue: function(t, e) {
                    return gantt.form_blocks[a.type].set_value.call(gantt, s, t, e || {}, a)
                }
            },
            o = this._lightbox_methods["get_" + a.type + "_control"];
        return o ? o(r) : r
    }, gantt._lightbox_methods.get_template_control = function(t) {
        return t.control = t.node, t
    }, gantt._lightbox_methods.get_select_control = function(t) {
        return t.control = t.node.getElementsByTagName("select")[0], t
    }, gantt._lightbox_methods.get_textarea_control = function(t) {
        return t.control = t.node.getElementsByTagName("textarea")[0], t
    }, gantt._lightbox_methods.get_time_control = function(t) {
        return t.control = t.node.getElementsByTagName("select"), t
    }, gantt._init_dnd_events = function() {
        this.event(document.body, "mousemove", gantt._move_while_dnd), this.event(document.body, "mouseup", gantt._finish_dnd),
            gantt._init_dnd_events = function() {}
    }, gantt._move_while_dnd = function(t) {
        if (gantt._dnd_start_lb) {
            document.gantt_unselectable || (document.body.className += " gantt_unselectable", document.gantt_unselectable = !0);
            var e = gantt.getLightbox(),
                n = t && t.target ? [t.pageX, t.pageY] : [event.clientX, event.clientY];
            e.style.top = gantt._lb_start[1] + n[1] - gantt._dnd_start_lb[1] + "px", e.style.left = gantt._lb_start[0] + n[0] - gantt._dnd_start_lb[0] + "px"
        }
    }, gantt._ready_to_dnd = function(t) {
        var e = gantt.getLightbox();
        gantt._lb_start = [parseInt(e.style.left, 10), parseInt(e.style.top, 10)],
            gantt._dnd_start_lb = t && t.target ? [t.pageX, t.pageY] : [event.clientX, event.clientY]
    }, gantt._finish_dnd = function() {
        gantt._lb_start && (gantt._lb_start = gantt._dnd_start_lb = !1, document.body.className = document.body.className.replace(" gantt_unselectable", ""), document.gantt_unselectable = !1)
    }, gantt._focus = function(t, e) {
        if (t && t.focus)
            if (gantt.config.touch);
            else try {
                e && t.select && t.select(), t.focus()
            } catch (n) {}
    }, gantt.form_blocks = {
        getTimePicker: function(t, e) {
            var n = t.time_format;
            if (!n) {
                var n = ["%d", "%m", "%Y"];
                gantt._get_line(gantt._tasks.unit) < gantt._get_line("day") && n.push("%H:%i");
            }
            t._time_format_order = {
                size: 0
            };
            var a = this.config,
                i = this.date.date_part(new Date(gantt._min_date.valueOf())),
                s = 1440,
                r = 0;
            gantt.config.limit_time_select && (s = 60 * a.last_hour + 1, r = 60 * a.first_hour, i.setHours(a.first_hour));
            for (var o = "", _ = 0; _ < n.length; _++) {
                var d = n[_];
                _ > 0 && (o += " ");
                var l = "";
                switch (d) {
                    case "%Y":
                        t._time_format_order[2] = _, t._time_format_order.size++;
                        var g, h, c, u;
                        t.year_range && (isNaN(t.year_range) ? t.year_range.push && (c = t.year_range[0], u = t.year_range[1]) : g = t.year_range), g = g || 10, h = h || Math.floor(g / 2),
                            c = c || i.getFullYear() - h, u = u || c + g;
                        for (var f = c; u > f; f++) l += "<option value='" + f + "'>" + f + "</option>";
                        break;
                    case "%m":
                        t._time_format_order[1] = _, t._time_format_order.size++;
                        for (var f = 0; 12 > f; f++) l += "<option value='" + f + "'>" + this.locale.date.month_full[f] + "</option>";
                        break;
                    case "%d":
                        t._time_format_order[0] = _, t._time_format_order.size++;
                        for (var f = 1; 32 > f; f++) l += "<option value='" + f + "'>" + f + "</option>";
                        break;
                    case "%H:%i":
                        t._time_format_order[3] = _, t._time_format_order.size++;
                        var f = r,
                            p = i.getDate();
                        for (t._time_values = []; s > f;) {
                            var v = this.templates.time_picker(i);
                            l += "<option value='" + f + "'>" + v + "</option>", t._time_values.push(f), i.setTime(i.valueOf() + 60 * this._get_timepicker_step() * 1e3);
                            var m = i.getDate() != p ? 1 : 0;
                            f = 24 * m * 60 + 60 * i.getHours() + i.getMinutes()
                        }
                }
                if (l) {
                    var k = t.readonly ? "disabled='disabled'" : "",
                        b = e ? " style='display:none'" : "";
                    o += "<select " + k + b + ">" + l + "</select>"
                }
            }
            return o
        },
        _fill_lightbox_select: function(t, e, n, a, i) {
            if (t[e + a[0]].value = n.getDate(), t[e + a[1]].value = n.getMonth(), t[e + a[2]].value = n.getFullYear(), gantt.defined(a[3])) {
                var s = 60 * n.getHours() + n.getMinutes();
                s = Math.round(s / gantt._get_timepicker_step()) * gantt._get_timepicker_step();
                var r = t[e + a[3]];
                r.value = s, r.setAttribute("data-value", s)
            }
        },
        template: {
            render: function(t) {
                var e = (t.height || "30") + "px";
                return "<div class='gantt_cal_ltext gantt_cal_template' style='height:" + e + ";'></div>"
            },
            set_value: function(t, e, n, a) {
                t.innerHTML = e || ""
            },
            get_value: function(t, e, n) {
                return t.innerHTML || ""
            },
            focus: function(t) {}
        },
        textarea: {
            render: function(t) {
                var e = (t.height || "130") + "px";
                return "<div class='gantt_cal_ltext' style='height:" + e + ";'><textarea></textarea></div>";
            },
            set_value: function(t, e, n) {
                t.firstChild.value = e || ""
            },
            get_value: function(t, e) {
                return t.firstChild.value
            },
            focus: function(t) {
                var e = t.firstChild;
                gantt._focus(e, !0)
            }
        },
        select: {
            render: function(t) {
                for (var e = (t.height || "23") + "px", n = "<div class='gantt_cal_ltext' style='height:" + e + ";'><select style='width:100%;'>", a = 0; a < t.options.length; a++) n += "<option value='" + t.options[a].key + "'>" + t.options[a].label + "</option>";
                return n += "</select></div>"
            },
            set_value: function(t, e, n, a) {
                var i = t.firstChild;
                !i._dhx_onchange && a.onchange && (i.onchange = a.onchange,
                    i._dhx_onchange = !0), "undefined" == typeof e && (e = (i.options[0] || {}).value), i.value = e || ""
            },
            get_value: function(t, e) {
                return t.firstChild.value
            },
            focus: function(t) {
                var e = t.firstChild;
                gantt._focus(e, !0)
            }
        },
        time: {
            render: function(t) {
                var e = this.form_blocks.getTimePicker.call(this, t),
                    n = ["<div style='height:" + (t.height || 30) + "px;padding-top:0px;font-size:inherit;text-align:center;' class='gantt_section_time'>"];
                return n.push(e), t.single_date ? (e = this.form_blocks.getTimePicker.call(this, t, !0), n.push("<span></span>")) : n.push("<span style='font-weight:normal; font-size:10pt;'> &nbsp;&ndash;&nbsp; </span>"),
                    n.push(e), n.push("</div>"), n.join("")
            },
            set_value: function(t, e, n, a) {
                var i = a,
                    s = t.getElementsByTagName("select"),
                    r = a._time_format_order;
                a._time_format_size;
                if (i.auto_end_date)
                    for (var o = function() {
                            l = new Date(s[r[2]].value, s[r[1]].value, s[r[0]].value, 0, 0), g = gantt.calculateEndDate(l, 1), this.form_blocks._fill_lightbox_select(s, r.size, g, r, i)
                        }, _ = 0; 4 > _; _++) s[_].onchange = o;
                var d = gantt._resolve_default_mapping(a);
                "string" == typeof d && (d = {
                    start_date: d
                });
                var l = n[d.start_date] || new Date,
                    g = n[d.end_date] || gantt.calculateEndDate(l, 1);
                this.form_blocks._fill_lightbox_select(s, 0, l, r, i), this.form_blocks._fill_lightbox_select(s, r.size, g, r, i)
            },
            get_value: function(t, e, n) {
                var a = t.getElementsByTagName("select"),
                    i = n._time_format_order,
                    s = 0,
                    r = 0;
                if (gantt.defined(i[3])) {
                    var o = parseInt(a[i[3]].value, 10);
                    s = Math.floor(o / 60), r = o % 60
                }
                var _ = new Date(a[i[2]].value, a[i[1]].value, a[i[0]].value, s, r);
                if (s = r = 0, gantt.defined(i[3])) {
                    var o = parseInt(a[i.size + i[3]].value, 10);
                    s = Math.floor(o / 60), r = o % 60
                }
                var d = new Date(a[i[2] + i.size].value, a[i[1] + i.size].value, a[i[0] + i.size].value, s, r);
                _ >= d && (d = gantt.date.add(_, gantt._get_timepicker_step(), "minute"));
                var l = gantt._resolve_default_mapping(n),
                    g = {
                        start_date: new Date(_),
                        end_date: new Date(d)
                    };
                return "string" == typeof l ? g.start_date : g
            },
            focus: function(t) {
                gantt._focus(t.getElementsByTagName("select")[0])
            }
        },
        duration: {
            render: function(t) {
                var e = this.form_blocks.getTimePicker.call(this, t);
                e = "<div class='gantt_time_selects'>" + e + "</div>";
                var n = this.locale.labels[this.config.duration_unit + "s"],
                    a = t.single_date ? ' style="display:none"' : "",
                    i = t.readonly ? " disabled='disabled'" : "",
                    s = "<div class='gantt_duration' " + a + "><input type='button' class='gantt_duration_dec' value='-'" + i + "><input type='text' value='5' class='gantt_duration_value'" + i + "><input type='button' class='gantt_duration_inc' value='+'" + i + "> " + n + " <span></span></div>",
                    r = "<div style='height:" + (t.height || 30) + "px;padding-top:0px;font-size:inherit;' class='gantt_section_time'>" + e + " " + s + "</div>";
                return r
            },
            set_value: function(t, e, n, a) {
                function i() {
                    var e = gantt.form_blocks.duration._get_start_date.call(gantt, t, a),
                        n = gantt.form_blocks.duration._get_duration.call(gantt, t, a),
                        i = gantt.calculateEndDate(e, n);
                    g.innerHTML = gantt.templates.task_date(i)
                }

                function s(t) {
                    var e = d.value;
                    e = parseInt(e, 10), window.isNaN(e) && (e = 0), e += t, 1 > e && (e = 1), d.value = e, i()
                }
                var r = a,
                    o = t.getElementsByTagName("select"),
                    _ = t.getElementsByTagName("input"),
                    d = _[1],
                    l = [_[0], _[2]],
                    g = t.getElementsByTagName("span")[0],
                    h = a._time_format_order;
                l[0].onclick = gantt.bind(function() {
                    s(-1 * this.config.duration_step)
                }, this), l[1].onclick = gantt.bind(function() {
                    s(1 * this.config.duration_step)
                }, this), o[0].onchange = i, o[1].onchange = i, o[2].onchange = i, o[3] && (o[3].onchange = i), d.onkeydown = gantt.bind(function(t) {
                    t = t || window.event;
                    var e = t.charCode || t.keyCode || t.which;
                    return 40 == e ? (s(-1 * this.config.duration_step), !1) : 38 == e ? (s(1 * this.config.duration_step), !1) : void window.setTimeout(function(t) {
                        i()
                    }, 1)
                }, this), d.onchange = gantt.bind(function(t) {
                    i()
                }, this);
                var c = gantt._resolve_default_mapping(a);
                "string" == typeof c && (c = {
                    start_date: c
                });
                var u = n[c.start_date] || new Date,
                    f = n[c.end_date] || gantt.calculateEndDate(u, 1),
                    p = Math.round(n[c.duration]) || gantt.calculateDuration(u, f);
                gantt.form_blocks._fill_lightbox_select(o, 0, u, h, r), d.value = p, i()
            },
            _get_start_date: function(t, e) {
                var n = t.getElementsByTagName("select"),
                    a = e._time_format_order,
                    i = 0,
                    s = 0;
                if (gantt.defined(a[3])) {
                    var r = n[a[3]],
                        o = parseInt(r.value, 10);
                    isNaN(o) && r.hasAttribute("data-value") && (o = parseInt(r.getAttribute("data-value"), 10)), i = Math.floor(o / 60), s = o % 60
                }
                return new Date(n[a[2]].value, n[a[1]].value, n[a[0]].value, i, s);
            },
            _get_duration: function(t, e) {
                var n = t.getElementsByTagName("input")[1];
                return n = parseInt(n.value, 10), (!n || window.isNaN(n)) && (n = 1), 0 > n && (n *= -1), n
            },
            get_value: function(t, e, n) {
                var a = gantt.form_blocks.duration._get_start_date(t, n),
                    i = gantt.form_blocks.duration._get_duration(t, n),
                    s = gantt.calculateEndDate(a, i),
                    r = gantt._resolve_default_mapping(n),
                    o = {
                        start_date: new Date(a),
                        end_date: new Date(s),
                        duration: i
                    };
                return "string" == typeof r ? o.start_date : o
            },
            focus: function(t) {
                gantt._focus(t.getElementsByTagName("select")[0]);
            }
        },
        parent: {
            _filter: function(t, e, n) {
                var a = e.filter || function() {
                    return !0
                };
                t = t.slice(0);
                for (var i = 0; i < t.length; i++) {
                    var s = t[i];
                    (s.id == n || gantt.isChildOf(s.id, n) || a(s.id, s) === !1) && (t.splice(i, 1), i--)
                }
                return t
            },
            _display: function(t, e) {
                var n = [],
                    a = [];
                e && (n = gantt.getTaskByTime(), t.allow_root && n.unshift({
                    id: gantt.config.root_id,
                    text: t.root_label || ""
                }), n = this._filter(n, t, e), t.sort && n.sort(t.sort));
                for (var i = t.template || gantt.templates.task_text, s = 0; s < n.length; s++) {
                    var r = i.apply(gantt, [n[s].start_date, n[s].end_date, n[s]]);
                    void 0 === r && (r = ""), a.push({
                        key: n[s].id,
                        label: r
                    })
                }
                return t.options = a, t.map_to = t.map_to || "parent", gantt.form_blocks.select.render.apply(this, arguments)
            },
            render: function(t) {
                return gantt.form_blocks.parent._display(t, !1)
            },
            set_value: function(t, e, n, a) {
                var i = document.createElement("div");
                i.innerHTML = gantt.form_blocks.parent._display(a, n.id);
                var s = i.removeChild(i.firstChild);
                return t.onselect = null, t.parentNode.replaceChild(s, t), gantt.form_blocks.select.set_value.apply(gantt, [s, e, n, a])
            },
            get_value: function() {
                return gantt.form_blocks.select.get_value.apply(gantt, arguments)
            },
            focus: function() {
                return gantt.form_blocks.select.focus.apply(gantt, arguments)
            }
        }
    }, gantt._is_lightbox_timepicker = function() {
        for (var t = this._get_typed_lightbox_config(), e = 0; e < t.length; e++)
            if ("time" == t[e].name && "time" == t[e].type) return !0;
        return !1
    }, gantt._dhtmlx_confirm = function(t, e, n, a) {
        if (!t) return n();
        var i = {
            text: t
        };
        e && (i.title = e), a && (i.ok = a), n && (i.callback = function(t) {
            t && n()
        }), gantt.confirm(i)
    }, gantt._get_typed_lightbox_config = function(t) {
        void 0 === t && (t = this.getLightboxType());
        var e = this._get_type_name(t);
        return gantt.config.lightbox[e + "_sections"] ? gantt.config.lightbox[e + "_sections"] : gantt.config.lightbox.sections
    }, gantt._silent_redraw_lightbox = function(t) {
        var e = this.getLightboxType();
        if (this.getState().lightbox) {
            var n = this.getState().lightbox,
                a = this.getLightboxValues(),
                i = this.copy(this.getTask(n));
            this.resetLightbox();
            var s = this.mixin(i, a, !0),
                r = this.getLightbox(t ? t : void 0);
            this._center_lightbox(this.getLightbox()), this._set_lightbox_values(s, r);
        } else this.resetLightbox(), this.getLightbox(t ? t : void 0);
        this.callEvent("onLightboxChange", [e, this.getLightboxType()])
    }, gantt._extend_to_optional = function(t) {
        var e = t,
            n = {
                render: e.render,
                focus: e.focus,
                set_value: function(t, a, i, s) {
                    var r = gantt._resolve_default_mapping(s);
                    if (!i[r.start_date] || "start_date" == r.start_date && this._isAllowedUnscheduledTask(i)) {
                        n.disable(t, s);
                        var o = {};
                        for (var _ in r) o[r[_]] = i[_];
                        return e.set_value.call(gantt, t, a, o, s)
                    }
                    return n.enable(t, s), e.set_value.call(gantt, t, a, i, s)
                },
                get_value: function(t, n, a) {
                    return a.disabled ? {
                        start_date: null
                    } : e.get_value.call(gantt, t, n, a)
                },
                update_block: function(t, e) {
                    if (gantt.callEvent("onSectionToggle", [gantt._lightbox_id, e]), t.style.display = e.disabled ? "none" : "block", e.button) {
                        var n = t.previousSibling.firstChild.firstChild,
                            a = gantt.locale.labels,
                            i = e.disabled ? a[e.name + "_enable_button"] : a[e.name + "_disable_button"];
                        n.nextSibling.innerHTML = i
                    }
                    gantt.resizeLightbox()
                },
                disable: function(t, e) {
                    e.disabled = !0, n.update_block(t, e)
                },
                enable: function(t, e) {
                    e.disabled = !1, n.update_block(t, e);
                },
                button_click: function(t, e, a, i) {
                    if (gantt.callEvent("onSectionButton", [gantt._lightbox_id, a]) !== !1) {
                        var s = gantt._get_typed_lightbox_config()[t];
                        s.disabled ? n.enable(i, s) : n.disable(i, s)
                    }
                }
            };
        return n
    }, gantt.form_blocks.duration_optional = gantt._extend_to_optional(gantt.form_blocks.duration), gantt.form_blocks.time_optional = gantt._extend_to_optional(gantt.form_blocks.time), gantt.dataProcessor = function(t) {
        return this.serverProcessor = t, this.action_param = "!nativeeditor_status", this.object = null, this.updatedRows = [],
            this.autoUpdate = !0, this.updateMode = "cell", this._tMode = "GET", this._headers = null, this._payload = null, this.post_delim = "_", this._waitMode = 0, this._in_progress = {}, this._invalid = {}, this.mandatoryFields = [], this.messages = [], this.styles = {
                updated: "font-weight:bold;",
                inserted: "font-weight:bold;",
                deleted: "text-decoration : line-through;",
                invalid: "background-color:FFE0E0;",
                invalid_cell: "border-bottom:2px solid red;",
                error: "color:red;",
                clear: "font-weight:normal;text-decoration:none;"
            }, this.enableUTFencoding(!0),
            gantt._eventable(this), this
    }, gantt.dataProcessor.prototype = {
        setTransactionMode: function(t, e) {
            "object" == typeof t ? (this._tMode = t.mode || this._tMode, this._headers = this._headers || t.headers, this._payload = this._payload || t.payload) : (this._tMode = t, this._tSend = e), "REST" == this._tMode && (this._tSend = !1, this._endnm = !0)
        },
        escape: function(t) {
            return this._utf ? encodeURIComponent(t) : escape(t)
        },
        enableUTFencoding: function(t) {
            this._utf = !!t
        },
        setDataColumns: function(t) {
            this._columns = "string" == typeof t ? t.split(",") : t
        },
        getSyncState: function() {
            return !this.updatedRows.length
        },
        enableDataNames: function(t) {
            this._endnm = !!t
        },
        enablePartialDataSend: function(t) {
            this._changed = !!t
        },
        setUpdateMode: function(t, e) {
            this.autoUpdate = "cell" == t, this.updateMode = t, this.dnd = e
        },
        ignore: function(t, e) {
            this._silent_mode = !0, t.call(e || window), this._silent_mode = !1
        },
        setUpdated: function(t, e, n) {
            if (!this._silent_mode) {
                var a = this.findRow(t);
                n = n || "updated";
                var i = this.obj.getUserData(t, this.action_param);
                i && "updated" == n && (n = i), e ? (this.set_invalid(t, !1), this.updatedRows[a] = t,
                    this.obj.setUserData(t, this.action_param, n), this._in_progress[t] && (this._in_progress[t] = "wait")) : this.is_invalid(t) || (this.updatedRows.splice(a, 1), this.obj.setUserData(t, this.action_param, "")), e || this._clearUpdateFlag(t), this.markRow(t, e, n), e && this.autoUpdate && this.sendData(t)
            }
        },
        _clearUpdateFlag: function(t) {},
        markRow: function(t, e, n) {
            var a = "",
                i = this.is_invalid(t);
            if (i && (a = this.styles[i], e = !0), this.callEvent("onRowMark", [t, e, n, i]) && (a = this.styles[e ? n : "clear"] + a, this.obj[this._methods[0]](t, a), i && i.details)) {
                a += this.styles[i + "_cell"];
                for (var s = 0; s < i.details.length; s++) i.details[s] && this.obj[this._methods[1]](t, s, a)
            }
        },
        getState: function(t) {
            return this.obj.getUserData(t, this.action_param)
        },
        is_invalid: function(t) {
            return this._invalid[t]
        },
        set_invalid: function(t, e, n) {
            n && (e = {
                value: e,
                details: n,
                toString: function() {
                    return this.value.toString()
                }
            }), this._invalid[t] = e
        },
        checkBeforeUpdate: function(t) {
            return !0
        },
        sendData: function(t) {
            return !this._waitMode || "tree" != this.obj.mytype && !this.obj._h2 ? (this.obj.editStop && this.obj.editStop(),
                "undefined" == typeof t || this._tSend ? this.sendAllData() : this._in_progress[t] ? !1 : (this.messages = [], !this.checkBeforeUpdate(t) && this.callEvent("onValidationError", [t, this.messages]) ? !1 : void this._beforeSendData(this._getRowData(t), t))) : void 0
        },
        _beforeSendData: function(t, e) {
            return this.callEvent("onBeforeUpdate", [e, this.getState(e), t]) ? void this._sendData(t, e) : !1
        },
        serialize: function(t, e) {
            if ("string" == typeof t) return t;
            if ("undefined" != typeof e) return this.serialize_one(t, "");
            var n = [],
                a = [];
            for (var i in t) t.hasOwnProperty(i) && (n.push(this.serialize_one(t[i], i + this.post_delim)),
                a.push(i));
            return n.push("ids=" + this.escape(a.join(","))), gantt.security_key && n.push("dhx_security=" + gantt.security_key), n.join("&")
        },
        serialize_one: function(t, e) {
            if ("string" == typeof t) return t;
            var n = [];
            for (var a in t)
                if (t.hasOwnProperty(a)) {
                    if (("id" == a || a == this.action_param) && "REST" == this._tMode) continue;
                    n.push(this.escape((e || "") + a) + "=" + this.escape(t[a]))
                }
            return n.join("&")
        },
        _sendData: function(t, e) {
            if (t) {
                if (!this.callEvent("onBeforeDataSending", e ? [e, this.getState(e), t] : [null, null, t])) return !1;
                e && (this._in_progress[e] = (new Date).valueOf());
                var n = this,
                    a = function(a) {
                        var i = [];
                        if (e) i.push(e);
                        else if (t)
                            for (var s in t) i.push(s);
                        return n.afterUpdate(n, a, i)
                    },
                    i = this.serverProcessor + (this._user ? gantt._urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + this.obj.getUserData(0, "version")].join("&") : "");
                if ("GET" == this._tMode) gantt.ajax.get(i + (-1 != i.indexOf("?") ? "&" : "?") + this.serialize(t, e), a);
                else if ("POST" == this._tMode) gantt.ajax.post(i, this.serialize(t, e), a);
                else if ("REST" == this._tMode) {
                    var s = this.getState(e),
                        r = i.replace(/(\&|\?)editing\=true/, ""),
                        o = "",
                        _ = "post";
                    if ("inserted" == s ? o = this.serialize(t, e) : "deleted" == s ? (_ = "DELETE", r = r + ("/" == r.slice(-1) ? "" : "/") + e) : (_ = "PUT", o = this.serialize(t, e), r = r + ("/" == r.slice(-1) ? "" : "/") + e), this._payload)
                        for (var d in this._payload) r = r + this._urlSeparator(r) + this.escape(d) + "=" + this.escape(this._payload[d]);
                    gantt.ajax.query({
                        url: r,
                        method: _,
                        headers: this._headers,
                        data: o,
                        callback: a
                    })
                }
                this._waitMode++
            }
        },
        sendAllData: function() {
            if (this.updatedRows.length) {
                this.messages = [];
                for (var t = !0, e = 0; e < this.updatedRows.length; e++) t &= this.checkBeforeUpdate(this.updatedRows[e]);
                if (!t && !this.callEvent("onValidationError", ["", this.messages])) return !1;
                if (this._tSend) this._sendData(this._getAllData());
                else
                    for (var e = 0; e < this.updatedRows.length; e++)
                        if (!this._in_progress[this.updatedRows[e]]) {
                            if (this.is_invalid(this.updatedRows[e])) continue;
                            if (this._beforeSendData(this._getRowData(this.updatedRows[e]), this.updatedRows[e]), this._waitMode && ("tree" == this.obj.mytype || this.obj._h2)) return
                        }
            }
        },
        _getAllData: function(t) {
            for (var e = {}, n = !1, a = 0; a < this.updatedRows.length; a++) {
                var i = this.updatedRows[a];
                this._in_progress[i] || this.is_invalid(i) || this.callEvent("onBeforeUpdate", [i, this.getState(i), this._getRowData(i)]) && (e[i] = this._getRowData(i, i + this.post_delim), n = !0, this._in_progress[i] = (new Date).valueOf())
            }
            return n ? e : null
        },
        setVerificator: function(t, e) {
            this.mandatoryFields[t] = e || function(t) {
                return "" !== t
            }
        },
        clearVerificator: function(t) {
            this.mandatoryFields[t] = !1
        },
        findRow: function(t) {
            var e = 0;
            for (e = 0; e < this.updatedRows.length && t != this.updatedRows[e]; e++);
            return e
        },
        defineAction: function(t, e) {
            this._uActions || (this._uActions = []),
                this._uActions[t] = e
        },
        afterUpdateCallback: function(t, e, n, a) {
            var i = t,
                s = "error" != n && "invalid" != n;
            if (s || this.set_invalid(t, n), this._uActions && this._uActions[n] && !this._uActions[n](a)) return delete this._in_progress[i];
            "wait" != this._in_progress[i] && this.setUpdated(t, !1);
            var r = t;
            switch (n) {
                case "inserted":
                case "insert":
                    e != t && (this.obj[this._methods[2]](t, e), t = e);
                    break;
                case "delete":
                case "deleted":
                    return this.obj.setUserData(t, this.action_param, "true_deleted"), this.obj[this._methods[3]](t), delete this._in_progress[i],
                        this.callEvent("onAfterUpdate", [t, n, e, a])
            }
            "wait" != this._in_progress[i] ? (s && this.obj.setUserData(t, this.action_param, ""), delete this._in_progress[i]) : (delete this._in_progress[i], this.setUpdated(e, !0, this.obj.getUserData(t, this.action_param))), this.callEvent("onAfterUpdate", [r, n, e, a])
        },
        afterUpdate: function(t, e, n) {
            if (window.JSON) try {
                var a = JSON.parse(e.xmlDoc.responseText),
                    i = a.action || this.getState(n) || "updated",
                    s = a.sid || n[0],
                    r = a.tid || n[0];
                return t.afterUpdateCallback(s, r, i, a), void t.finalizeUpdate();
            } catch (o) {}
            var _ = gantt.ajax.xmltop("data", e.xmlDoc);
            if (!_) return this.cleanUpdate(n);
            var d = gantt.ajax.xpath("//data/action", _);
            if (!d.length) return this.cleanUpdate(n);
            for (var l = 0; l < d.length; l++) {
                var g = d[l],
                    i = g.getAttribute("type"),
                    s = g.getAttribute("sid"),
                    r = g.getAttribute("tid");
                t.afterUpdateCallback(s, r, i, g)
            }
            t.finalizeUpdate()
        },
        cleanUpdate: function(t) {
            if (t)
                for (var e = 0; e < t.length; e++) delete this._in_progress[t[e]]
        },
        finalizeUpdate: function() {
            this._waitMode && this._waitMode--, ("tree" == this.obj.mytype || this.obj._h2) && this.updatedRows.length && this.sendData(),
                this.callEvent("onAfterUpdateFinish", []), this.updatedRows.length || this.callEvent("onFullSync", [])
        },
        init: function(t) {
            this.obj = t, this.obj._dp_init && this.obj._dp_init(this)
        },
        setOnAfterUpdate: function(t) {
            this.attachEvent("onAfterUpdate", t)
        },
        enableDebug: function(t) {},
        setOnBeforeUpdateHandler: function(t) {
            this.attachEvent("onBeforeDataSending", t)
        },
        setAutoUpdate: function(t, e) {
            t = t || 2e3, this._user = e || (new Date).valueOf(), this._need_update = !1, this._update_busy = !1, this.attachEvent("onAfterUpdate", function(t, e, n, a) {
                this.afterAutoUpdate(t, e, n, a)
            }), this.attachEvent("onFullSync", function() {
                this.fullSync()
            });
            var n = this;
            window.setInterval(function() {
                n.loadUpdate()
            }, t)
        },
        afterAutoUpdate: function(t, e, n, a) {
            return "collision" == e ? (this._need_update = !0, !1) : !0
        },
        fullSync: function() {
            return this._need_update && (this._need_update = !1, this.loadUpdate()), !0
        },
        getUpdates: function(t, e) {
            return this._update_busy ? !1 : (this._update_busy = !0, void gantt.ajax.get(t, e))
        },
        _v: function(t) {
            return t.firstChild ? t.firstChild.nodeValue : ""
        },
        _a: function(t) {
            for (var e = [], n = 0; n < t.length; n++) e[n] = this._v(t[n]);
            return e
        },
        loadUpdate: function() {
            var t = this,
                e = this.obj.getUserData(0, "version"),
                n = this.serverProcessor + gantt._urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + e].join("&");
            n = n.replace("editing=true&", ""), this.getUpdates(n, function(e) {
                var n = gantt.ajax.xpath("//userdata", e);
                t.obj.setUserData(0, "version", t._v(n[0]));
                var a = gantt.ajax.xpath("//update", e);
                if (a.length) {
                    t._silent_mode = !0;
                    for (var i = 0; i < a.length; i++) {
                        var s = a[i].getAttribute("status"),
                            r = a[i].getAttribute("id"),
                            o = a[i].getAttribute("parent");
                        switch (s) {
                            case "inserted":
                                t.callEvent("insertCallback", [a[i], r, o]);
                                break;
                            case "updated":
                                t.callEvent("updateCallback", [a[i], r, o]);
                                break;
                            case "deleted":
                                t.callEvent("deleteCallback", [a[i], r, o])
                        }
                    }
                    t._silent_mode = !1
                }
                t._update_busy = !1, t = null
            })
        }
    }, gantt._init_dp_live_update_hooks = function(t) {
        t.attachEvent("insertCallback", gantt._insert_callback), t.attachEvent("updateCallback", gantt._update_callback), t.attachEvent("deleteCallback", gantt._delete_callback)
    }, gantt._update_callback = function(t, e) {
        var n = t.data || gantt.xml._xmlNodeToJSON(t.firstChild);
        if (gantt.isTaskExists(e)) {
            var a = gantt.getTask(e);
            for (var i in n) {
                var s = n[i];
                switch (i) {
                    case "id":
                        continue;
                    case "start_date":
                    case "end_date":
                        s = gantt.templates.xml_date(s);
                        break;
                    case "duration":
                        a.end_date = gantt.calculateEndDate(a.start_date, s)
                }
                a[i] = s
            }
            gantt.updateTask(e), gantt.refreshData()
        }
    }, gantt._insert_callback = function(t, e, n, a) {
        var i = t.data || gantt.xml._xmlNodeToJSON(t.firstChild),
            s = {
                add: gantt.addTask,
                isExist: gantt.isTaskExists
            };
        "links" == a && (s.add = gantt.addLink, s.isExist = gantt.isLinkExists), s.isExist.call(gantt, e) || (i.id = e,
            s.add.call(gantt, i))
    }, gantt._delete_callback = function(t, e, n, a) {
        var i = {
            "delete": gantt.deleteTask,
            isExist: gantt.isTaskExists
        };
        "links" == a && (i["delete"] = gantt.deleteLink, i.isExist = gantt.isLinkExists), i.isExist.call(gantt, e) && i["delete"].call(gantt, e)
    }, gantt.assert = function(t, e) {
        t || gantt.config.show_errors && gantt.callEvent("onError", [e]) !== !1 && gantt.message({
            type: "error",
            text: e,
            expire: -1
        })
    }
    , gantt.init = function(t,unit_time,e, n) {
        
        this.config.scale_unit = unit_time;
         this.callEvent("onBeforeGanttReady", []), e && n && (this.config.start_date = this._min_date = new Date(e),
             this.config.end_date = this._max_date = new Date(n)), this._init_skin(), this.date.init(), this.config.scroll_size || (this.config.scroll_size = this._detectScrollSize()), gantt.event(window, "resize", this._on_resize),
            this.init = function(t) {
                 this.$container && this.$container.parentNode && (this.$container.parentNode.removeChild(this.$container), this.$container = null), this._reinit(t, unit_time)
         }, this.init(t, unit_time)
    }, gantt._reinit = function(t,unit_time) {
        this.config.scale_unit = unit_time;
       
        this._init_html_area(t,unit_time), this._set_sizes(), this._clear_renderers(), this.resetLightbox(), this._update_flags(),
            this._init_touch_events(), this._init_templates(), this._init_grid(), this._init_tasks(), this._set_scroll_events(), gantt.event(this.$container, "click", this._on_click), gantt.event(this.$container, "dblclick", this._on_dblclick), gantt.event(this.$container, "mousemove", this._on_mousemove), gantt.event(this.$container, "contextmenu", this._on_contextmenu), this.callEvent("onGanttReady", []), this.render()
    }, gantt._init_html_area = function(t,unit_time) {
        this.config.scale_unit = unit_time;

        "string" == typeof t ? 
        this._obj = document.getElementById(t) : this._obj = t,
         this.assert(this._obj, "Invalid html container: " + t);
        var e = "<div class='gantt_container row'><div class='gantt_grid col-md-3'  ></div><div class='gantt_task col-md-8'></div>";
        e += "<div class='gantt_ver_scroll'><div></div></div><div class='gantt_hor_scroll'><div></div></div></div>",
         this._obj.innerHTML = e, this.$container = this._obj.firstChild;
        var n = this.$container.childNodes;
        this.$grid = n[0], this.$task = n[1], 
        this.$scroll_ver = n[2], this.$scroll_hor = n[3], 
        this.$grid.innerHTML = "<div class='gantt_grid_scale row'></div><div class='gantt_grid_data'></div>", 
        this.$grid_scale = this.$grid.childNodes[0],
            this.$grid_data = this.$grid.childNodes[1],
            this.$task.innerHTML = "<div class='gantt_task_scale'></div><div class='gantt_data_area'><div class='gantt_task_bg'></div><div class='gantt_links_area'></div><div class='gantt_bars_area'></div></div>",
            this.$task_scale = this.$task.childNodes[0],
            this.$task_data = this.$task.childNodes[1], 
            this.$task_bg = this.$task_data.childNodes[0],
            this.$task_links = this.$task_data.childNodes[1],
            this.$task_bars = this.$task_data.childNodes[2]
    }, gantt.$click = {
        buttons: {
            edit: function(t) {
                //gantt.showLightbox(t)
            },
            "delete": function(t) {
               /* var e = gantt.locale.labels.confirm_deleting,
                    n = gantt.locale.labels.confirm_deleting_title;
                gantt._dhtmlx_confirm(e, n, function() {
                    if (!gantt.isTaskExists(t)) return void gantt.hideLightbox();
                    var e = gantt.getTask(t);
                    e.$new ? (gantt._deleteTask(t, !0), gantt.refreshData()) : gantt.deleteTask(t), gantt.hideLightbox()
                })*/
            }
        }
    }, gantt._calculate_content_height = function() {
        var t = this.config.scale_height,
            e = this._order.length * this.config.row_height,
            n = this._scroll_hor ? this.config.scroll_size + 1 : 0;
        return this._is_grid_visible() || this._is_chart_visible() ? t + e + 2 + n : 0
    }, gantt._calculate_content_width = function() {
        var t = this._get_grid_width(),
            e = this._tasks ? this._tasks.full_width : 0;
        this._scroll_ver ? this.config.scroll_size + 1 : 0;


        return this._is_chart_visible() || (e = 0), this._is_grid_visible() || (t = 0), t + e + 1
    }, gantt._get_resize_options = function() {
        var t = {
            x: !1,
            y: !1
        };
        return "xy" == this.config.autosize ? t.x = t.y = !0 : "y" == this.config.autosize || this.config.autosize === !0 ? t.y = !0 : "x" == this.config.autosize && (t.x = !0), t
    }, gantt._clean_el_size = function(t) {
        return 1 * (t || "").toString().replace("px", "") || 0
    }, gantt._get_box_styles = function() {
        var t = null;
        t = window.getComputedStyle ? window.getComputedStyle(this._obj, null) : {
            width: this._obj.clientWidth,
            height: this._obj.clientHeight
        };
        var e = ["width", "height", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
            n = {
                boxSizing: "border-box" == t.boxSizing
            };
        t.MozBoxSizing && (n.boxSizing = "border-box" == t.MozBoxSizing);
        for (var a = 0; a < e.length; a++) n[e[a]] = t[e[a]] ? this._clean_el_size(t[e[a]]) : 0;
        var i = {
            horPaddings: n.paddingLeft + n.paddingRight + n.borderLeftWidth + n.borderRightWidth,
            vertPaddings: n.paddingTop + n.paddingBottom + n.borderTopWidth + n.borderBottomWidth,
            borderBox: n.boxSizing,
            innerWidth: n.width,
           // innerHeight: n.height,
            outerWidth: n.width,
            outerHeight: n.height
        };

        return i.borderBox ? (i.innerWidth -= i.horPaddings, i.innerHeight -= i.vertPaddings) : (i.outerWidth += i.horPaddings, i.outerHeight += i.vertPaddings), i
    }, gantt._do_autosize = function() {
        var t = this._get_resize_options(),
            e = this._get_box_styles();
        if (t.y) {
            var n = this._calculate_content_height();
            e.borderBox && (n += e.vertPaddings), this._obj.style.height = n + "px"
        }
        if (t.x) {
            var a = this._calculate_content_width();
            e.borderBox && (a += e.horPaddings), this._obj.style.width = a + "px"
        }
    }, gantt._set_sizes = function() {
        this._do_autosize();
        var t = this._get_box_styles();
        if (this._y = t.innerHeight, !(this._y < 20)) {
            this.$grid.style.height = this.$task.style.height = Math.max(this._y - this.$scroll_hor.offsetHeight - 2, 0) + "px";
            var e = Math.max(this._y - (this.config.scale_height || 0) - this.$scroll_hor.offsetHeight - 2, 0);
            this.$grid_data.style.height = this.$task_data.style.height = e + "px";
            var n = Math.max(this._get_grid_width() - 1, 0);
          //  this.$grid.style.width = n + "px", this.$grid.style.display = 0 === n ? "none" : "", t = this._get_box_styles(), this._x = t.innerWidth, this._x < 20 || (this.$grid_data.style.width = Math.max(this._get_grid_width() - 1, 0) + "px", this.$task.style.width = Math.max(this._x - this._get_grid_width() - 2, 0) + "px")
        }
    }, gantt.getScrollState = function() {
        return this.$task && this.$task_data ? {
            x: this.$task.scrollLeft,
            y: this.$task_data.scrollTop
        } : null
    }, gantt._save_scroll_state = function(t, e) {
        var n = {};
        this._cached_scroll_pos = this._cached_scroll_pos || {}, void 0 !== t && (n.x = Math.max(t, 0)), void 0 !== e && (n.y = Math.max(e, 0)), this.mixin(this._cached_scroll_pos, n, !0)
    }, gantt._restore_scroll_state = function() {
        var t = {
            x: 0,
            y: 0
        };
        return this._cached_scroll_pos && (t.x = this._cached_scroll_pos.x || t.x, t.y = this._cached_scroll_pos.y || t.y), t
    }, gantt.scrollTo = function(t, e) {
        var n = this._restore_scroll_state();
        1 * t == t && (this.$task.scrollLeft = t, this._save_scroll_state(t, void 0)),
            1 * e == e && (this.$task_data.scrollTop = e, this.$grid_data.scrollTop = e, gantt.config.smart_rendering && this.$grid_data.scrollTop != e && (this.$grid_data.scrollTop = e % gantt.config.row_height), this._save_scroll_state(void 0, this.$task_data.scrollTop));
        var a = gantt._restore_scroll_state();
        this.callEvent("onGanttScroll", [n.x, n.y, a.x, a.y])
    }, gantt.showDate = function(t) {
        var e = this.posFromDate(t),
            n = Math.max(e - this.config.task_scroll_offset, 0);
        this.scrollTo(n)
    }, gantt.showTask = function(t) {
        var e = this.getTaskNode(t);
        if (e) {
            var n = Math.max(e.offsetLeft - this.config.task_scroll_offset, 0),
                a = e.offsetTop - (this.$task_data.offsetHeight - this.config.row_height) / 2;
            this.scrollTo(n, a)
        }
    }, gantt._on_resize = gantt.setSizes = function() {
        gantt._set_sizes(), gantt._scroll_resize()
    }, gantt.render = function() {
        if (this._is_render_active()) {
            this.callEvent("onBeforeGanttRender", []);
            var t = this.copy(this._restore_scroll_state()),
                e = null;
            if (t && (e = gantt.dateFromPos(t.x + this.config.task_scroll_offset)), this._render_grid(), this._render_tasks_scales(), this._scroll_resize(),
                this._on_resize(), this._render_data(), this.config.preserve_scroll && t) {
                var n = gantt._restore_scroll_state(),
                    a = gantt.dateFromPos(n.x);
                (+e != +a || n.y != t.y) && (e && this.showDate(e), gantt.scrollTo(void 0, t.y))
            }
            this.callEvent("onGanttRender", [])
        }
    }, gantt._set_scroll_events = function() {
        function t(t) {
            var n = gantt._get_resize_options();
            gantt._wheel_time = new Date;
            var a = e ? -20 * t.deltaX : 2 * t.wheelDeltaX,
                i = e ? -40 * t.deltaY : t.wheelDelta;
            if (a && Math.abs(a) > Math.abs(i)) {
                if (n.x) return !0;
                if (!gantt.$scroll_hor || !gantt.$scroll_hor.offsetWidth) return !0;
                var s = a / -40,
                    r = gantt.$task.scrollLeft,
                    o = r + 30 * s;
                //if (gantt.scrollTo(o, null), gantt.$scroll_hor.scrollLeft = o, r == gantt.$task.scrollLeft) return !0
            } else {
                if (n.y) return !0;
                if (!gantt.$scroll_ver || !gantt.$scroll_ver.offsetHeight) return !0;
                var s = i / -40;
                "undefined" == typeof i && (s = t.detail);
                var _ = gantt.$scroll_ver.scrollTop,
                    d = gantt.$scroll_ver.scrollTop + 30 * s;
                if (!gantt.config.prevent_default_scroll && gantt._cached_scroll_pos && (gantt._cached_scroll_pos.y == d || gantt._cached_scroll_pos.y <= 0 && 0 >= d)) return !0;
                if (gantt.scrollTo(null, d),
                    gantt.$scroll_ver.scrollTop = d, _ == gantt.$scroll_ver.scrollTop) return !0
            }
            return t.preventDefault && t.preventDefault(), t.cancelBubble = !0, !1
        }
        this.event(this.$scroll_hor, "scroll", function() {
            if (new Date - (gantt._wheel_time || 0) < 100) return !0;
            if (!gantt._touch_scroll_active) {
                var t = gantt.$scroll_hor.scrollLeft;
                gantt.scrollTo(t)
            }
        }), this.event(this.$scroll_ver, "scroll", function() {
            if (!gantt._touch_scroll_active) {
                var t = gantt.$scroll_ver.scrollTop;
                gantt.$grid_data.scrollTop = t, gantt.scrollTo(null, t)
            }
        }), this.event(this.$task, "scroll", function() {
            var t = gantt.$task.scrollLeft,
                e = gantt.$scroll_hor.scrollLeft;
            e != t && (gantt.$scroll_hor.scrollLeft = t)
        }), this.event(this.$task_data, "scroll", function() {
            var t = gantt.$task_data.scrollTop,
                e = gantt.$scroll_ver.scrollTop;
            e != t && (gantt.$scroll_ver.scrollTop = t)
        });
        var e = gantt.env.isFF;
        e ? this.event(gantt.$container, "wheel", t) : this.event(gantt.$container, "mousewheel", t)
    }, gantt._scroll_resize = function() {
        if (!(this._x < 20 || this._y < 20)) {
            var t = this._scroll_sizes();
            t.x ? (this.$scroll_hor.style.display = "block", this.$scroll_hor.style.height = t.scroll_size + "px",
                this.$scroll_hor.style.width = t.x + "px", this.$scroll_hor.firstChild.style.width = t.x_inner + "px") : (this.$scroll_hor.style.display = "none", this.$scroll_hor.style.height = this.$scroll_hor.style.width = "0px"), t.y ? (this.$scroll_ver.style.display = "block", this.$scroll_ver.style.width = t.scroll_size + "px", this.$scroll_ver.style.height = t.y + "px", this.$scroll_ver.style.top = this.config.scale_height + "px", this.$scroll_ver.firstChild.style.height = t.y_inner + "px") : (this.$scroll_ver.style.display = "none", this.$scroll_ver.style.width = this.$scroll_ver.style.height = "0px");
        }
    }, gantt._scroll_sizes = function() {
        var t = this._get_grid_width(),
            e = Math.max(this._x - t, 0),
            n = Math.max(this._y - this.config.scale_height, 0),
            a = this.config.scroll_size + 1,
            i = Math.max(this.$task_data.offsetWidth - a, 0),
            s = this.config.row_height * this._order.length,
            r = this._get_resize_options(),
            o = this._scroll_hor = r.x ? !1 : i > e,
            _ = this._scroll_ver = r.y ? !1 : s > n,
            d = {
                x: !1,
                y: !1,
                scroll_size: a,
                x_inner: i + t + a + 2,
                y_inner: this.config.scale_height + s
            };
        return o && (d.x = Math.max(this._x - (_ ? a : 2), 0)), _ && (d.y = Math.max(this._y - (o ? a : 0) - this.config.scale_height, 0)),
            d
    }, gantt._getClassName = function(t) {
        if (!t) return "";
        var e = t.className || "";
        return e.baseVal && (e = e.baseVal), e.indexOf || (e = ""), gantt._trim(e)
    }, gantt.locate = function(t) {
        var e = gantt._get_target_node(t),
            n = gantt._getClassName(e);
        if ((n || "").indexOf("gantt_task_cell") >= 0) return null;
        for (var a = arguments[1] || this.config.task_attribute; e;) {
            if (e.getAttribute) {
                var i = e.getAttribute(a);
                if (i) return i
            }
            e = e.parentNode
        }
        return null
    }, gantt._get_target_node = function(t) {
        var e;
        return t.tagName ? e = t : (t = t || window.event, e = t.target || t.srcElement),
            e
    }, gantt._trim = function(t) {
        var e = String.prototype.trim || function() {
            return this.replace(/^\s+|\s+$/g, "")
        };
        return e.apply(t)
    }, gantt._locate_css = function(t, e, n) {
        void 0 === n && (n = !0);
        for (var a = gantt._get_target_node(t), i = ""; a;) {
            if (i = gantt._getClassName(a)) {
                var s = i.indexOf(e);
                if (s >= 0) {
                    if (!n) return a;
                    var r = 0 === s || !gantt._trim(i.charAt(s - 1)),
                        o = s + e.length >= i.length || !gantt._trim(i.charAt(s + e.length));
                    if (r && o) return a
                }
            }
            a = a.parentNode
        }
        return null
    }, gantt._locateHTML = function(t, e) {
        var n = gantt._get_target_node(t);
        for (e = e || this.config.task_attribute; n;) {
            if (n.getAttribute) {
                var a = n.getAttribute(e);
                if (a) return n
            }
            n = n.parentNode
        }
        return null
    }, gantt.getTaskRowNode = function(t) {
        for (var e = this.$grid_data.childNodes, n = this.config.task_attribute, a = 0; a < e.length; a++)
            if (e[a].getAttribute) {
                var i = e[a].getAttribute(n);
                if (i == t) return e[a]
            }
        return null
    }, gantt.getState = function() {
        return {
            drag_id: this._tasks_dnd.drag.id,
            drag_mode: this._tasks_dnd.drag.mode,
            drag_from_start: this._tasks_dnd.drag.left,
            selected_task: this._selected_task,
            min_date: new Date(this._min_date),
            max_date: new Date(this._max_date),
            lightbox: this._lightbox_id,
            touch_drag: this._touch_drag
        }
    }, gantt._checkTimeout = function(t, e) {
        if (!e) return !0;
        var n = 1e3 / e;
        return 1 > n ? !0 : t._on_timeout ? !1 : (setTimeout(function() {
            delete t._on_timeout
        }, n), t._on_timeout = !0, !0)
    }, gantt.selectTask = function(t) {
        if (!this.config.select_task) return !1;
        if (t) {
            if (this._selected_task == t) return this._selected_task;
            if (!this.callEvent("onBeforeTaskSelected", [t])) return !1;
            this.unselectTask(), this._selected_task = t,
                this.refreshTask(t), this.callEvent("onTaskSelected", [t])
        }
        return this._selected_task
    }, gantt.unselectTask = function(t) {
        var t = t || this._selected_task;
        t && (this._selected_task = null, this.refreshTask(t), this.callEvent("onTaskUnselected", [t]))
    }, gantt.getSelectedId = function() {
        return this.defined(this._selected_task) ? this._selected_task : null
    }, gantt.changeLightboxType = function(t) {
        return this.getLightboxType() == t ? !0 : void gantt._silent_redraw_lightbox(t)
    }, gantt._is_render_active = function() {
        return !this._skip_render;
    }, gantt._correct_dst_change = function(t, e, n, a) {
        var i = gantt._get_line(a) * n;
        if (i > 3600 && 86400 > i) {
            var s = t.getTimezoneOffset() - e;
            s && (t = gantt.date.add(t, s, "minute"))
        }
        return t
    }, gantt.batchUpdate = function(t, e) {
        var n, a = this._dp && "off" != this._dp.updateMode;
        a && (n = this._dp.updateMode, this._dp.setUpdateMode("off"));
        var i = this._sync_order;
        this._sync_order = function() {};
        var s = this._sync_links;
        this._sync_links = function() {};
        var r = this._adjust_scales;
        this._adjust_scales = function() {};
        var o = {},
            _ = this.resetProjectDates;
        this.resetProjectDates = function(t) {
            o[t.id] = t
        }, this._skip_render = !0, this.callEvent("onBeforeBatchUpdate", []);
        try {
            t()
        } catch (d) {}
        this.callEvent("onAfterBatchUpdate", []), this._sync_order = i, this._sync_order(), this._sync_links = s, this._sync_links(), this.resetProjectDates = _;
        for (var l in o) this.resetProjectDates(o[l]);
        this._adjust_scales = r, this._adjust_scales(), this._skip_render = !1, e || this.render(), a && (this._dp.setUpdateMode(n), this._dp.setGanttMode("tasks"), this._dp.sendData(), this._dp.setGanttMode("links"),
            this._dp.sendData())
    }, gantt.env = {
        isIE: navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0,
        isIE6: !window.XMLHttpRequest && navigator.userAgent.indexOf("MSIE") >= 0,
        isIE7: navigator.userAgent.indexOf("MSIE 7.0") >= 0 && navigator.userAgent.indexOf("Trident") < 0,
        isIE8: navigator.userAgent.indexOf("MSIE 8.0") >= 0 && navigator.userAgent.indexOf("Trident") >= 0,
        isOpera: navigator.userAgent.indexOf("Opera") >= 0,
        isChrome: navigator.userAgent.indexOf("Chrome") >= 0,
        isKHTML: navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0,
        isFF: navigator.userAgent.indexOf("Firefox") >= 0,
        isIPad: navigator.userAgent.search(/iPad/gi) >= 0,
        isEdge: -1 != navigator.userAgent.indexOf("Edge")
    }, gantt.ajax = {
        cache: !0,
        method: "get",
        parse: function(t) {
            if ("string" != typeof t) return t;
            var e;
            return t = t.replace(/^[\s]+/, ""), window.DOMParser && !gantt.env.isIE ? e = (new window.DOMParser).parseFromString(t, "text/xml") : window.ActiveXObject !== window.undefined && (e = new window.ActiveXObject("Microsoft.XMLDOM"), e.async = "false", e.loadXML(t)), e
        },
        xmltop: function(t, e, n) {
            if ("undefined" == typeof e.status || e.status < 400) {
                var a = e.responseXML ? e.responseXML || e : gantt.ajax.parse(e.responseText || e);
                if (a && null !== a.documentElement && !a.getElementsByTagName("parsererror").length) return a.getElementsByTagName(t)[0]
            }
            return -1 !== n && gantt.callEvent("onLoadXMLError", ["Incorrect XML", arguments[1], n]), document.createElement("DIV")
        },
        xpath: function(t, e) {
            if (e.nodeName || (e = e.responseXML || e), gantt.env.isIE) return e.selectNodes(t) || [];
            for (var n, a = [], i = (e.ownerDocument || e).evaluate(t, e, null, XPathResult.ANY_TYPE, null);;) {
                if (n = i.iterateNext(), !n) break;
                a.push(n)
            }
            return a
        },
        query: function(t) {
            gantt.ajax._call(t.method || "GET", t.url, t.data || "", t.async || !0, t.callback, null, t.headers)
        },
        get: function(t, e) {
            this._call("GET", t, null, !0, e)
        },
        getSync: function(t) {
            return this._call("GET", t, null, !1)
        },
        put: function(t, e, n) {
            this._call("PUT", t, e, !0, n)
        },
        del: function(t, e, n) {
            this._call("DELETE", t, e, !0, n)
        },
        post: function(t, e, n) {
            1 == arguments.length ? e = "" : 2 != arguments.length || "function" != typeof e && "function" != typeof window[e] ? e = String(e) : (n = e, e = ""), this._call("POST", t, e, !0, n);
        },
        postSync: function(t, e) {
            return e = null === e ? "" : String(e), this._call("POST", t, e, !1)
        },
        getLong: function(t, e) {
            this._call("GET", t, null, !0, e, {
                url: t
            })
        },
        postLong: function(t, e, n) {
            2 == arguments.length && (n = e, e = ""), this._call("POST", t, e, !0, n, {
                url: t,
                postData: e
            })
        },
        _call: function(t, e, n, a, i, s, r) {
            var o = window.XMLHttpRequest && !gantt.env.isIE ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"),
                _ = null !== navigator.userAgent.match(/AppleWebKit/) && null !== navigator.userAgent.match(/Qt/) && null !== navigator.userAgent.match(/Safari/);
            if (a && (o.onreadystatechange = function() {
                    if (4 == o.readyState || _ && 3 == o.readyState) {
                        if ((200 != o.status || "" === o.responseText) && !gantt.callEvent("onAjaxError", [o])) return;
                        window.setTimeout(function() {
                            "function" == typeof i && i.apply(window, [{
                                xmlDoc: o,
                                filePath: e
                            }]), s && ("undefined" != typeof s.postData ? gantt.ajax.postLong(s.url, s.postData, i) : gantt.ajax.getLong(s.url, i)), i = null, o = null
                        }, 1)
                    }
                }), "GET" != t || this.cache || (e += (e.indexOf("?") >= 0 ? "&" : "?") + "dhxr" + (new Date).getTime() + "=1"), o.open(t, e, a), r)
                for (var d in r) o.setRequestHeader(d, r[d]);
            else "POST" == t.toUpperCase() || "PUT" == t || "DELETE" == t ? o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : "GET" == t && (n = null);
            return o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.send(n), a ? void 0 : {
                xmlDoc: o,
                filePath: e
            }
        }
    }, gantt._urlSeparator = function(t) {
        return -1 != t.indexOf("?") ? "&" : "?"
    },
    function() {
        function t(t, e) {
            var a = t.callback;
            n(!1), t.box.parentNode.removeChild(t.box), h = t.box = null, a && a(e)
        }

        function e(e) {
            if (h) {
                e = e || event;
                var n = e.which || event.keyCode;
                return gantt.message.keyboard && ((13 == n || 32 == n) && t(h, !0), 27 == n && t(h, !1)), e.preventDefault && e.preventDefault(), !(e.cancelBubble = !0)
            }
        }

        function n(t) {
            n.cover || (n.cover = document.createElement("DIV"),
                n.cover.onkeydown = e, n.cover.className = "dhx_modal_cover", document.body.appendChild(n.cover));
            document.body.scrollHeight;
            n.cover.style.display = t ? "inline-block" : "none"
        }

        function a(t, e) {
            
            var n = "gantt_" + t.toLowerCase().replace(/ /g, "_") + "_button dhtmlx_" + t.toLowerCase().replace(/ /g, "_") + "_button";
            return "<div class='gantt_popup_button dhtmlx_popup_button " + n + "' result='" + e + "' ><div>" + t + "</div></div>"
        }

        function i(t) {
            c.area || (c.area = document.createElement("DIV"), c.area.className = "gantt_message_area dhtmlx_message_area",
                c.area.style[c.position] = "5px", document.body.appendChild(c.area)), c.hide(t.id);
            var e = document.createElement("DIV");
            return e.innerHTML = "<div>" + t.text + "</div>", e.className = "gantt-info dhtmlx-info gantt-" + t.type + " dhtmlx-" + t.type, e.onclick = function() {
                c.hide(t.id), t = null
            }, "bottom" == c.position && c.area.firstChild ? c.area.insertBefore(e, c.area.firstChild) : c.area.appendChild(e), t.expire > 0 && (c.timers[t.id] = window.setTimeout(function() {
                c.hide(t.id)
            }, t.expire)), c.pull[t.id] = e, e = null, t.id
        }

        function s(e, n, i) {
            var s = document.createElement("DIV");
            s.className = " gantt_modal_box dhtmlx_modal_box gantt-" + e.type + " dhtmlx-" + e.type, s.setAttribute("dhxbox", 1);
            var r = "";
            if (e.width && (s.style.width = e.width), e.height && (s.style.height = e.height), e.title && (r += '<div class="gantt_popup_title dhtmlx_popup_title">' + e.title + "</div>"), r += '<div class="gantt_popup_text dhtmlx_popup_text"><span>' + (e.content ? "" : e.text) + '</span></div><div  class="gantt_popup_controls dhtmlx_popup_controls">', n && (r += a(e.ok || "OK", !0)), i && (r += a(e.cancel || "Cancel", !1)), e.buttons)
                for (var o = 0; o < e.buttons.length; o++) r += a(e.buttons[o], o);
            if (r += "</div>", s.innerHTML = r, e.content) {
                var _ = e.content;
                "string" == typeof _ && (_ = document.getElementById(_)), "none" == _.style.display && (_.style.display = ""), s.childNodes[e.title ? 1 : 0].appendChild(_)
            }
            return s.onclick = function(n) {
                n = n || event;
                var a = n.target || n.srcElement;
                if (a.className || (a = a.parentNode), "gantt_popup_button" == a.className.split(" ")[0]) {
                    var i = a.getAttribute("result");
                    i = "true" == i || ("false" == i ? !1 : i), t(e, i)
                }
            }, e.box = s, (n || i) && (h = e), s
        }

        function r(t, a, i) {
            var r = t.tagName ? t : s(t, a, i);
            t.hidden || n(!0),
                document.body.appendChild(r);
            var o = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - r.offsetWidth) / 2)),
                _ = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - r.offsetHeight) / 2));
            return "top" == t.position ? r.style.top = "-3px" : r.style.top = _ + "px", r.style.left = o + "px", r.onkeydown = e, r.focus(), t.hidden && gantt.modalbox.hide(r), r
        }

        function o(t) {
            return r(t, !0, !1)
        }

        function _(t) {
            return r(t, !0, !0)
        }

        function d(t) {
            return r(t)
        }

        function l(t, e, n) {
            return "object" != typeof t && ("function" == typeof e && (n = e,
                e = ""), t = {
                text: t,
                type: e,
                callback: n
            }), t
        }

        function g(t, e, n, a) {
            return "object" != typeof t && (t = {
                text: t,
                type: e,
                expire: n,
                id: a
            }), t.id = t.id || c.uid(), t.expire = t.expire || c.expire, t
        }
        var h = null;
        document.attachEvent ? document.attachEvent("onkeydown", e) : document.addEventListener("keydown", e, !0), gantt.alert = function() {
            var t = l.apply(this, arguments);
            return t.type = t.type || "confirm", o(t)
        }, gantt.confirm = function() {
            var t = l.apply(this, arguments);
            return t.type = t.type || "alert", _(t)
        }, gantt.modalbox = function() {
            var t = l.apply(this, arguments);
            return t.type = t.type || "alert", d(t)
        }, gantt.modalbox.hide = function(t) {
            for (; t && t.getAttribute && !t.getAttribute("dhxbox");) t = t.parentNode;
            t && (t.parentNode.removeChild(t), n(!1))
        };
        var c = gantt.message = function(t, e, n, a) {
            t = g.apply(this, arguments), t.type = t.type || "info";
            var s = t.type.split("-")[0];
            switch (s) {
                case "alert":
                    return o(t);
                case "confirm":
                    return _(t);
                case "modalbox":
                    return d(t);
                default:
                    return i(t)
            }
        };
        c.seed = (new Date).valueOf(), c.uid = function() {
                return c.seed++
            }, c.expire = 4e3, c.keyboard = !0, c.position = "top",
            c.pull = {}, c.timers = {}, c.hideAll = function() {
                for (var t in c.pull) c.hide(t)
            }, c.hide = function(t) {
                var e = c.pull[t];
                e && e.parentNode && (window.setTimeout(function() {
                    e.parentNode.removeChild(e), e = null
                }, 2e3), e.className += " hidden", c.timers[t] && window.clearTimeout(c.timers[t]), delete c.pull[t])
            }
    }(), gantt.date = {
        init: function() {
            for (var t = gantt.locale.date.month_short, e = gantt.locale.date.month_short_hash = {}, n = 0; n < t.length; n++) e[t[n]] = n;
            for (var t = gantt.locale.date.month_full, e = gantt.locale.date.month_full_hash = {}, n = 0; n < t.length; n++) e[t[n]] = n;
        },
        date_part: function(t) {
            var e = new Date(t);
            return t.setHours(0), this.hour_start(t), t.getHours() && (t.getDate() < e.getDate() || t.getMonth() < e.getMonth() || t.getFullYear() < e.getFullYear()) && t.setTime(t.getTime() + 36e5 * (24 - t.getHours())), t
        },
        time_part: function(t) {
            return (t.valueOf() / 1e3 - 60 * t.getTimezoneOffset()) % 86400
        },
        week_start: function(t) {
            var e = t.getDay();
            return gantt.config.start_on_monday && (0 === e ? e = 6 : e--), this.date_part(this.add(t, -1 * e, "day"))
        },
        month_start: function(t) {
            return t.setDate(1), this.date_part(t);
        },
        year_start: function(t) {
            return t.setMonth(0), this.month_start(t)
        },
        day_start: function(t) {
            return this.date_part(t)
        },
        hour_start: function(t) {
            return t.getMinutes() && t.setMinutes(0), this.minute_start(t), t
        },
        minute_start: function(t) {
            return t.getSeconds() && t.setSeconds(0), t.getMilliseconds() && t.setMilliseconds(0), t
        },
        _add_days: function(t, e) {
            var n = new Date(t.valueOf());
            return n.setDate(n.getDate() + e), e >= 0 && !t.getHours() && n.getHours() && (n.getDate() <= t.getDate() || n.getMonth() < t.getMonth() || n.getFullYear() < t.getFullYear()) && n.setTime(n.getTime() + 36e5 * (24 - n.getHours())),
                n
        },
        add: function(t, e, n) {
            var a = new Date(t.valueOf());
            switch (n) {
                case "day":
                    a = gantt.date._add_days(a, e);
                    break;
                case "week":
                    a = gantt.date._add_days(a, 7 * e);
                    break;
                case "month":
                    a.setMonth(a.getMonth() + e);
                    break;
                case "year":
                    a.setYear(a.getFullYear() + e);
                    break;
                case "hour":
                    a.setTime(a.getTime() + 60 * e * 60 * 1e3);
                    break;
                case "minute":
                    a.setTime(a.getTime() + 60 * e * 1e3);
                    break;
                default:
                    return gantt.date["add_" + n](t, e, n)
            }
            return a
        },
        to_fixed: function(t) {
            return 10 > t ? "0" + t : t
        },
        copy: function(t) {
            return new Date(t.valueOf())
        },
        date_to_str: function(t, e) {
            return t = t.replace(/%[a-zA-Z]/g, function(t) {
                switch (t) {
                    case "%d":
                        return '"+gantt.date.to_fixed(date.getDate())+"';
                    case "%m":
                        return '"+gantt.date.to_fixed((date.getMonth()+1))+"';
                    case "%j":
                        return '"+date.getDate()+"';
                    case "%n":
                        return '"+(date.getMonth()+1)+"';
                    case "%y":
                        return '"+gantt.date.to_fixed(date.getFullYear()%100)+"';
                    case "%Y":
                        return '"+date.getFullYear()+"';
                    case "%D":
                        return '"+gantt.locale.date.day_short[date.getDay()]+"';
                    case "%l":
                        return '"+gantt.locale.date.day_full[date.getDay()]+"';
                    case "%M":
                        return '"+gantt.locale.date.month_short[date.getMonth()]+"';
                    case "%F":
                        return '"+gantt.locale.date.month_full[date.getMonth()]+"';
                    case "%h":
                        return '"+gantt.date.to_fixed((date.getHours()+11)%12+1)+"';
                    case "%g":
                        return '"+((date.getHours()+11)%12+1)+"';
                    case "%G":
                        return '"+date.getHours()+"';
                    case "%H":
                        return '"+gantt.date.to_fixed(date.getHours())+"';
                    case "%i":
                        return '"+gantt.date.to_fixed(date.getMinutes())+"';
                    case "%a":
                        return '"+(date.getHours()>11?"pm":"am")+"';
                    case "%A":
                        return '"+(date.getHours()>11?"PM":"AM")+"';
                    case "%s":
                        return '"+gantt.date.to_fixed(date.getSeconds())+"';
                    case "%W":
                        return '"+gantt.date.to_fixed(gantt.date.getISOWeek(date))+"';
                    default:
                        return t
                }
            }), e && (t = t.replace(/date\.get/g, "date.getUTC")), new Function("date", 'return "' + t + '";')
        },
        str_to_date: function(t, e) {
            for (var n = "var temp=date.match(/[a-zA-Z]+|[0-9]+/g);", a = t.match(/%[a-zA-Z]/g), i = 0; i < a.length; i++) switch (a[i]) {
                case "%j":
                case "%d":
                    n += "set[2]=temp[" + i + "]||1;";
                    break;
                case "%n":
                case "%m":
                    n += "set[1]=(temp[" + i + "]||1)-1;";
                    break;
                case "%y":
                    n += "set[0]=temp[" + i + "]*1+(temp[" + i + "]>50?1900:2000);";
                    break;
                case "%g":
                case "%G":
                case "%h":
                case "%H":
                    n += "set[3]=temp[" + i + "]||0;";
                    break;
                case "%i":
                    n += "set[4]=temp[" + i + "]||0;";
                    break;
                case "%Y":
                    n += "set[0]=temp[" + i + "]||0;";
                    break;
                case "%a":
                case "%A":
                    n += "set[3]=set[3]%12+((temp[" + i + "]||'').toLowerCase()=='am'?0:12);";
                    break;
                case "%s":
                    n += "set[5]=temp[" + i + "]||0;";
                    break;
                case "%M":
                    n += "set[1]=gantt.locale.date.month_short_hash[temp[" + i + "]]||0;";
                    break;
                case "%F":
                    n += "set[1]=gantt.locale.date.month_full_hash[temp[" + i + "]]||0;"
            }
            var s = "set[0],set[1],set[2],set[3],set[4],set[5]";
            return e && (s = " Date.UTC(" + s + ")"),
                new Function("date", "var set=[0,0,1,0,0,0]; " + n + " return new Date(" + s + ");")
        },
        getISOWeek: function(t) {
            if (!t) return !1;
            var e = t.getDay();
            0 === e && (e = 7);
            var n = new Date(t.valueOf());
            n.setDate(t.getDate() + (4 - e));
            var a = n.getFullYear(),
                i = Math.round((n.getTime() - new Date(a, 0, 1).getTime()) / 864e5),
                s = 1 + Math.floor(i / 7);
            return s
        },
        getUTCISOWeek: function(t) {
            return this.getISOWeek(t)
        },
        convert_to_utc: function(t) {
            return new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds());
        },
        parseDate: function(t, e) {
            return "string" == typeof t && (gantt.defined(e) && (e = "string" == typeof e ? gantt.defined(gantt.templates[e]) ? gantt.templates[e] : gantt.date.str_to_date(e) : gantt.templates.xml_date), t = t ? e(t) : null), t
        }
    }, gantt.date.quarter_start = function(t) {
        gantt.date.month_start(t);
        var e, n = t.getMonth();
        return e = n >= 9 ? 9 : n >= 6 ? 6 : n >= 3 ? 3 : 0, t.setMonth(e), t
    }, gantt.date.add_quarter = function(t, e) {
        return gantt.date.add(t, 3 * e, "month")
    }, gantt.config || (gantt.config = {}), gantt.config || (gantt.config = {}), gantt.templates || (gantt.templates = {}),
    function() {
        gantt.mixin(gantt.config, {
            links: {
                finish_to_start: "0",
                start_to_start: "1",
                finish_to_finish: "2",
                start_to_finish: "3"
            },
            types: {
                task: "task",
                project: "project",
                milestone: "milestone"
            },
            duration_unit: "hour",
            work_time: !1,
            correct_work_time: !1,
            skip_off_time: !1,
            autosize: !1,
            autosize_min_width: 0,
            show_links: !0,
            show_task_cells: !0,
            static_background: !1,
            branch_loading: !1,
            show_loading: !1,
            show_chart: !0,
            show_grid: !0,
            min_duration: 36e5,
            xml_date: "%d-%m-%Y %H:%i",
            api_date: "%d-%m-%Y %H:%i",
            start_on_monday: !0,
            server_utc: !1,
            show_progress: !0,
            fit_tasks: !1,
            select_task: !0,
            scroll_on_click: !0,
            preserve_scroll: !0,
            readonly: !1,
            date_grid: "%Y-%m-%d",
            drag_links: !0,
            drag_progress: !0,
            drag_resize: !0,
            drag_move: !0,
            drag_mode: {
                resize: "resize",
                progress: "progress",
                move: "move",
                ignore: "ignore"
            },
            round_dnd_dates: !0,
            link_wrapper_width: 20,
            root_id: 0,
            autofit: !1,
            columns: [{
                name: "text",
                tree: !0,
                width: "*",
                resize: !0
            }, {
                name: "start_date",
                align: "center",
                resize: !0
            }, {
                name: "duration",
                align: "center"
            }, {
                name: "add",
                width: "44"
            }],
            step: 1,
            scale_unit: "hour",
            scale_offset_minimal: !0,
            subscales: [],
            inherit_scale_class: !1,
            time_step: 60,
            duration_step: 1,
            date_scale: labelTimeHeader,
            task_date: "%d %F %Y",
            time_picker: "%H:%i",
            task_attribute: "task_id",
            link_attribute: "link_id",
            layer_attribute: "data-layer",
            buttons_left: ["gantt_save_btn", "gantt_cancel_btn"],
            _migrate_buttons: {
                dhx_save_btn: "gantt_save_btn",
                dhx_cancel_btn: "gantt_cancel_btn",
                dhx_delete_btn: "gantt_delete_btn"
            },
            buttons_right: ["gantt_delete_btn"],
            lightbox: {
                sections: [{
                    name: "description",
                    height: 70,
                    map_to: "text",
                    type: "textarea",
                    focus: !0
                }, {
                    name: "time",
                    type: "duration",
                    map_to: "auto"
                }],
                project_sections: [{
                    name: "description",
                    height: 70,
                    map_to: "text",
                    type: "textarea",
                    focus: !0
                }, {
                    name: "type",
                    type: "typeselect",
                    map_to: "type"
                }, {
                    name: "time",
                    type: "duration",
                    readonly: !0,
                    map_to: "auto"
                }],
                milestone_sections: [{
                    name: "description",
                    height: 70,
                    map_to: "text",
                    type: "textarea",
                    focus: !0
                }, {
                    name: "type",
                    type: "typeselect",
                    map_to: "type"
                }, {
                    name: "time",
                    type: "duration",
                    single_date: !0,
                    map_to: "auto"
                }]
            },
            drag_lightbox: !0,
            sort: !1,
            details_on_create: !0,
            details_on_dblclick: !0,
            initial_scroll: !0,
            task_scroll_offset: 100,
            order_branch: !1,
            order_branch_free: !1,
            task_height: "full",
            min_column_width: 70,
            min_grid_column_width: 70,
            grid_resizer_column_attribute: "column_index",
            grid_resizer_attribute: "grid_resizer",
            keep_grid_width: !1,
            grid_resize: !1,
            show_unscheduled: !0,
            readonly_property: "readonly",
            /*****/
            editable_property: "readonly",
            type_renderers: {},
            open_tree_initially: !1,
            optimize_render: !0,
            prevent_default_scroll: !1,
            show_errors: !0
        }), gantt.keys = {
            edit_save: 13,
            edit_cancel: 27
        }, gantt._init_template = function(t, e, n) {
            var a = this._reg_templates || {};
            n = n || t, this.config[t] && a[n] != this.config[t] && (e && this.templates[n] || (this.templates[n] = this.date.date_to_str(this.config[t]), a[n] = this.config[t])), this._reg_templates = a
        }, gantt._init_templates = function() {
            var t = gantt.locale.labels;
            t.gantt_save_btn = t.icon_save, t.gantt_cancel_btn = t.icon_cancel, t.gantt_delete_btn = t.icon_delete;
            var e = this.date.date_to_str,
                n = this.config;
            gantt._init_template("date_scale", !0), gantt._init_template("date_grid", !0, "grid_date_format"), gantt._init_template("task_date", !0), gantt.mixin(this.templates, {
                xml_date: this.date.str_to_date(n.xml_date, n.server_utc),
                xml_format: e(n.xml_date, n.server_utc),
                api_date: this.date.str_to_date(n.api_date),
                progress_text: function(t, e, n) {
                    return ""
                },
                grid_header_class: function(t, e) {
                    return ""
                },
                task_text: function(t, e, n) {
                    return n.text
                },
                task_class: function(t, e, n) {
                    return ""
                },
                grid_row_class: function(t, e, n) {
                    return ""
                },
                task_row_class: function(t, e, n) {
                    return ""
                },
                task_cell_class: function(t, e) {
                    return ""
                },
                scale_cell_class: function(t) {
                    return ""
                },
                scale_row_class: function(t) {
                    return ""
                },
                grid_indent: function(t) {
                    return "<div class='gantt_tree_indent'></div>"
                },
                grid_folder: function(t) {
                    return "<div class='gantt_tree_icon gantt_folder_" + (t.$open ? "open" : "closed") + "'></div>"
                },
                grid_file: function(t) {
                    return "<div class='gantt_tree_icon gantt_file'></div>"
                },
                grid_open: function(t) {
                    return "<div class='gantt_tree_icon gantt_" + (t.$open ? "close" : "open") + "'></div>"
                },
                grid_blank: function(t) {
                    return "<div class='gantt_tree_icon gantt_blank'></div>"
                },
                date_grid: function(t, e) {
                    return e && gantt.isUnscheduledTask(e) && gantt.config.show_unscheduled ? gantt.templates.task_unscheduled_time(e) : gantt.templates.grid_date_format(t);
                },
                task_time: function(t, e, n) {
                    return gantt.isUnscheduledTask(n) && gantt.config.show_unscheduled ? gantt.templates.task_unscheduled_time(n) : gantt.templates.task_date(t) + " - " + gantt.templates.task_date(e)
                },
                task_unscheduled_time: function(t) {
                    return ""
                },
                time_picker: e(n.time_picker),
                link_class: function(t) {
                    return ""
                },
                link_description: function(t) {
                    var e = gantt.getTask(t.source),
                        n = gantt.getTask(t.target);
                    return "<b>" + e.text + "</b> &ndash;  <b>" + n.text + "</b>"
                },
                drag_link: function(t, e, n, a) {
                    t = gantt.getTask(t);
                    var i = gantt.locale.labels,
                        s = "<b>" + t.text + "</b> " + (e ? i.link_start : i.link_end) + "<br/>";
                    return n && (n = gantt.getTask(n), s += "<b> " + n.text + "</b> " + (a ? i.link_start : i.link_end) + "<br/>"), s
                },
                drag_link_class: function(t, e, n, a) {
                    var i = "";
                    if (t && n) {
                        var s = gantt.isLinkAllowed(t, n, e, a);
                        i = " " + (s ? "gantt_link_allow" : "gantt_link_deny")
                    }
                    return "gantt_link_tooltip" + i
                }
            }), this.callEvent("onTemplatesReady", [])
        }
    }(), window.jQuery && ! function(t) {
        var e = [];
        t.fn.dhx_gantt = function(n) {
            if (n = n || {}, "string" != typeof n) {
                var a = [];
                return this.each(function() {
                    if (this && this.getAttribute && !this.getAttribute("dhxgantt")) {
                        for (var t in n) "data" != t && (gantt.config[t] = n[t]);
                        gantt.init(this), n.data && gantt.parse(n.data), a.push(gantt)
                    }
                }), 1 === a.length ? a[0] : a
            }
            return e[n] ? e[n].apply(this, []) : void t.error("Method " + n + " does not exist on jQuery.dhx_gantt")
        }
    }(jQuery), gantt.locale = {
        date: {
            month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        labels: {
            new_task: "New task",
            icon_save: "Save",
            icon_cancel: "Cancel",
            icon_details: "Details",
            icon_edit: "Edit",
            icon_delete: "Delete",
            confirm_closing: "",
            confirm_deleting: "Task will be deleted permanently, are you sure?",
            section_description: "Description",
            section_time: "Time period",
            section_type: "Type",
            column_text: "Task name",
            column_start_date: "",
            column_duration: "",
            column_add: "",
            link: "Link",
            confirm_link_deleting: "will be deleted",
            link_start: " (start)",
            link_end: " (end)",
            type_task: "Task",
            type_project: "Project",
            type_milestone: "Milestone",
            minutes: "Minutes",
            hours: "Hours",
            days: "Days",
            weeks: "Week",
            months: "Months",
            years: "Years"
        }
    }, gantt.skins.skyblue = {
        config: {
            grid_width: 350,
            row_height: 27,
            scale_height: 27,
            link_line_width: 1,
            link_arrow_size: 8,
            lightbox_additional_height: 75
        },
        _second_column_width: 95,
        _third_column_width: 80
    }, gantt.skins.meadow = {
        config: {
            grid_width: 350,
            row_height: 27,
            scale_height: 30,
            link_line_width: 2,
            link_arrow_size: 6,
            lightbox_additional_height: 72
        },
        _second_column_width: 95,
        _third_column_width: 80
    }, gantt.skins.terrace = {
        config: {
            grid_width: 360,
            row_height: 35,
            scale_height: 35,
            link_line_width: 2,
            link_arrow_size: 6,
            lightbox_additional_height: 75
        },
        _second_column_width: 90,
        _third_column_width: 70
    }, gantt.skins.broadway = {
        config: {
            grid_width: 360,
            row_height: 35,
            scale_height: 35,
            link_line_width: 1,
            link_arrow_size: 7,
            lightbox_additional_height: 86
        },
        _second_column_width: 90,
        _third_column_width: 80,
        _lightbox_template: "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span><div class='gantt_cancel_btn'></div></div><div class='gantt_cal_larea'></div>",
        _config_buttons_left: {},
        _config_buttons_right: {
            gantt_delete_btn: "icon_delete",
            gantt_save_btn: "icon_save"
        }
    }, gantt.config.touch_drag = 500, gantt.config.touch = !0, gantt.config.touch_feedback = !0, gantt._touch_feedback = function() {
        gantt.config.touch_feedback && navigator.vibrate && navigator.vibrate(1)
    }, gantt._init_touch_events = function() {
        "force" != this.config.touch && (this.config.touch = this.config.touch && (-1 != navigator.userAgent.indexOf("Mobile") || -1 != navigator.userAgent.indexOf("iPad") || -1 != navigator.userAgent.indexOf("Android") || -1 != navigator.userAgent.indexOf("Touch"))),
            this.config.touch && (window.navigator.msPointerEnabled ? this._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function(t) {
                return t.pointerType == t.MSPOINTER_TYPE_MOUSE ? null : t
            }, function(t) {
                return !t || t.pointerType == t.MSPOINTER_TYPE_MOUSE
            }) : this._touch_events(["touchmove", "touchstart", "touchend"], function(t) {
                return t.touches && t.touches.length > 1 ? null : t.touches[0] ? {
                    target: t.target,
                    pageX: t.touches[0].pageX,
                    pageY: t.touches[0].pageY,
                    clientX: t.touches[0].clientX,
                    clientY: t.touches[0].clientY
                } : t
            }, function() {
                return !1
            }))
    }, gantt._touch_events = function(t, e, n) {
        function a(t) {
            return t && t.preventDefault && t.preventDefault(), (t || event).cancelBubble = !0, !1
        }

        function i(t) {
            var e = gantt._task_area_pulls,
                n = gantt.getTask(t);
            if (n && gantt.isTaskVisible(t))
                for (var a in e)
                    if (n = e[a][t], n && n.getAttribute("task_id") && n.getAttribute("task_id") == t) {
                        var i = n.cloneNode(!0);
                        return g = n, e[a][t] = i, n.style.display = "none", i.className += " gantt_drag_move ", n.parentNode.appendChild(i), i
                    }
        }
        var s, r = 0,
            o = !1,
            _ = !1,
            d = null,
            l = null,
            g = null;
        this._gantt_touch_event_ready || (this._gantt_touch_event_ready = 1,
            gantt.event(gantt.$container, t[0], function(t) {
                if (!n(t) && o) {
                    l && clearTimeout(l);
                    var i = e(t);
                    if (gantt._tasks_dnd.drag.id || gantt._tasks_dnd.drag.start_drag) return gantt._tasks_dnd.on_mouse_move(i), t.preventDefault && t.preventDefault(), t.cancelBubble = !0, !1;
                    if (i && d) {
                        var g = d.pageX - i.pageX,
                            h = d.pageY - i.pageY;
                        if (!_ && (Math.abs(g) > 5 || Math.abs(h) > 5) && (gantt._touch_scroll_active = _ = !0, r = 0, s = gantt.getScrollState()), _) {
                            gantt.scrollTo(s.x + g, s.y + h);
                            var c = gantt.getScrollState();
                            if (s.x != c.x && h > 2 * g || s.y != c.y && g > 2 * h) return a(t);
                        }
                    }
                    return a(t)
                }
            })), gantt.event(this.$container, "contextmenu", function(t) {
            return o ? a(t) : void 0
        }), gantt.event(this.$container, t[1], function(t) {
            if (!n(t)) {
                if (t.touches && t.touches.length > 1) return void(o = !1);
                if (o = !0, d = e(t), d && r) {
                    var s = new Date;
                    500 > s - r ? (gantt._on_dblclick(d), a(t)) : r = s
                } else r = new Date;
                l = setTimeout(function() {
                    var t = gantt.locate(d);
                    !t || gantt._locate_css(d, "gantt_link_control") || gantt._locate_css(d, "gantt_grid_data") || (gantt._tasks_dnd.on_mouse_down(d), gantt._tasks_dnd.drag && gantt._tasks_dnd.drag.start_drag && (i(t),
                        gantt._tasks_dnd._start_dnd(d), gantt._touch_drag = !0, gantt.refreshTask(t), gantt._touch_feedback())), l = null
                }, gantt.config.touch_drag)
            }
        }), gantt.event(this.$container, t[2], function(t) {
            if (!n(t)) {
                l && clearTimeout(l), gantt._touch_drag = !1, o = !1;
                var a = e(t);
                gantt._tasks_dnd.on_mouse_up(a), g && (gantt.refreshTask(gantt.locate(g)), g.parentNode && (g.parentNode.removeChild(g), gantt._touch_feedback())), gantt._touch_scroll_active = o = _ = !1, g = null
            }
        })
    },
    function() {
        function t(t, e) {
            var n = gantt.env.isIE ? "" : "%c",
                a = [n, '"', t, '"', n, " has been deprecated in dhtmlxGantt v4.0 and will stop working in v5.0. Use ", n, '"', e, '"', n, " instead. \nSee more details at http://docs.dhtmlx.com/gantt/migrating.html "].join(""),
                i = window.console.warn || window.console.log,
                s = [a];
            gantt.env.isIE || (s = s.concat(["font-weight:bold", "font-weight:normal", "font-weight:bold", "font-weight:normal"])), i.apply(window.console, s)
        }

        function e(e) {
            return function() {
                return t("dhtmlx." + e, "gantt." + e), gantt[e].apply(gantt, arguments)
            }
        }
        window.dhtmlx || (window.dhtmlx = {});
        for (var n = ["message", "alert", "confirm", "modalbox", "uid", "copy", "mixin", "defined", "bind", "assert"], a = 0; a < n.length; a++) window.dhtmlx[n[a]] || (dhtmlx[n[a]] = e(n[a]));
        window.dataProcessor || (window.dataProcessor = function(e) {
            return t("new dataProcessor(url)", "new gantt.dataProcessor(url)"),
                new gantt.dataProcessor(e)
        })
    }();
//# sourceMappingURL=sources/dhtmlxgantt.js.map