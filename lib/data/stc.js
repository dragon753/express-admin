
// load static values from settings
// modifies `args.config.columns` with `value`

function getSelect (options) {
    var values = [];
    for (var i=0; i < options.length; i++) {
        if ('string' === typeof options[i]) {
            values.push({__pk: options[i], __text: options[i]});
        }
        else if ('object' === typeof options[i]) {
            var value = Object.keys(options[i])[0],
                text = options[i][value];
            values.push({__pk: value, __text: text});
        }
    }
    return values;
}

function getRadio (options) {
    var start =0;
    return options.map(function(i){
        if('string' === typeof i){
            return {text: i, value: start++};
        }else{
            var key = Object.keys(i)[0];
            return {text: i[0], value: key};
        }
    })
}

exports.get = function (args) {
    var columns = args.config.columns;
    for (var i=0; i < columns.length; i++) {
        var control = columns[i].control;
        if (!(control.options instanceof Array)) continue;

        if (control.select) {
            columns[i].value = getSelect(control.options);
        }
        else if (control.radio) {
            columns[i].value = getRadio(control.options);
        }
    }
}
