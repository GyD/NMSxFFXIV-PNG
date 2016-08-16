helper.ready(function () {

    var placeholder = document.getElementById('generator-placeholder');

    helper.getJSON("settings.json", function (settings) {
        var data = settings.data;

        helper.each(data, function (setName, setDatas) {
            var fieldset = helper.createFieldset(setName);
            helper.each(setDatas, function (value, text) {
                fieldset.appendChild(helper.createInputElement(
                    setName,
                    value,
                    text.name,
                    "radio",
                    text.description
                ));
            });

            placeholder.appendChild(fieldset);
        });
    });


});