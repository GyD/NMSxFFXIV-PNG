String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Sel(document).on('ready', function () {

    /**
     * add a .text() function to Poivre
     * @param text
     * @returns {*}
     */
    Poivre.prototype.text = function (text) {
        return this.append(document.createTextNode(text));
    };

    /**
     * helper to create new dom elements
     * @param type
     * @param text
     */
    Poivre.new = function (type, text) {
        var element = Sel(document.createElement(type));
        if (text) {
            element.text(text);
        }
        return element;
    };

    /**
     * Helper to create input elements
     * @param name
     * @param value
     * @param label
     * @param type
     * @param description
     * @returns {*|void}
     */
    Poivre.createInputElement = function (name, value, label, type, description) {

        var id = name + '-' + value,

            wrapperElement = Poivre.new('div')
                .append(
                    Poivre.new('input')
                        .set('type', type)
                        .set('name', name)
                        .set('value', value)
                        .set('id', id)
                )
            ;

        if (label) {
            wrapperElement.append(
                Poivre.new('label')
                    .set('for', id)
                    .text(label)
            );
        }

        if (description) {
            wrapperElement.append(
                Poivre.new('p')
                    .text(description)
            );
        }

        return wrapperElement;
    };

    var twodigit = function(number){
        return ("0" + number).slice(-2);
    };

    /** placeholder element */
    var placeholder = Sel('#generator-placeholder');

    Poivre.ajax({
        "url": 'settings.json',
        "success": function (response) {
            var settings = JSON.parse(response),
                data = settings.data,

                build = function () {
                    var formElements = Sel("input:checked"),
                        pattern = settings.pattern,
                        date = new Date();
                    ;

                    var dateArray = [
                        date.getUTCFullYear().toString().substring(2, 4),
                        twodigit(date.getUTCMonth() + 1),
                        twodigit(date.getUTCDate())
                    ];

                    pattern = pattern.replace('{date}', dateArray.join(''));

                    Poivre.each(formElements, function (k, formElement) {
                        var name = formElement.name;
                        pattern = pattern.replace('{' + name + '}', formElement.value);

                    });

                    Poivre.each(data, function (setName, setDatas) {
                        pattern = pattern.replace('{' + setName + '}', '');
                    });

                    var planetNameElement = document.getElementById('planetName');
                    planetNameElement.value = pattern.capitalize();
                };

            Poivre.each(data, function (setName, setDatas) {
                var fiedlset = Sel(document.createElement('fieldset'))
                    .append(
                        Sel(document.createElement('legend')).append(document.createTextNode(setName))
                    );

                Poivre.each(setDatas, function (value, text) {
                    fiedlset.append(Poivre.createInputElement(setName, value, text.name, "radio", text.description));
                });
                placeholder.append(fiedlset);
            });

            placeholder.find('input').on('click', build);
        }
    });
});