'use strict';

var PRIORIDAD_CSS_CLASS = {
  1: 'success',
  2: 'info',
  3: 'warning'
};

var QUEUES = {
  prioridad1cpu1: new Queue(),
  prioridad2cpu1: new Queue(),
  prioridad3cpu1: new Queue(),

  prioridad1cpu2: new Queue(),
  prioridad2cpu2: new Queue(),
  prioridad3cpu2: new Queue(),

  prioridad1cpu3: new Queue(),
  prioridad2cpu3: new Queue(),
  prioridad3cpu3: new Queue()
};

var SUSPENDED = {
  suspended1: new Queue(),
  suspended2: new Queue(),
  suspended3: new Queue()
}

var TERMINADOS = {
  terminados1: new Queue(),
  terminados2: new Queue(),
  terminados3: new Queue()
}

$(function(){
  function addGantForProcess(cpu, nombre){
    var html =  '<div class="progress" id="'+nombre+'">' +
                  '<div style="position: relative;" class="text-center">' + nombre +
                  '</div>'
                '</div>';
    $('#gant'+cpu).append(html);
  }

  function initAgregarCpu (index){
    $("#cpu" + index + "agregar").click(function(){
      var rafaga = $("#cpu" + index + "rafaga").val();
      rafaga = parseInt(rafaga);
      var prioridad = $("#cpu" + index + "prioridad").val();
      prioridad = parseInt(prioridad);
      var process = new Process(rafaga, prioridad);

      console.log('prioridad' + prioridad + "cpu" + index);

      var queue = QUEUES['prioridad' + prioridad + "cpu" + index];
      queue.enqueue(process);
      updateHTMLQueue(prioridad, index, queue);
      addGantForProcess(index, process.nombre);
    });
  }
  [1,2,3].forEach(initAgregarCpu);

  var TABLAS = {
    tabla1cpu1: $('#tabla1cpu1'),
    tabla2cpu1: $('#tabla2cpu1'),
    tabla3cpu1: $('#tabla3cpu1'),
    tabla1cpu2: $('#tabla1cpu2'),
    tabla2cpu2: $('#tabla2cpu2'),
    tabla3cpu2: $('#tabla3cpu2'),
    tabla1cpu3: $('#tabla1cpu3'),
    tabla2cpu3: $('#tabla2cpu3'),
    tabla3cpu3: $('#tabla3cpu3')
  }

  function processToHTML(process){
    var html =  '<tr class="'+PRIORIDAD_CSS_CLASS[process.prioridad]+'">' +
                  '<td>'+process.nombre+'</td>' +
                  '<td>'+process.rafaga+'</td>' +
                '</tr>';
    return html;
  }

  var SECCIONES = {};
  [1,2,3].forEach(function(index){
    SECCIONES['seccionCritica' + index] = {
        element: null,
        quantum: 2,
        current: 0
    };
  });

  function updateHTMLQueue(prioridad, cpu, queue){
    var tabla = TABLAS['tabla'+prioridad+'cpu'+cpu];
    var procesos = queue.asArray();
    tabla.html(procesos.map(processToHTML));
  }

  // cada decima de segundo
  setInterval = function(fn){fn();};
  $('#iniciar').click(function(){
    console.log('asd');
    var interrupt = setInterval(function(){
      [1,2,3].forEach(function(index){
        var seccionCritica = SECCIONES['seccionCritica' + index];
        var queue1 = QUEUES['prioridad1cpu'+index];
        var queue2 = QUEUES['prioridad2cpu'+index];
        var queue3 = QUEUES['prioridad3cpu'+index];
        var element = seccionCritica.element;

        if(element){
          switch(element.prioridad){
            case 1:
              processPrioridad1(element, seccionCritica, index);
              break;
            case 2:
              processPrioridad2(element, seccionCritica, index);
              break;
            case 3:
              processPrioridad3(element, seccionCritica, index);
          }
        } else if(queue1.hasMoreElements()){
          seccionCritica.element = queue1.dequeue();
        }
      });
    }, 100);
    // this.unbind('click');
  });

    function processPrioridad1(element, seccionCritica, index){
      var prioridad = element.prioridad;
      var compareQuantum = seccionCritica.quantum;

      var suspended = SUSPENDED['suspended' + index];
      console.log('element', element);
      console.log('seccionCritica', seccionCritica);
      if(element.rafaga > 0){
        seccionCritica.current += 1;
        if(seccionCritica.current >= compareQuantum){
          suspended.enqueue(element);
          seccionCritica.element = null;
        }
        element.rafaga = parseFloat((element.rafaga-0.1).toFixed(1));
      } else{
        seccionCritica.current = 0;
        TERMINADOS['terminados'+index].enqueue(element);
        seccionCritica.element = null;
      }
    }

    function processPrioridad2(element, seccionCritica, index){

    }

    function processPrioridad3(element, seccionCritica, index){

    }

});
