(function ($) {
    $.widget("scout.myButton", {
        options: {
            viewModel: {
                value: ko.observable(),
            },
            value: "button",
            disabled: false,
        },

        click: function () {
            alert(this.options.value);
        },
        _create: function () {
            var self = this;
            self._inWidget();
            self._applyBind();
            self._initEvent();
        },

        _inWidget: function () {
            var self = this,
                element = self.element,
                options = self.options;
            $btn = $("<div data-bind='text:value, ' class='button-normal'></div>");
            if (options.disabled) {
                $btn.addClass("button-disabled");
            }
            element.append($btn);
        },

        //_setOption: function (key, value) {
        //    var self = this;
        //    switch (key) {
        //        case "value": 
        //            self.options.value = value;
        //        case "disabled":
        //            self.options.disabled = value;
        //    }
        //},

        _initEvent: function () {
            var self = this,
                element = self.element;
            if (!self.options.disabled) {
                element.children().on("mouseenter", self, self._mouseenter)
                         .on("mouseout", self, self._mouseout)
                         .on("mousedown", self, self._mousedown)
                         .on("mouseup", self, self._mouseup);
            }
        },

        _applyBind: function () {
            var self = this,
                element = self.element,
                options = self.options;
            options.viewModel.value(options.value);
            ko.applyBindings(self.options.viewModel);
        },

        _mouseenter: function () {
            $(this).addClass("button-mouseenter");
        },
        _mouseout: function () {
            $(this).removeClass("button-mouseenter");
        },
        _mousedown: function () {
            $(this).addClass("button-mousedown");
        },
        _mouseup: function () {
            $(this).removeClass("button-mousedown");
        },
    });
})(jQuery);