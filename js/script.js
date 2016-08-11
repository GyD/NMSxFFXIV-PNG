helper.ready(function () {

    var placeholder = document.getElementById('generator-placeholder');

    helper.getJSON("settings.json", function (settings) {
        var data = settings.data;

        helper.each(data, function (setName, setDatas) {
            helper.each(setDatas, function (value, text) {
                placeholder.appendChild(helper.createInputElement(
                    setName,
                    value,
                    text.name,
                    "radio",
                    text.description
                ));
            });
        });
    });


});