String.prototype.capitalize = function () {
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

    /**
     * force number to be in 2 digits
     * @param number
     * @returns {string}
     */
    var twodigit = function (number) {
        return ("0" + number).slice(-2);
    };

    /** placeholder element */
    var placeholder = Sel('#generator-placeholder'),
        planetNameElement = Sel('#planetName');

    Poivre.ajax({
        "url": 'settings.json',
        "success": function (response) {
            var settings = JSON.parse(response),
                data = settings.data,

                build = function () {
                    var formElements = Sel("input:checked"),
                        pattern = settings.pattern,
                        date = new Date()
                        ;

                    var dateArray = [
                        date.getUTCFullYear().toString().substring(2, 4),
                        twodigit(date.getUTCMonth() + 1),
                        twodigit(date.getUTCDate())
                    ];

                    pattern = pattern.replace('{date}', dateArray.join(''));

                    Poivre.each(data, function (setCode, setDatas) {
                        var multiple = setDatas.multiple || false,
                            max = setDatas.max || 1,
                            inputType = (multiple) ? "checkbox" : "radio";

                        var value = [];

                        Sel('[type="' + inputType + '"][name="' + setCode + '"]', formElements).each(function(k, v){
                            if( k < max){
                                value.push(this.value);
                            }else{
                                v.checked = false;
                            }
                        });

                        pattern = pattern.replace('{' + setCode + '}', value.join(''));
                    });

                    planetNameElement.set('value', pattern.capitalize());
                },
                decode = function () {
                    var pattern = settings.pattern.replace(/}{/g, "|").replace(/{|}/g, "|"),
                        patternArray = pattern.split('|')
                        ;

                    var startPos = 0;

                    Poivre.each(patternArray, function (k, v) {
                        var planetName = planetNameElement.get('value').replace(/\W/g, '');

                        v = v.replace(/\W/g, '');
                        if (v != "") {
                            var elementValue = planetName.substring(startPos, startPos + v.length),
                                radioElement = Sel('[type="radio"][name="' + v + '"][value="' + elementValue + '"],[type="radio"][name="' + v + '"][value="' + elementValue.toLowerCase() + '"]')
                                ;

                            startPos += v.length;

                            if (radioElement.length < 2) {
                                radioElement.set('checked', 'checked');
                            }
                        }
                    });
                };

            Poivre.each(data, function (setCode, setSettings) {
                var fiedlset = Poivre.new('fieldset')
                        .append(
                            Poivre.new('legend', setSettings.name)
                        ),
                    multiple = setSettings.multiple || false
                    ;

                Poivre.each(setSettings.data, function (value, text) {
                    var type = (multiple) ? "checkbox" : "radio";
                    fiedlset.append(Poivre.createInputElement(setCode, value, text.name, type, text.description));
                });
                placeholder.append(fiedlset);
            });

            placeholder.find('input').on('click', build);
            planetNameElement.on('keyup', decode);
        }
    });
});