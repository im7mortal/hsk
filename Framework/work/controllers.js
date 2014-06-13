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
    function ($scope, $rootScope, Word, sortWords, amountWords, $timeout, StateManager, $resource) {
        var question
            , swords
            , arr = new Array(10)
            , wordsTests = [
                {},
                {},
                {},
                {}
            ]
            , test_randoms = []
            ,result_client;

        StateManager.add('d');
        var params ='id=' +vkid;
        $resource('/register?' + params, {}, {
            query: {method:'GET',isArray:false}
        }).query().$promise.then(function(stat) {
                $scope.amountOfTry = parseInt(stat.amount);
                $scope.rights = parseInt(stat.rights);
                $scope.rating =  stat.rating;
            });


        $scope.$watch('rights', function () {
            var params ='id=' +vkid+ '&amount=' + $scope.amountOfTry + '&rights=' + $scope.rights;
            $resource('/rating?'+ params, {}, {
                query: {method:'GET',isArray:false}
            }).query().$promise.then(function(stat) {
                    $scope.rating =  stat.rating;
                });
         }, true);


        $scope.checkAnswer = function (ansv) {
            try {
                result_client.check(ansv)
            } catch (e) {
            }
            result_client = null;
        };


        function Hamster() {
        }
        Hamster.prototype.check = function (ansv) {
            if (ansv) {
                $scope.rights = ++$scope.rights;
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
//Создаёт 4 обьекта по id из  generate_var
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
            result_client= null;
            result_client = new Hamster();
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
            $scope.amountOfTry = ++$scope.amountOfTry;
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
                $scope.fill(swords);

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
                    $scope.fill(words);



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
    });


tryHskControllers.controller('loveCtrl', function ($scope) {

});

tryHskControllers.controller('ratingCtrl', function ($scope, $resource, $timeout) {

    $resource('/users', {}, {
        query: {method: 'GET', isArray: true }
    }).query().$promise.then(function (users) {
            console.log(users);


            var new_array = [];
            for (var i = 0; i < users.length; i++) {
                (function () {
                    var new_object = {};
                    if (users.length == 0) {
                        //todo обработать ошибку
                    } else {
                        VK.api("users.get", {user_ids: users[i].id, fields: "photo_medium"}, function (data) {
                            // Действия с полученными данными
                            new_object.photo_medium = data.response[0].photo_medium;
                            new_object.first_name = data.response[0].first_name;
                            new_object.last_name = data.response[0].last_name;
                            new_object.rating = users[i].rating;
                            new_array.push(new_object);
                        });
                    }

                })();




            }

            $timeout(function() {
                console.log(new_array);
                $scope.users = new_array;
            }, 10000);


//
//            function vis_rat(){
//                var deferred = $q.defer();
//
//                deferred.resolve(
//                    {vis:function() {
//                        var new_array = [];
//                        for (var i = 0; i < users.length; i++) {
//                            var new_object = {};
//                            if (users.length == 0) {
//                                //todo обработать ошибку
//                            } else {
//                                VK.api("users.get", {user_ids: users[i].id, fields: "photo_medium"}, function (data) {
//                                    // Действия с полученными данными
//                                    new_object.photo_medium = data.response[0].photo_medium;
//                                    new_object.first_name = data.response[0].first_name;
//                                    new_object.last_name = data.response[0].last_name;
//                                    new_array.push(new_object)
//                                });
//                            }
//                        }
//                        console.log(new_array);
//                        return new_array;
//                    }
//                    }
//                );
//                return deferred.promise;
//            }
//
//            vis_rat.vis().then(function (words) {
//                console.log('llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll');
//                console.log(words);
//                $scope.users = words;
//            })
        });


    $scope.predicate = 'id';
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

    $scope.nextWord = function () {
        language.select = $scope.select;
        $scope.languages = language.getLanguage();
        $scope.select = language.select;
    }
});

tryHskControllers.controller('checkboxCtrl', function ($scope, $rootScope, checkboxValues) {

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