 /*jslint devel: true */

/**
 * Own implementation: Works the same as below
 * var add = function(x, y) {
 *   return x + y;
 *   }
 *   var sub = function(x, y) {
 *       return x - y;
 *   }
 *   var mul = function(x, y) {
 *       return x * y;
 *   }
 **/

"use strict";

function add(x, y) {
    return x + y;
}

function sub(x, y) {
    return x - y;
}

function mul(x, y) {
    return x * y;
}
console.log("3 + 4 = 7: ", add(3, 4));
console.log("3 - 4 = -1: ", sub(3, 4));
console.log("3 * 4 = 12:", mul(3, 4));


function identityf(n) {
    /**this.arg = n;
    *var that = function() {
    *    return this.arg;
    *}
    *return that;
    **/
    return function () {
        return n;
    };
}
var three = identityf(3);
console.log("var three = identityf(3);");
console.log("three() == 3: ", three());


function addf(x) {
    return function (y) {
        return x + y;
    };
}
console.log("addf(3)(4) == 7: ", addf(3)(4));

function liftf(func) {
    // This is a higher order function
    return function (x) {
        return function (y) {
            return func(x, y);
        };
    };
}
console.log("liftf(mul)(5)(6) == 30: ", liftf(mul)(5)(6));


// Challenge 2:

function curry(func, x) {
    //return function(y) {
    //    return func(x, y);
    //};
    return liftf(func)(x);
}

console.log("curry(mul, 5)(6) == 30: ", curry(mul, 5)(6));

var inc = addf(1);
console.log("1. inc(5) == 6", inc(5));

inc = liftf(add)(1);
console.log("2. inc(5) == 6", inc(5));

inc = curry(add, 1);
console.log("3. inc(5) == 6", inc(5));


// Challenge 3:
function twice(func) {
    return function (x) {
        return func(x, x);
    };
}
var doubl = twice(add);
console.log("var doubl = twice(11)");
console.log("doubl(11) == 22 :", doubl(11));

var square = twice(mul);
console.log("var square = twice(11)");
console.log("square(11) == 121 :", square(11));

function reverse(func) {
    return function (x, y) {
        return func(y, x);
    };
}
var bus = reverse(sub);
console.log("var bus = reverse(sub)");
console.log("bus(3, 2)i == -1 :", bus(3, 2));

function composeu(func1, func2) {
    return function (x) {
        return func2(func1(x));
    };
}
console.log("composeu(doubl, square)(5) == 100", composeu(doubl, square)(5));

function composeb(func1, func2) {
    return function (x, y, z) {
        return func2(func1(x, y), z);
    };
}
console.log("composeb(add, mul)(2, 3, 7) == 35", composeb(add, mul)(2, 3, 7));


function limit(func, limit) {
    return function (x, y) {
        if (limit === 0) {
            return undefined;
        }
        limit -= 1;
        return func(x, y);
    };
}

var add_ltf = limit(add, 2);
console.log("add_ltd(3, 4) == 7", add_ltf(3, 4));
console.log("add_ltd(3, 5)== 8", add_ltf(3, 5));
console.log("add_ltd(3, 5)== defined", add_ltf(3, 5));

function from(index) {
    var start = index;
    var next = 0;
    return function () {
        next = start;
        start += 1;
        return next;
    };
}

var index = from(0);
console.log("index() == 0", index());
console.log("index() == 1", index());
console.log("index() == 2", index());

function to(from_func, x) {
    var start = from_func(x);
    var next = 0;
    return function () {
        next = start;
        if (next === x) {
            return undefined;
        }
        start += 1;
        return next;
    };
}

index = to(from(1), 3);
console.log("var index = to(from(1), 3");
console.log("index() == 1", index());
console.log("index() == 2", index());
console.log("index() == undefined", index());

function fromTo(start, end) {
    var gen = to(from(start), end);
    return function () {
        return gen();
    };
}

index = fromTo(0, 3);
console.log("var index = fromTo(0, 3)");
console.log("index() == 0", index());
console.log("index() == 1", index());
console.log("index() == 2", index());
console.log("index() == undefined", index());
