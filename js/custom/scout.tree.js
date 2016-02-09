define(['jquery', 'knockout', "mapping", "ui"], function ($, ko, m) {
    ko.mapping = m;
    (function ($) {
        $.widget("scout.tree", {
            _this: this,
            _treeNode: null,
            _treeDeep: 0,

            options: {
                items: null,
                template: null,
                name: null,
                // selectionChanged: function (e, args) { }
            },

            _create: function () {
                var self = this,
                    options = self.options,
                    element = self.element,
                    deep = 0;
                self._getTreeDeep(options.items, deep);
                self._loadTreeNode();
                self._travelTree(self._treeNode, deep, null);
                self._creatrTree(element, deep);
                self._inEvent(self._treeNode);
                self._applyBinding();
            },

            _setOptins: function () {

            },

            _loadTreeNode: function () {
                var self = this,
                    options = self.options;
                self._treeNode = ko.mapping.fromJS(options.items);
            },

            _getTreeDeep: function (treeNode, deep) {
                var self = this;
                deep++;
                if (treeNode.child) {
                    if (treeNode.child.length > 0) {
                        for (var i = 0; i < treeNode.child.length; i++) {
                            self._getTreeDeep(treeNode.child[i], deep);
                        }
                    } else {
                        treeNode.child = [];
                    }
                } else {
                    treeNode.child = [];
                }
                if (self._treeDeep < deep) {
                    self._treeDeep = deep;
                }
            },

            _travelTree: function (treeNode, deep, parent) {
                deep++;
                var self = this;
                var child = treeNode.child();
                if (child.length > 0) {
                    for (var i = 0; i < child.length; i++) {
                        self._travelTree(treeNode.child()[i], deep, treeNode);
                    }
                }
                self._extend(treeNode, deep, parent, deep == 1 ? true : false)
            },

            _extend: function (item, deep, parent, visible) {
                var self = this,
                    add = {
                        deep: ko.observable(deep),
                        distance: ko.observable(deep * 10),
                        selected: ko.observable(false),
                        visible: ko.observable(visible),
                        parent: ko.observable(parent),
                        checked: ko.observable(false),
                        mark: ko.dependentObservable(function () {
                            var mark = " ";
                            if (item.child().length > 0) {
                                if (item.child()[0].visible()) {
                                    mark = "-";
                                } else {
                                    mark = "+";
                                }
                            }
                            return mark;
                        }),
                    }
                add.checked.subscribe(function (status) {
                    if (self._treeNode.actionSign) {
                        if (self._treeNode.sign) {
                            if (item.child().length) {
                                var child = item.child();
                                for (var i = 0; i < child.length; i++) {
                                    if (status) {
                                        child[i].checked(true);
                                    } else {
                                        child[i].checked(false);
                                    }
                                }
                            }
                        }
                    }
                    if (add.parent()) {
                        self._treeNode.sign = false;
                        var child = add.parent().child();
                        if (status) {
                            var flag = true;
                            for (var i = 0; i < child.length; i++) {
                                if (!child[i].checked()) {
                                    flag = false;
                                    break;
                                }
                            }
                            add.parent().checked(flag);

                        } else {
                            add.parent().checked(false);
                        }
                    }
                    self._treeNode.sign = true
                }, self);

                $.extend(item, add);
            },

            _creatrTree: function (element, deep) {
                var self = this;
                deep++;
                if (deep == 1) {
                    var $container = $("<div id=container></div>");
                    element.append($container);
                    element = $container;
                }
                var $text = $("<div class='menu' data-bind='visible:visible, event:{click:$root.changeVisible}, css:{ selected: selected }, style:{ paddingLeft: distance }'></div>");
                if (self.options.template) {
                    var $context = $(self.options.template);

                } else {
                    var $context = $("<input class='tree-checkbox' type='checkbox' data-bind='checked:checked, '/>"//click:$root.changeChecked
                                   + "<span data-bind='text:name'></span>"
                                   + "<span class='mark' data-bind='text:mark'></span>");
                }
                $text.append($context);
                element.append($text);
                if (deep < self._treeDeep) {
                    var $foreach = $("<div class='sub' data-bind='foreach:child, visible:visible'></div>");
                    element.append($foreach);
                    //element = $foreach;
                    self._creatrTree($foreach, deep);
                }
            },

            _inEvent: function (treeNode) {
                var self = this,
                    tree = self._treeNode;

                treeNode.actionSign = true;
                treeNode.sign = true;
                treeNode.nodeForSelected = null;

                //menu绑定click事件
                treeNode.changeVisible = function (item, e) {
                    if (!$(e.target).is(".tree-checkbox")) {
                        if (item.child().length) {
                            for (var i = 0; i < item.child().length; i++) {
                                item.child()[i].visible(!item.child()[i].visible());
                            }
                        }
                        if (tree.nodeForSelected != item) {
                            item.selected(true);
                            if (tree.nodeForSelected) {
                                tree.nodeForSelected.selected(false);
                            }
                            tree.nodeForSelected = item;
                            var args = {
                                newValue: item,
                                oldValue: tree.nodeForSelected
                            }
                            //self.options.selectionChanged(e, args);
                            //self.options.selectionChanged.apply({s:'d'}, [e, args]);
                            self._trigger("selectionChanged", e, args)
                            // self.element.trigger("show", args);
                        }
                    } else {
                        return true;
                    }
                }

                //checkbox绑定click事件
                treeNode.changeChecked = function (item) {
                    self._changeChild(item, item, self)
                    self._changeParent(item, item, self);
                    return true;
                }
            },

            _changeChild: function (clickItem, item, self) {
                if (item.child().length) {
                    for (var i = 0; i < item.child().length; i++) {
                        if (clickItem.checked()) {
                            item.child()[i].checked(true);
                        } else {
                            item.child()[i].checked(false);
                        }
                        self._changeChild(clickItem, item.child()[i], self);
                    }
                }
            },

            _changeParent: function (clickItem, item, self) {
                if (item.parent()) {
                    var child = item.parent().child();
                    if (clickItem.checked) {
                        if (child.length) {
                            var flag = true;
                            for (var i = 0; i < child.length; i++) {
                                if (!child[i].checked()) {
                                    flag = false;
                                    break;
                                }
                            }
                            item.parent().checked(flag);
                        }
                    } else {
                        item.parent().checked(false);
                    }
                    self._changeParent(clickItem, item.parent(), self);
                }
            },

            _applyBinding: function () {
                var self = this,
                    element = this.element;
                //ko.cleanNode(element.children()[0]);
                ko.applyBindings(self._treeNode, element.children()[0]);
            },

            getSelectedNode: function () {
                var self = this,
                    select = self._treeNode.nodeForSelected;
                if (!select) {
                    alert("Please select a node");
                }
                return select;
            },

            updataNode: function (name) {
                var self = this,
                    select = self._treeNode.nodeForSelected;
                if (select) {
                    select.name(name);
                }
            },

            addSubNode: function (name) {
                var self = this,
                    select = self._treeNode.nodeForSelected;
                if (select) {
                    var self = this,
                        element = self.element,
                        deep = select.deep() + 1,
                        visible = select.child().length ? select.child()[0].visible() : true,
                        parent = select,
                        node = {
                            name: ko.observable(name),
                            child: ko.observableArray([]),
                        };

                    self._extend(node, deep, parent, visible);
                    select.child.push(node);

                    self._treeNode.actionSign = false;
                    parent.checked(false);
                    self._treeNode.actionSign = true;

                    if (deep > self._treeDeep) {
                        self._treeDeep++;
                        element.empty();
                        self._creatrTree(element, 0);
                        self._applyBinding();
                    }
                }
            },

            addBroNode: function (name) {
                var self = this,
                    select = self._treeNode.nodeForSelected;
                if (select) {
                    var deep = select.deep(),
                        visible = true,
                        parent = select.parent(),
                        node = {
                            name: ko.observable(name),
                            child: ko.observableArray([]),
                        };
                    self._extend(node, deep, parent, visible);
                    select.parent().child.push(node);

                    self._treeNode.actionSign = false;
                    parent.checked(false);
                    self._treeNode.actionSign = true;
                }
            },

            removeSelected: function () {
                var self = this,
                    select = self._treeNode.nodeForSelected;
                if (select) {
                    select.parent().child.remove(select);

                    var child = select.parent().child();
                    if (child.length) {
                        var flag = true;
                        for (var i = 0; i < child.length; i++) {
                            if (!child[i].checked()) {
                                flag = false;
                                break;
                            }
                        }
                        self._treeNode.actionSign = false;
                        child[0].parent().checked(flag);
                        self._treeNode.actionSign = true;
                    }
                    select = null;
                }
            },

        });
    })(jQuery)
});



