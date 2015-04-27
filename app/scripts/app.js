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
      var prioridad = $("#cpu" + index + "priodad").val();
      prioridad = parseInt(prioridad);
      var process = new Process(rafaga, prioridad);

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

  function updateHTMLQueue(prioridad, cpu, queue){
    var tabla = TABLAS['tabla'+prioridad+'cpu'+cpu];
    var procesos = queue.asArray();
    tabla.html(procesos.map(processToHTML));
  }
  // $("#cpu1rafaga");
  // $("#cpu1priodad");
  // $("#cpu1agregar");
});
