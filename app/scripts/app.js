'use strict';
$(function(){
  var queue = new Queue();
  var suspendedQueue = new Queue();
  var suspendedView = $('#suspended');
  var readyView = $('#process-ready-view');
  var finishedView = $('#finished');
  var finishedElements = [];
  var gant = $('#gant');

  function drawReadyQueue(){
    readyView.html(queueAsTable(queue));
  }

  queue.setEnqueueCallback(drawReadyQueue);

  function drawSuspendedQueue(){
    suspendedView.html(queueAsTable(suspendedQueue));
  }
  suspendedQueue.setEnqueueCallback(drawSuspendedQueue);

  function queueAsTable(queue){
    return queue.values().map(function(element){
      var html = '<tr><td>' + element.index + '</td>' +
        '<td>' + element.rafaga.toPrecision(3) + '</td></tr>';
      return $(html);
    });
  }

  function getProcess(){
    var value = $('#rafaga').val();
    console.log('value', value);
    var rafaga = parseInt(value);
    return new Element(rafaga);
  }

  function addToFinished(element){
    finishedElements.push(element);

    finishedView.html(finishedElements.map(
      function(element){
        var html = '<tr><td>' + element.index + '</td>' +
          '<td>' + element.original + '</td></tr>';
        return $(html);
      })
    );
  }

  $('#iniciar').click(function(){
    var leftOffset = 0;
    var elementOffset = 0;
    var element = queue.dequeue();
    var currentProcess = $('#current-process');
    var currentRafaga = $('#current-rafaga');
    if(element){
      currentProcess.html(element.index);
      var intervalStop = setInterval(function(){
        if(!element){
          clearInterval(intervalStop);
          return;
        }
        if(element.rafaga > 0){
          leftOffset += 5;
          var posibleElement = queue.peek();
          if(posibleElement && posibleElement.rafaga < element.rafaga){
            suspendedQueue.enqueue(element);
            element = queue.dequeue();
            elementOffset = leftOffset;
          }
          // addBlock(element.index, elementOffset);
          addBlock(element.index, leftOffset);
          element.rafaga = element.rafaga - 0.1;
          currentRafaga.html(element.rafaga > 0 ? element.rafaga.toPrecision(3) : 0);
        } else {
          addToFinished(element);
          if(suspendedQueue.hasMoreElements()){
            element = suspendedQueue.dequeue();
            drawSuspendedQueue();
          }else{
            element = queue.dequeue();
            drawReadyQueue();
          }
          if(element){
            elementOffset = leftOffset;
            currentProcess.html(element.index);
            readyView.html(queueAsTable(queue));
          }
        }
      }, 100);
    }
  });

  function addBlock(index, offset){
    var span = document.createElement('span');
    span.style.left = offset + "px";
    span.className = 'bloque';
    $('#' + index).append(span);
  }

  function addGantRow(element){
    gant.append('<div class="form-group">' +
    '<label class="control-label col-sm-1">' + element.index +'</label>' +
    '<div class="col-sm-11"><div id="' + element.index + '" class="form-control"></div></div></div>')
  }

  $('#agregar').click(function(){
    var element = getProcess();
    addGantRow(element);
    queue.enqueue(element);
  });
});
