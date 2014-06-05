'use strict';
//var b = {l:'lol',k:'kol',j:8,a: true,v: undefined}; for(keys in b) {console.log(keys)}
var peter = {
    name: 'Peter'
},
    zoya = {
    name: 'Zoya'
},
    say = function () {
        console.log('Hello! I\'m '+this.name)
    };
peter.say = say;
//zoya.sayHi = say;
peter['say']();
//peter.say.apply(zoya);
say.apply(zoya);

//function Test() {
//    var self = this;
//
//    console.log(this);
//    setTimeout(function() {
//        console.log('_____________');
//        console.log(this);
//        console.log("++++++++++++++++");
//        console.log(self);
//    }, 1000);
//}
//Test();
var myObj = {
    doSomething: function () {
        return function () {
            console.log(this);
        }.bind(this);
    }
};
var fn = myObj.doSomething();
fn();