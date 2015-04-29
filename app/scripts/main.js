/* jshint devel:true */
'use strict';

// Queue class
function Queue(){
  this.first = null;
  this.dequeue = function(){
    var current = this.first;
    if(current){
      this.first = this.first.next();
      return current.value;
    }
  };
  this.enqueue = function(value){
    if(this.first){
      var current = this.first;
      while(current.hasNext()){
        current = current.next();
      }
      current.add(new Element(value));
    } else {
      this.first = new Element(value);
    }
    this.callback && this.callback(value);
  };
  this.hasMoreElements = function(){
    return !!this.first;
  };
  this.peek = function(){
    return this.first && this.first.value;
  };
  this.setEnqueueCallback = function(callback){
    this.callback = callback;
  };
  this.clone = function(){
    var result = new Queue();
    this.iterate(result.enqueue.bind(result));
    return result;
  };
  this.iterate = function(consumer){
    var result = new Queue();
    var current = this.first;
    while(current){
      consumer(current.value);
      current = current.next();
    }
    return result;
  };
  this.asArray = function(){
    var result = [];
    this.iterate(result.push.bind(result));
    return result;
  }
}

// Queue Element class
function Element(value){
  this.original = value;
  this.value = value;
  this.index = Element.index++;
  this.nextNode = null;
  this.next = function(){
    return this.nextNode;
  };
  this.hasNext = function(){
    return !!this.nextNode;
  };
  this.add = function(element){
    this.nextNode = element;
  };
}
Element.index = 0;

// Process class
function Process(/*nombre, */rafaga, prioridad, recurso){
  // this.nombre = nombre;
  this.original = rafaga;
  this.nombre = 'Proc-' + Process.index++;
  this.rafaga = rafaga;
  this.prioridad = prioridad;
  this.recurso = recurso;
}
Process.index = 0;

// var queue = new Queue();
// queue.enqueue(1);
// queue.enqueue(2);
// var copy = queue.clone();
// console.log(queue.dequeue());
// console.log(queue.clone().dequeue());
// console.log(queue.peek());
// console.log(copy.asArray());
