'use strict';

/* Services */

var tryHskServices = angular.module('tryHskServices', ['ngResource']);

tryHskServices.factory('Word', ['$resource',
    function ($resource) {
        return $resource('words.json', {}, {
            query: {method: 'GET', isArray: true}
        })
    }]);


tryHskServices.factory('rating', function ($resource, vk_id) {

   return vk_id.getSortWords().then(function (id) {
        var params = 'id=' + encodeURIComponent(id);
        return $resource('/vote?'+params, {}, {
            query: {method:'GET',isArray:false}
        })
    })
});


/*
 var params = 'id=' + encodeURIComponent(id)+ '&amount=' + encodeURIComponent(amount)+ '&rights=' + encodeURIComponent(rights);
 return $resource('/vote?'+params, {}, {
 query: {method:'GET',isArray:false}
 });
 */


tryHskServices.factory('vk_id', function ($q) {
    var getId = function () {
        var deferred = $q.defer();
        deferred.resolve(
            function () {
                return VK.init(function () {
                    var parts = document.location.search.substr(1).split("&");
                    var flashVars = {}, curr;
                    for (i = 0; i < parts.length; i++) {
                        curr = parts[i].split('=');
                        flashVars[curr[0]] = curr[1];
                    }
                    return flashVars['viewer_id'];
                })
            });
        return deferred.promise;
    };
    return {
        getId: getId
    }
});


// @todo  настроить cookies
tryHskServices.factory('valueBoolean', function () {
    return {
        bool: {
            hsk1: true,
            hsk2: true,
            hsk3: true,
            verb: true,
            numeral: true,
            adjective: true,
            pronoun: true,
            place: true,
            relate: true,
            noun: true,
            otherPart: true,
            otherThemes: true
        }

    }
});


tryHskServices.factory('sortWords', function ($q, Word, valueBoolean) {

    var getSortWords = function () {
        var deferred = $q.defer();
        var words = Word.query();
        var value = valueBoolean;
        deferred.resolve(words.$promise.then(
            function () {

                function filterOfHskLevel(words) {
                    console.time('lol');
                    var result = [];
//                        len = words.length;
                    for (var i = 0; i < words.length; i++) {

                        var hsk;
                        hsk = words[i].hsk.split('-');
                        switch (hsk[0]) {
                            case '1' :
                                if (value.bool.hsk1) {
                                    result.push(words[i].id)
                                }
                                break;
                            case '2' :
                                if (value.bool.hsk2) {
                                    result.push(words[i].id)
                                }
                                break;
                            case '3' :
                                if (value.bool.hsk3) {
                                    result.push(words[i].id)
                                }
                                break;
                            default:
                                console.log('Error filterOfHskLevel()');
                                break
                        }
                    }
                    return result;
                }

                function filterOfPartOfSpeach(array) {

                    var result = [];
                    for (var i = 0; i < array.length; i++) {
                        if (value.bool.verb) {
                            if (words[array[i]].verb) {
                                result.push(array[i]);
                                continue
                            }
                        }
                        if (value.bool.adjective) {
                            if (words[array[i]].adjective) {
                                result.push(array[i]);
                                continue
                            }
                        }
                        if (value.bool.noun) {
                            if (words[array[i]].noun) {
                                result.push(array[i]);
                                continue
                            }
                        }
                        if (value.bool.numeral) {
                            if (words[array[i]].number) {
                                result.push(array[i]);
                                continue
                            }
                        }
                        if (value.bool.otherPart) {
                            if (!words[array[i]].numeral && !words[array[i]].noun && !words[array[i]].verb && !words[array[i]].adjective) {
                                result.push(array[i])
                            }
                        }
                    }
                    return result;
                }

                function filterOfThemes(array) {
                    var result = [];
                    for (var i = 0; i < array.length; i++) {
                        if (value.bool.place) {
                            if (words[array[i]].place) {
                                result.push(array[i]);
                                continue
                            }
                        }
                        if (value.bool.relate) {
                            if (words[array[i]].relationship) {
                                result.push(array[i]);
                                continue
                            }
                        }
                        if (value.bool.otherThemes) {
                            if (!words[array[i]].relationship && !words[array[i]].place) {
                                result.push(array[i])
                            }
                        }
                    }
                    return result;
                }

                function createFilterWords(array) {
                    var result = [];
                    for (var i = 0; i < array.length; i++) {
                        result.push(words[array[i]])
                    }
                    console.timeEnd('lol');

                    return result;
                }

                return createFilterWords(filterOfThemes(filterOfPartOfSpeach(filterOfHskLevel(words))));
            }));


        return deferred.promise;
    };

    return {
        getSortWords: getSortWords
    };

});


//@todo пришпилить локализацию
tryHskServices.factory('amountWords', function ($q, sortWords) {

    var getAmountWords = function () {
        var deferred = $q.defer();

        deferred.resolve(
            sortWords.getSortWords().then(function (words) {
                console.log('amount');
                return ammountWords(words);
            })
        );

        function ammountWords(array) {
            var slov,
                last_number,
                number;
            last_number = array.length.toString().substr(array.length.toString().length - 1, 1);
            number = array.length.toString();
            if (last_number === '1') {
                slov = ' слово'
            }
            else {
                if (last_number == '2' || last_number == '3' || last_number == '4') {
                    if (number == '12' || number == '13' || number == '14') {
                        slov = ' слов'
                    }
                    else {
                        slov = ' слова'
                    }
                }
                else {
                    slov = ' слов'
                }
            }
            return  'Выбрано ' + array.length + slov;
        }

        return deferred.promise;
    };

    return {
        getAmountWords: getAmountWords
    };

});


// Сервис отвечает за язык
tryHskServices.factory('language', function () {

    var selections = [
            {name: 'russian',
                text: 'Русский'},
            {name: 'hanyu',
                text: '汉语'},
            {name: 'english',
                text: 'English'}
        ],
        select = selections[2],
        getLanguage = function () {
//            console.log(select);
            var language = {};
            switch (select.name) {
                case 'russian' :
                    language = {
                        "search": 'Поиск',
                        "select": 'Выберите язык',
                        "char": "Иероглиф",
                        "pinyin": "Пиньинь",
                        "translate": "Перевод",
                        "eng": "Английский"
                    };
                    break;
                case 'hanyu' :
                    language = {
                        "search": '搜索',
                        "select": '选择语言',
                        "char": "字",
                        "pinyin": "拼音",
                        "translate": "俄语",
                        "eng": "英语"
                    };
                    break;
                case 'english' :
                    language = {
                        "search": 'Search',
                        "select": 'Choose language',
                        "char": "Hieroglyph",
                        "pinyin": "Pinyin",
                        "translate": "Russian",
                        "eng": "English"
                    };
                    break;
                default:
                    console.log('Error language()');
                    break
            }
            return language;
        };

    return {
        //Возвращает язык
        getLanguage: getLanguage,
        //Возвращает значения для <select>
        selections: selections,
        //Возвращает выбранное значение из/для <select>
        select: select
    };

});


//  statemanager'ы

tryHskServices.factory('StateManager', function ($rootScope, $log) {

    var stateContainer = [];

    return {
        add: function (service) {
            stateContainer.push(service);
            $rootScope.globalLoader = true;
            $log.log('Add service: ' + service);
        },

        remove: function (service) {
            stateContainer = _.without(stateContainer, service);
            $log.log('Remove service: ' + service);

            if (stateContainer.length === 0) {
                $rootScope.globalLoader = false;
                $log.log('StateContainer is empty.');
            }

        },

        getByName: function (service) {
            return _.include(stateContainer, service)
        },

        clear: function () {
            stateContainer.length = 0;
            $log.log('StateContainer clear.');
            return true;
        }
    }

});


tryHskServices.factory('SummaryStateManager', function ($rootScope, $log) {

    var stateContainer = [];

    return {
        add: function (service) {
            stateContainer.push(service);
            $rootScope.summaryLoader = true;
            $log.log('Add service: ' + service);
        },

        remove: function (service) {
            stateContainer = _.without(stateContainer, service);
            $log.log('Remove service: ' + service);

            if (stateContainer.length === 0) {
                $rootScope.summaryLoader = false;
                $log.log('StateContainer is empty.');
            }

        },

        getByName: function (service) {
            return _.include(stateContainer, service)
        },

        clear: function () {
            stateContainer.length = 0;
            $log.log('StateContainer clear.');
            return true;
        }
    }

});