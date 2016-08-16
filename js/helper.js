var helper = {
    "ready": function ready(callback) {
        if (document.readyState != 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    },
    "getJSON": function (url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var data = JSON.parse(this.response);

                callback(data);
            } else {
                // We reached our target server, but it returned an error

            }
        };

        request.onerror = function () {
            // There was a connection error of some sort
        };

        request.send();
    },
    "isArraylike": function (obj) {

        // Support: iOS 8.2 (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = "length" in obj && obj.length,
            type = typeof obj;

        if (type === "function" || (obj != null && obj === obj.window)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    },
    "each": function (obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = this.isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

            // A special, fast, case for the most common use of each
        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    },
    "createElement": function (tagName, attributes) {
        var element = document.createElement(tagName);

        this.each(attributes || [], function (attributeName, attributeValue) {
            element.setAttribute(attributeName, attributeValue);
        });

        return element;
    },
    "createFieldset": function (legend) {
        var fieldsetElement = this.createElement('fieldset'),
            legendElement = null
            ;

        if (legend) {
            legendElement = this.createElement('legend');
            legendElement.append(document.createTextNode(legend));
            fieldsetElement.appendChild(legendElement);
        }

        return fieldsetElement;
    },
    "createInputElement": function (name, value, label, type, description) {

        var
            id = name + '-' + value,
            inputElement = helper.createElement('input', {
                "type": type || "text",
                "name": name,
                "value": value,
                "id": id
            }),
            wrapperElement = helper.createElement('div')
            ;

        wrapperElement.appendChild(inputElement);

        if (label) {
            var labelElement = helper.createElement('label', {"for": id});
            labelElement.appendChild(document.createTextNode(label));

            wrapperElement.appendChild(labelElement);
        }

        if (description) {
            var descriptionElement = helper.createElement('p');
            descriptionElement.appendChild(document.createTextNode(description));
            wrapperElement.appendChild(descriptionElement);
        }


        return wrapperElement;
    }
};