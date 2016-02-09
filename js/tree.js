define(['scout.tree'], function () {
    var treeModel = function () {
        var _this = this,
            _tree = null,
            source =
                    {
                        name: 'The head of the tree', child: [
                         {
                             name: 'Accout', child: [
                               { name: 'Cancle', child: [] },
                               { name: 'Dear' },
                               { name: 'Error', child: null },
                             ]
                         },
                         {
                             name: 'Bank', child: [
                               {
                                   name: 'France', child: [
                                     {
                                         name: 'Height', child: [
                                             { name: "I ❤ U" },
                                             { name: "Jay" },
                                         ]
                                     }
                                   ]
                               },
                               { name: 'Ground', child: null }
                             ]
                         }
                        ]
                    };

        _this.init = function ($tree) {
            _tree = $tree;
            _this.createTree();
            _this.clickEvent();
        }

        _this.createTree = function () {
            _tree.tree({
                items: source,
                //selectionChanged: function (e, args) {
                // //   $(".input").val(args.newValue.name());
                //},
                //template: ""//click:$root.changeChecked
                //            + "<span data-bind='text:name()+\"0\"'></span>"
                //            + "<span class='mark' data-bind='text:mark'></span>"
            });
        }

        _this.clickEvent = function () {
            $(".btn").mouseenter(function () {
                $(this).addClass("btn-enter");
            }).mousedown(function () {
                $(this).addClass("btn-click");
                $(this).removeClass("btn-enter");
            }).mouseout(function () {
                $(this).removeClass("btn-enter");
                $(this).removeClass("btn-click");
            }).mouseup(function () {
                $(this).removeClass("btn-click");
                $(this).addClass("btn-enter");
            });

            $("#modify").click(function () {
                _this.action("upDateNode");
            });

            $("#addBro").click(function () {
                _this.action("addBroNode");
            });

            $("#addSub").click(function () {
                _this.action("addSubNode");
            });

            $("#remove").click(function () {
                _this.action("removeSelected");
            });

            _tree.bind("treeselectionChanged", function (e, args) {
                $(".input").val(args.newValue.name());
            });
        }

        _this.action = function (funcName) {
            var name = $(".input").val(),
                nodeMessage = _tree.tree("getSelectedNode");
            switch (funcName) {
                case "addSubNode":
                    _tree.tree("addSubNode", name);
                    break;
                case "addBroNode":
                    _tree.tree("addBroNode", name);
                    break;
                case "removeSelected":
                    _tree.tree("removeSelected");
                    $(".input").val(null);
                    break;
                case "upDateNode":
                    _tree.tree("updataNode", name);
                    break;
            }
        }
    }
    return new treeModel();
})




