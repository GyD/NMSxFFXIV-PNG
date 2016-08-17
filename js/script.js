String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

helper.ready(function () {

    var placeholder = document.getElementById('generator-placeholder');

    helper.getJSON("settings.json", function (settings) {
        var data = settings.data,
            build = function () {
                var formElements = placeholder.querySelectorAll("input:checked"),
                    pattern = settings.pattern,
                    date = new Date();
                ;

                var dateArray = [
                    date.getUTCFullYear().toString().substring(2,4),
                    helper.twodigit(date.getUTCMonth()+1),
                    helper.twodigit(date.getUTCDate())
                ];

                pattern = pattern.replace('{date}', dateArray.join(''));

                helper.each(formElements, function (k, formElement) {
                    var name = formElement.name;

                    pattern = pattern.replace('{' + name + '}', formElement.value);

                });

                helper.each(data, function (setName, setDatas) {
                    pattern = pattern.replace('{' + setName + '}', '');
                });

                var planetNameElement = document.getElementById('planetName');
                planetNameElement.value = pattern.capitalize();
            };

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
        var formElements = placeholder.querySelectorAll("input");
        for (var i = 0; i < formElements.length; i++) {
            var formElement = formElements[i];

            formElement.addEventListener('click', build);
        }
    });


});