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

console.log("Write an element function that takes an array and a generator and returns a generator that will");
console.log("produce elements from the array.");

//function element(array, generator=fromTo(0, array.length)) {
function element(array, generator) {
    if (generator === undefined) {
        generator = fromTo(
            0,
            array.length
        );
    }
    return function () {
        //return array[generator()];
        var index = generator();
        if (index !== undefined) {
            return array[index];
        }
    };
}

var ele = element([
    'a', 'b', 'c', 'd'
], fromTo(1, 3));

console.log("var ele = element([");
console.log("    'a', 'b', 'c', 'd'");
console.log("], fromTo(1, 3))");
console.log("ele() == 'b'", ele());
console.log("ele() == 'c'", ele());
console.log("ele() == undefined", ele());

console.log("Modify the element function so that the generator argument is optional. If a");
console.log(" generator is not provided, then each of the elements of the array will the produced");
console.log("var ele = element([");

ele = element([
    'a', 'b', 'c', 'd'
]);
console.log("    'a', 'b', 'c', 'd'[);");
console.log("ele() == 'a'", ele());
console.log("ele() == 'b'", ele());
console.log("ele() == 'c'", ele());
console.log("ele() == 'd'", ele());
console.log("ele() == undefined", ele());

console.log("Write a collect function that takes a generator and an array and");
console.log("produces a function that will collect the results in the array");

function collect(generator, array) {
    if (generator === undefined) {
        generator = from(0);
    }
    var index = from(0);
    return function () {
        var value = generator();
        if (value !== undefined) {
            array[index()] = value;
        }
        return value;
    };
}

var array = [],
    col = collect(fromTo(0, 2), array);
console.log("col() == 0", col());
console.log("col() == 1", col());
console.log("col() == undefined", col());
console.log("array", array);


console.log("Write a filter function that takes a generator and a predicate and produces a");
console.log("generattor that produces only the values approved by the predicated");

function filter(generator, func) {
    return function gen() {
        var value = generator();
        while (value !== undefined) {
            if (func(value) === true) {
                return value;
            }
            value = generator();
        }
    };
}

var fil = filter(fromTo(0, 5),
        function third(value) {
    return (value % 3) === 0;
});
console.log("fil() == 0", fil());
console.log("fil() == 3", fil());
console.log("fil() == undefined", fil());
console.log("fil() == undefined", fil());
console.log("fil() == undefined", fil());

console.log("Write a concat funcion that takes two generators and produces a");
console.log("generator that combines the sequences");

function concat(gen1, gen2) {
    return function () {
        var value1 = gen1();
        if (value1 === undefined) {
            return gen2();
        }
        return value1;
    };
}

var con = concat(fromTo(0, 3),
        fromTo(0, 2));
console.log("con() == 0", con());
console.log("con() == 1", con());
console.log("con() == 2", con());
console.log("con() == 0", con());
console.log("con() == 1", con());
console.log("con() == undefined", con());

console.log("Make a function gensymf that makes a function that generates unique symbols");
function gensymf(symbol) {
    var id = from(1);
    return function () {
        return `${symbol}${id()}`;
    };
}

var geng = gensymf("G"),
    genh = gensymf("H");

console.log("geng() == 0", geng());
console.log("genh() == 0", genh());
console.log("geng() == 0", geng());
console.log("genh() == 0", genh());

console.log("Make a function fibonaccif that returns a generator that will return the next fibonacci number");

function fibonaccif(a, b) {
    var i = 0;
    return function () {
        var next;
        switch (i) {
        case 0:
            i = 1;
            return a;
        case 1:
            i = 2;
            return b;
        default:
            next = a + b;
            a = b;
            b = next;
            return next;
        }
    };
}

var fib = fibonaccif(0, 1);
console.log("fib() == 0", fib());
console.log("fib() == 1", fib());
console.log("fib() == 1", fib());
console.log("fib() == 2", fib());
console.log("fib() == 3", fib());
console.log("fib() == 5", fib());

console.log("Write a counter function that returhns an object containing two functions that");
console.log("implement an up/down counter hiding the counter");

function counter(start) {
    var up = function () {
        start += 1;
        return start;
    };

    var down = function () {
        start -= 1;
        return start;
    };
    return {
        up: up,
        down: down
    };
}

var object = counter(10),
    up = object.up,
    down = object.down;
console.log("up() == 11", up());
console.log("down() == 10", down());
console.log("down() == 9", down());
console.log("up() == 10", up());

console.log("Make a revocable function that takes a binary function and returns an object containing an invoke");
console.log("function that can invoke the binary function and a revoke function aht disables the invoke function");

function revocable(func) {
    return {
        invoke: function (x, y) {
            if (func !== undefined) {
                return func(
                    x,
                    y
                );
            }
        },
        revoke: function () {
            func = undefined;
        }
    };
}

var rev = revocable(add),
    add_rev = rev.invoke;
console.log("add_rev(3, 4) == 7", add_rev(3, 4));
rev.revoke();
console.log("add_rev(5, 4) == undefined", add_rev(5, 7));

function m(value, source) {
    return {
        value: value,
        source: (typeof source === 'string')
            ? source
            : String(value)
    };
}

console.log("Write a function addm that takes two m objects and returns an m object.");
console.log(JSON.stringify(addm(m(3), m(4))), {"value": 7, "source":"(3+4)"});
console.log(JSON.stringify(addm(m(1), m(Math.PI, "pi"))), {"value": 4.14159, "source":"(1+pi)"});