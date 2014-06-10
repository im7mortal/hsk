'use strict';
var amount_global;
var rights;


var tryHskControllers = angular.module('tryHskControllers', []);

tryHskControllers.controller('summaryCtrl', function ($scope, $rootScope, sortWords, amountWords, language, SummaryStateManager) {


    $scope.language = language.getLanguage();
    $scope.refresh = function () {
        SummaryStateManager.add('summary');
        sortWords.getSortWords().then(function (words) {
            if (words.length == 0) {
                $scope.amount = 'Ничего не выбрано';
                $scope.words = words;
            } else {
                $scope.words = words;
                amountWords.getAmountWords().then(function (amount) {
                    $scope.amount = amount;
                });
            }
            SummaryStateManager.remove('summary');
        });
    };
    $scope.refresh();
    $scope.predicate = 'id';
});


tryHskControllers.controller('testCtrl',
    function ($scope, $rootScope, Word, sortWords, amountWords, $timeout, StateManager, register, rating, $resource) {
// @todo remember  object porno
//        $scope.result = 0;
//        $scope.rating = 0;
//        $scope.rights = 0;
        var question
            , swords
            , arr = new Array(10)
            , wordsTests = [
                {},
                {},
                {},
                {}
            ]
            , test_randoms = [];
        var result_client;

        StateManager.add('d');


            var rat = register.query();
            rat.$promise.then(
                function () {
                    console.log('ok');
                    $scope.result = rat.amount;
                    $scope.rating = rat.rating;
                    $scope.rights = rat.rights;
                });

        $scope.checkAnsver = function (ansv) {
            try {
                result_client.check(ansv)
            } catch (e) {
            }
            result_client.check = null;
        };

        function Hamster() {
        }

        Hamster.prototype.check = function (ansv) {
            if (ansv) {
                $scope.result = ++$scope.result;
            } else {
            }
        };










//Выдаёт рандомное число в зависимости от размера массива
        function random_var(array) {
            return Math.floor(Math.random() * (array.length - 1));
        }

//Перемешивает массив
        function mixer(array) {
            for (var i = array.length; i-- > 0;) {
                var t = array[i],
                    j = Math.floor(i * Math.random());
                array[i] = array[j];
                array[j] = t;
            }
            return array;
        }

//Выдаёт id  следующего слова учитывая предъидущие
        function randomize(data) {
            question = random_var(data);
            var repeat = true;
            do {
                for (var i = 0; i < 8; i++) {
                    if (question == arr[i]) {
                        question = (random_var(data));
                        repeat = true;
                        break
                    } else {
                        repeat = false
                    }
                }
            } while (repeat);
            arr.unshift(question);
            return question;
        }

//Изменяет ширину окна главного иероглифа
        function main_char(words) {
            var length = words[question].char.length;
            if (length == 1) {
                $("#random").css("width", 92)
            } else {
                $("#random").css("width", 80 * length);
            }
        }

//Создаётся массив из 4 элементов, один из них id главного иероглифа
        function generate_var(data) {
            var test_random = (function () {
                var test_random = [question, random_var(data), random_var(data), random_var(data)];
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if (i == j) {
                        } else if (test_random[i] == test_random[j]) {
                            test_random[i] = random_var(data);
                        } else  ;
                    }
                }
                return test_random;
            })();
            mixer(test_random);
            mixer(test_random);
            test_randoms = test_random;
        }

//Создаёт 4 обьекта по id из  generate_var




        function setSmock() {
            var arr = ['❤', '☀', '♞', '☭'];
            $scope.char = '☯';
            for (var i = 0; i < 4; i++) {
                wordsTests[i].char = arr[i];
                wordsTests[i].pinyin = '☀';
                wordsTests[i].russian = '♞';
                wordsTests[i].sound = '';  // звук птичек на звонке
                wordsTests[i].ansver = 'primary';
                wordsTests[i].button = 'лол!!!';
            }
        }

        function fill_test(words) {

            for (var i = 0; i < 4; i++) {
                wordsTests[i].char = words[test_randoms[i]].char;
                wordsTests[i].pinyin = words[test_randoms[i]].pinyin;
                wordsTests[i].russian = words[test_randoms[i]].russian;
                wordsTests[i].sound = words[test_randoms[i]].sound;
                wordsTests[i].id = words[test_randoms[i]].id;
                if (test_randoms[i] == question) {
                    wordsTests[i].ansver = 'success';
                    wordsTests[i].ansv = true;
                    wordsTests[i].button = 'Молодец!';
                } else {
                    wordsTests[i].ansver = 'danger';
                    wordsTests[i].ansv = false;
                    wordsTests[i].button = 'Всё получится!';
                }
            }
            return wordsTests;
        }

        $scope.fill = function (data) {
            $("div.content").css("display", "none").css("border", "");
            randomize(data);
            main_char(data);
            $scope.char = data[question].char;
            var n = data[question].sound.split('http://china-standart.ru');
            $scope.sound = n[1];
            generate_var(data);
            fill_test(data);
            setTimeout(function () {
                $("div.content:has(button.success)").css("border", "2px solid #60a917");
                $("div.content:has(button.danger)").css("border", "2px solid red");
            }, 500);
            return wordsTests;
        };
        $scope.nextWord = function () {
            if (swords.length < 10) {
                if (swords.length == 0) {
                    $scope.amount = 'Ничего не выбрано';
                    setSmock();
                } else {
                    $scope.amount = 'Слишком мало слов';
                    setSmock();
                }
            } else {
                $rootScope.global_amount = $scope.result;
                $rootScope.global_rights = $scope.rights;
                global_amount = $scope.result;
                global_rights = $scope.rights;
                $scope.fill(swords);
                delete result_client.check;
                return wordsTests;
            }
        };
        $scope.fresh = function () {
            sortWords.getSortWords().then(function (words) {
                swords = words;
                if (words.length < 10) {
                    if (words.length == 0) {
                        $scope.amount = 'Ничего не выбрано';
                        setSmock();
                    } else {
                        $scope.amount = 'Слишком мало слов';
                        setSmock();
                    }
                } else {
                    arr = new Array(10);
                    $rootScope.global_amount = $scope.result;
                    $rootScope.global_rights = $scope.rights;
                    global_amount = $scope.result;
                    global_rights = $scope.rights;
                    $scope.fill(words);

                    result_client = new Hamster();
//                    result.getAmountWords().then(function (amount) {
//                        result_client = new Hamster();
//                    });

                    amountWords.getAmountWords().then(function (amount) {
                        $scope.amount = amount;
                        StateManager.remove('d');
                    });
                }
            });
        };

        $scope.fresh();
//дурацкий костыль от вспышек
        $timeout(function () {
            $('#f').hide();
        }, 500);
        $scope.wordsTests = wordsTests;
        $timeout(function () {
            StateManager.remove('d');
        }, 3000);
        $('.toServer').click(function () {
            $rootScope.global_amount = $scope.result;
            $rootScope.global_rights = $scope.rights;
            console.log($rootScope.global_rights);
            console.log($rootScope.global_amount);
            var params = 'id=' +vkid+ '&amount=' + $rootScope.global_amount+ '&rights=' + $rootScope.global_rights;
            console.log(params);
            var rat = $resource('/rating?'+params, {}, {
                query: {method:'GET',isArray:false}
            });
            rat.query();
        });

    });


tryHskControllers.controller('loveCtrl', function ($scope, register, rating) {

});

tryHskControllers.controller('settingsCtrl', function ($scope, language) {
    $scope.languages = language.getLanguage();
    $scope.selections = [
        {name: 'russian',
            text: 'Русский'},
        {name: 'hanyu',
            text: '汉语'},
        {name: 'english',
            text: 'English'}
    ];

//    console.log($scope.select);

    $scope.nextWord = function () {
        language.select = $scope.select;
        $scope.languages = language.getLanguage();
        $scope.select = language.select;
    }
});

tryHskControllers.controller('treeviewCtrl', function ($scope, $rootScope, checkboxValues) {

    $rootScope.checkboxValues = checkboxValues.getCheckboxValues();
    $scope.checkboxValues = $rootScope.checkboxValues;
    $scope.$watch('checkboxValues', function () {
        checkboxValues.refreshCheckboxValues($scope.checkboxValues);
        $rootScope.checkboxValues = $scope.checkboxValues;
        try {
            $scope.$parent.refresh();
        } catch (e) {
        }
        try {
            $scope.$parent.fresh()
        } catch (e) {
        }
    }, true);
    $rootScope.$watch('checkboxValues', function () {
        $scope.checkboxValues = $rootScope.checkboxValues;
    }, true);
//   3 аргумент true важен в $watch так как из за него наблюдается весь обьект целиком
});


//$(document).ready(function () {
//    $('.toServer').click(function () {
//            var xhr = new XMLHttpRequest();
//            var id = 59379236;
//            var amount = 1000;
//            var rights = 500;
//            var params = 'id=' + encodeURIComponent(id)+ '&amount=' + encodeURIComponent(amount)+ '&rights=' + encodeURIComponent(rights);
//            alert(params);
//            xhr.open('GET', '/vote?'+params, true);
//
//            xhr.onreadystatechange = function() {
//                if (xhr.readyState != 4) return;
//
//                if (xhr.status != 200) {
//                    // обработать ошибку
//                    alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
//                    return;
//                }
//                // обработать результат
//                amount_global = JSON.parse(xhr.responseText);
//                console.log('+++++++++++++++++');
//                console.log(amount_global.amount);
//                console.log(amount_global);
//            };
//            xhr.send(null);
//        }
//    );
//});