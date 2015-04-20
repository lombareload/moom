/* jshint devel:true */
'use strict';

function Queue(){
  this.first = null;
  this.dequeue = function(){
    current = this.first;
    if(current){
      this.first = first.next();
      return current.rafaga;
    }
  };
  this.enqueue = function(value){
    if(this.first){
      var current = this.first;
      while(current.hasNext()){
        current = current.hasNext();
      }
      current.add(new Element(value));
    } else {
      this.first = new Element(value);
    }
    this.callback();
  };
  this.hasMoreElements = function(){
    return !!this.first;
  };
  this.peek = function(){
    return this.first;
  };
  this.setEnqueueCallback = function(callback){
    this.callback = callback;
  }
}

function Element(rafaga){
  this.original = rafaga;
  this.rafaga = rafaga;
  this.index = Element.index++;
  this.nextNode = null;
  this.next = function(){
    return this.nextNode;
  };
  this.hasNext = function(){
    return !!this.nextNode;
  };
  this.add = function(element){
    this.next = element;
  }
}
Element.index = 0;


// function Queue(){
//   this.list = new Element();
//   this.enqueue = function(element){
//
//
//     this.data.push(element);
//     this.data.sort(function(e1, e2){
//       return e1.rafaga < e2.rafaga;
//     });
//     this.callback && this.callback();
//   };
//   this.dequeue = function(){
//     return this.data.pop();
//   };
//   this.values = function(){
//     return this.data;
//   };
//   this.hasMoreElements = function(){
//     return this.data.length > 0;
//   };
//   this.peek = function(){
//     if(this.hasMoreElements()){
//       return this.data[this.data.length-1];
//     }
//   }
//   this.setEnqueueCallback = function(callback){
//     this.callback = callback;
//   }
// }
