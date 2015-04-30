/// <reference path="../../typings/jquery/jquery.d.ts"/>
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
};

var TERMINADOS = {
  terminados1: new Queue(),
  terminados2: new Queue(),
  terminados3: new Queue()
};

$(function(){
  QUEUES.prioridad1cpu1.setEnqueueCallback(appendListo);
  QUEUES.prioridad2cpu1.setEnqueueCallback(appendListo);
  QUEUES.prioridad3cpu1.setEnqueueCallback(appendListo);

  QUEUES.prioridad1cpu2.setEnqueueCallback(appendListo);
  QUEUES.prioridad2cpu2.setEnqueueCallback(appendListo);
  QUEUES.prioridad3cpu2.setEnqueueCallback(appendListo);

  QUEUES.prioridad1cpu3.setEnqueueCallback(appendListo);
  QUEUES.prioridad2cpu3.setEnqueueCallback(appendListo);
  QUEUES.prioridad3cpu3.setEnqueueCallback(appendListo);

  SUSPENDED.suspended1.setEnqueueCallback(appendSuspendido);
  SUSPENDED.suspended2.setEnqueueCallback(appendSuspendido);
  SUSPENDED.suspended3.setEnqueueCallback(appendSuspendido);

  TERMINADOS.terminados1.setEnqueueCallback(appendFinal);
  TERMINADOS.terminados2.setEnqueueCallback(appendFinal);
  TERMINADOS.terminados3.setEnqueueCallback(appendFinal);

  function addGantForProcess(cpu, nombre){
    var html =  '<div class="progress" id="'+nombre+'">' +
                  '<div style="position: absolute;" class="text-center">' + nombre +
                  '</div>' +
                '</div>';
    $('#gant'+cpu).append(html);
  }

  function initAgregarCpu (index){
    $("#cpu" + index + "agregar").click(function(){
      var rafaga = $("#cpu" + index + "rafaga").val();
      rafaga = parseInt(rafaga);
      var prioridad = $("#cpu" + index + "prioridad").val();
      prioridad = parseInt(prioridad);
      var process = new Process(rafaga, prioridad, null);

      var queue = QUEUES['prioridad' + prioridad + "cpu" + index];
      addGantForProcess(index, process.nombre);
      queue.enqueue(process);
      updateHTMLQueue(prioridad, index, queue);
    });
  }
  [1,2,3].forEach(initAgregarCpu);

  var TABLAS_HTML = {
    tabla1cpu1: $('#tabla1cpu1'),
    tabla2cpu1: $('#tabla2cpu1'),
    tabla3cpu1: $('#tabla3cpu1'),
    tabla1cpu2: $('#tabla1cpu2'),
    tabla2cpu2: $('#tabla2cpu2'),
    tabla3cpu2: $('#tabla3cpu2'),
    tabla1cpu3: $('#tabla1cpu3'),
    tabla2cpu3: $('#tabla2cpu3'),
    tabla3cpu3: $('#tabla3cpu3')
  };

  var SUSPENDIDOS_HTML = {
    suspendidos1: $('#suspendidos1'),
    suspendidos2: $('#suspendidos2'),
    suspendidos3: $('#suspendidos3')
  };

  var TERMINADOS_HTML = {
    terminados1: $('#terminados1'),
    terminados2: $('#terminados2'),
    terminados3: $('#terminados3')
  };

  var SECCION_HTML = {
    seccion1: $('#critico1'),
    seccion2: $('#critico2'),
    seccion3: $('#critico3')
  };

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
    if(!queue){
      queue = QUEUES['prioridad'+prioridad+'cpu'+cpu];
    }
    var tabla = TABLAS_HTML['tabla'+prioridad+'cpu'+cpu];
    var procesos = queue.asArray();
    tabla.html(procesos.map(processToHTML));
  }

  function updateSuspendedHTML(cpu, queue){
    var tabla = SUSPENDIDOS_HTML['suspendidos'+cpu];
    var procesos = queue.asArray();
    tabla.html(procesos.map(processToHTML));
  }

  function updateTerminadosHTML(cpu, queue){
    var tabla = TERMINADOS_HTML['terminados'+cpu];
    var procesos = queue.asArray();
    tabla.html(procesos.map(processToHTML));
  }

  function updateSeccionCriticaHTML(seccionCritica, cpu){
    var seccion = SECCION_HTML['seccion'+cpu];
    var html;
    if(seccionCritica.element){
      html =  '<div class="text-center text-'+PRIORIDAD_CSS_CLASS[seccionCritica.element.prioridad]+'">'+seccionCritica.element.nombre+'</div>'      +
              '<div class="text-center text-'+PRIORIDAD_CSS_CLASS[seccionCritica.element.prioridad]+'">Ejecucion: '+seccionCritica.current+'</div>'  +
              '<div class="text-center text-'+PRIORIDAD_CSS_CLASS[seccionCritica.element.prioridad]+'">Restante: '+seccionCritica.element.rafaga+'</div>';
    } else{
      html = '<div class="text-center">Vacio</div>';
    }
    seccion.html(html);
  }

  function appendBar(element, style){
    var htmlElement = $('#'+element.nombre);
    var html = '<div class="progress-bar progress-bar-'+style+'" style="width:0px"></div>';
    htmlElement.append(html);
  }

  function appendCritico(element){appendBar(element, 'success');};
  function appendListo(element){appendBar(element, 'warning');};
  function appendSuspendido(element){appendBar(element, 'danger');};
  function appendFinal(element){appendBar(element,'info');};



  function fillTime(element){
    var htmlElement = $('#'+element.nombre+' .progress-bar:last-child');
    var currentWidth = parseInt(htmlElement.css('width'));
    currentWidth += 10;
    htmlElement.css('width', currentWidth+'px');
  }

  function addTimeAll(){
    SECCIONES.seccionCritica1.element && fillTime(SECCIONES.seccionCritica1.element);
    SECCIONES.seccionCritica2.element && fillTime(SECCIONES.seccionCritica2.element);
    SECCIONES.seccionCritica3.element && fillTime(SECCIONES.seccionCritica3.element);
    QUEUES.prioridad1cpu1.iterate(fillTime);
    QUEUES.prioridad2cpu1.iterate(fillTime);
    QUEUES.prioridad3cpu1.iterate(fillTime);

    QUEUES.prioridad1cpu2.iterate(fillTime);
    QUEUES.prioridad2cpu2.iterate(fillTime);
    QUEUES.prioridad3cpu2.iterate(fillTime);

    QUEUES.prioridad1cpu3.iterate(fillTime);
    QUEUES.prioridad2cpu3.iterate(fillTime);
    QUEUES.prioridad3cpu3.iterate(fillTime);

    SUSPENDED.suspended1.iterate(fillTime);
    SUSPENDED.suspended2.iterate(fillTime);
    SUSPENDED.suspended3.iterate(fillTime);

    TERMINADOS.terminados1.iterate(fillTime);
    TERMINADOS.terminados2.iterate(fillTime);
    TERMINADOS.terminados3.iterate(fillTime);
  }

  // cada decima de segundo
  $('#iniciar').click(function(){
    $('#iniciar').unbind('click');
    var iteraciones = [0, 0, 0, 0];
    var interrupt = setInterval(function(){

      var parar = [true, true, true, true];
      [1,2,3].forEach(function(index){
        var seccionCritica = SECCIONES['seccionCritica' + index];
        var queue1 = QUEUES['prioridad1cpu'+index];
        var queue2 = QUEUES['prioridad2cpu'+index];
        var queue3 = QUEUES['prioridad3cpu'+index];
        var element = seccionCritica.element;


        if(element){
          if(element.prioridad == 3){
            processPrioridad3(element, seccionCritica, index);
          } else if(element.prioridad == 2){
            processPrioridad2(element, seccionCritica, index, queue2);
          } else{
            processPrioridad(element, seccionCritica, index);
          }
          iteraciones[index] += 1;
          parar[index] = false;
        } else{
          var suspended = SUSPENDED['suspended'+index];
          if(queue1.hasMoreElements()){
            seccionCritica.element = queue1.dequeue();
            updateHTMLQueue(1, index, queue1);
          } else if(suspended.hasMoreElements() && suspended.peek().prioridad == 1){
            seccionCritica.element = suspended.dequeue();
            updateSuspendedHTML(index, suspended);
          } else if(suspended.hasMoreElements() && suspended.peek().prioridad == 2){
            queue2.enqueue(suspended.dequeue());
            updateHTMLQueue(2, index, queue2);
            updateSuspendedHTML(index, suspended);
          } else if(queue2.hasMoreElements()){
            var removedLowest = getLowest(queue2);
            seccionCritica.element = removedLowest[0];//queue2.dequeue();
            queue2.first = removedLowest[1].first;
            updateHTMLQueue(2, index, queue2);
          } else if(queue3.hasMoreElements()){
            seccionCritica.element = queue3.dequeue();
            updateHTMLQueue(3, index, queue3);
          } else{
            parar[index] = true;
            return;
          }
          seccionCritica.element && appendCritico(seccionCritica.element);
          updateSeccionCriticaHTML(seccionCritica, index);
          parar[index] = false;
        }
      });
      if(parar.every(function(p){return p;})){
        var centecimas = iteraciones.slice(1);

        $('#myModal .modal-body').html(centecimas.map(function(centecima, index){
          var html = '<div>CPU'+(index+1)+' se ejecuto durante '+ centecima*0.1 +' segundos</div>';
          return html;
        }).join(''));
        $('#myModal').modal('show');
        clearInterval(interrupt);
      }
      addTimeAll();
    }, 100);
  });
  
  function processPrioridad3(element, seccionCritica, index){
    if(element.rafaga > 0){
      element.rafaga = parseFloat((element.rafaga-0.1).toFixed(1));
    } else{
      seccionCritica.element = null;
      seccionCritica.current = 0;
      var terminados = TERMINADOS['terminados'+index];
      terminados.enqueue(element);
      updateTerminadosHTML(index, terminados);
    }
    updateSeccionCriticaHTML(seccionCritica, index);
  }
  
  function processPrioridad2(element, seccionCritica, index, queue) {
    var removedLowest = getLowest(queue);
    console.log(removedLowest[0], removedLowest[1].asArray(), queue.asArray());
    var lowest = removedLowest[0];
    if(element.rafaga > 0){
      element.rafaga = parseFloat((element.rafaga-0.1).toFixed(1));
      if(lowest && lowest.rafaga < element.rafaga){
        var suspended = SUSPENDED['suspended'+index];
        queue.first = removedLowest[1].first;
        seccionCritica.element = lowest;
        seccionCritica.current = 0;
        appendCritico(seccionCritica.element);
        suspended.enqueue(element);
        updateSuspendedHTML(index, suspended);
      }
      seccionCritica.current += 1;
    } else{
      seccionCritica.current = 0;
      var terminados = TERMINADOS['terminados'+index];
      terminados.enqueue(element);
      seccionCritica.element = null;
      updateTerminadosHTML(index, terminados);
    }
    updateSeccionCriticaHTML(seccionCritica, index);
  }

  function processPrioridad(element, seccionCritica, index){
    var compareQuantum = seccionCritica.quantum * 10;
    if(element.rafaga > 0){
      element.rafaga = parseFloat((element.rafaga-0.1).toFixed(1));
      if(seccionCritica.current >= compareQuantum){
        var suspended = SUSPENDED['suspended' + index];
        suspended.enqueue(element);
        seccionCritica.element = null;
        seccionCritica.current = 0;
        updateSuspendedHTML(index, suspended);
      }
      seccionCritica.current += 1;
    } else{
      seccionCritica.current = 0;
      var terminados = TERMINADOS['terminados'+index];
      terminados.enqueue(element);
      seccionCritica.element = null;
      updateTerminadosHTML(index, terminados);
    }
    updateSeccionCriticaHTML(seccionCritica, index);
  }
});
