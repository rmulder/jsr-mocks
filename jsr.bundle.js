(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.jsr = require('./jsr-mocks');

},{"./jsr-mocks":2}],2:[function(require,module,exports){
//if we can't find a specific jsr mock method
var genericMock ={
    method : function(args){
        alert('generic mock args:', args);
    },
    timeout : 500 //half second
};

var $mocks =  {};

var setMocks = function(location){
    $mocks = location;
};

if (!window.Visualforce){
    
    window.Visualforce = {
        //Visualforce.remoting.Manager.invokeAction
        remoting :{
            Manager:{
                invokeAction: function(){
                    var lastArg = arguments[arguments.length - 1],
                        callback = lastArg,
                        mock = $mocks[arguments[0]] || genericMock,
                        result = mock.method(arguments) ,
                        event = {status : true};
                    if(typeof(callback) === 'object'){
                        callback = arguments[arguments.length - 2];
                    }
                    setTimeout(function(){
                        callback(result,event);
                    },mock.timeout);
                }
            }
        }
    };
}

var promise = function(request) {

    
    return new Promise(function(resolve, reject) {

        var parameters = [request.method];

        if (request.args) {

            for (var i = 0; i < request.args.length; i++) {
                parameters.push(request.args[i]);
            }
        }

        var callback = function(result, event) {

            if (event.status) {

                resolve(result);
            } else {
                reject(event);
            }

        };

        parameters.push(callback);

        if (request.options) {
            parameters.push(request.options);
        }

        Visualforce.remoting.Manager.invokeAction.apply(Visualforce.remoting.Manager, parameters);
    });


};

exports.promise = promise;
exports.setMocks = setMocks;

},{}]},{},[1]);
