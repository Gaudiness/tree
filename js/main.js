require.config({
    //≈‰÷√≤ªºÊ»›ƒ£øÈ
    shim: {

    },

    paths: {
        //baseUrl:'jquery',
        "jquery": "jquery/jquery-1.9.1",
        "knockout": "jquery/knockout-3.1.0",
        "ui": "jquery/jquery-ui-1.9.2",
        "mapping": "jquery/knockout.mapping-latest.debug",
        "scout.tree": "custom/scout.tree",
        'tree': 'tree'
    }
});
require(['tree'], function (tree) {
    tree.init($('#tree'));
})