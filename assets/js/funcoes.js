let btnNotacao = document.getElementById("rotacao");
let btnTranslacao = document.getElementById("translacao");
let btnCisalhamento = document.getElementById("cisalhamento");

/**
 * Configurações Iniciais do Chats
 */
var obj = {
  animationEnabled: true,
  zoomEnabled: true,
  title: {
    text: "Exemplicação usando um Plugin para mostrar no Plano",
  },
  axisX: {
    title: "X",
  },
  axisY: {
    title: "Y",
  },
  data: [
    {
      type: "scatter",
      toolTipContent: "<b>X:</b>{x}<br/><b>Y:</b>{y}",
      dataPoints: [],
    },
  ],
};

//Criei esta matriz para armazenar os pontos, quando se clica no plano
const matriz = [];

//Para se trabalhar com pontos:
const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reverse();

/**
 * Obtém as coordenadas quando passamos o mouse sobre o plano
 */
function cnvs_getCoordinates(e) {
  x = e.clientX;
  y = e.clientY;
  document.title = "Coordenadas: (" + x + "," + y + ")";
}

function cnvs_clearCoordinates() {
  document.title = "Matrizes de Transformação Geométrica";
}

//Pega uma matriz de ponto, por exemplo: x e y
//e multiplica por uma outra matriz e retorna uma nova
//coordenada
function projecaoDePonto(ponto, _matriz) {
  let x = Math.round(ponto[0] * _matriz[0][0] + ponto[1] * _matriz[0][1]);

  let y = Math.round(ponto[0] * _matriz[1][0] + ponto[1] * _matriz[1][1]);

  return { x, y };
}

/**
        @ponto uma matriz de coordenadas
        Matriz de rotação
        **/
function rotacao(ponto, angulo) {
  //A conversão é necessária,
  //pois as funções cos e sin de javascript
  //são retornadas em radianos
  let alfa = (angulo * Math.PI) / 180;

  let matrizRotacao = [
    [Math.cos(alfa), -Math.sin(alfa)],
    [Math.sin(alfa), Math.cos(alfa)],
  ];

  return projecaoDePonto(ponto, matrizRotacao);
}

/**
 *
 * */
function translacao(pontoinicial, matriz) {
  let x = pontoinicial[0] + matriz[0];

  let y = pontoinicial[1] + matriz[1];

  return { x: x, y: y };
}

/**
 * Para testar no geogebra: A = {{1,2},{0,1} }
 * */
function cisalhamento(ponto, a) {
  return projecaoDePonto(ponto, [[1, a], [0, 1]]);
}

/**
 *
 * @param {*} ponto
 */
function reflexaoEmX(ponto) {
  return projecaoDePonto(ponto, [[1, 0], [0, -1]]);
}

/**
 *
 * */
function reflexaoEmY(ponto) {
  return projecaoDePonto(ponto, [[-1, 0], [0, 1]]);
}

/**
 *
 */
function reflexaoOrigem(ponto) {
  return projecaoDePonto(ponto, [[-1, 0], [0, -1]]);
}

/**
 *
 * */
function escalamento(ponto, a, b) {
  return projecaoDePonto(ponto, [[a, 0], [0, b]]);
}

document.getElementById("coordiv").onclick = function(ev) {
  //Retira o último elemento da matriz:
  let letraPonto = alfabeto.pop();

  let x = ev.offsetX;

  let y = ev.offsetY;

  let ponto = `<span style="position:absolute;left:${x}px; top:${y}px;font-size:12px;"><span class="dot"></span> ${letraPonto} (${x},${y})</span><br/>`;

  let objCoord = { x: x, y: y };

  objCoord.letra = letraPonto;

  matriz.push(objCoord);

  $("#coordiv").append(ponto);

  //$('#get-pontos').append("PONTO: ").append(`${letraPonto}[${x},${y}]<br/>`);
};

let buttonCalcular = document.getElementById("calcular");
buttonCalcular.onclick = function() {
  for (let { x, y } of matriz) {
    let coord = escalamento([x, y], 5, 5);
    console.log(coord);
    obj.data[0].dataPoints.push({ x: coord.x, y: coord.y });
  }
};
//Quando soltar o mouse
buttonCalcular.onmouseup = function() {
  setTimeout(function() {
    console.log(obj);
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 1000);
};

let iniciar = false;

document.getElementById("reduzir-aumentar").oninput = function() {
  let valor = this.value;

  for (let { x, y } of matriz) {
    let data = reflexaoEmX([x, y]);

    obj.data[0].dataPoints.push({ x: data.x, y: data.y });

    /*console.log(escalamento([x, y], 3, 3));
                console.log(reflexaoEmX([x, y]));
                console.log(reflexaoEmY([x, y]));
                console.log(reflexaoOrigem([x, y]));
                console.log(efeitoCisalhamento([x, y], 2));
                ;*/
  }
};

document.getElementById("reduzir-aumentar").onmouseup = function() {
  iniciar = true;
  var chart = new CanvasJS.Chart("chartContainer", obj);
  chart.render();
};

//Para rotação:
btnNotacao.oninput = function() {
  let angulo = this.value;
  console.log(angulo);
  for (let { x, y } of matriz) {
    let coordenadas = rotacao([x, y], angulo);
    obj.data[0].dataPoints.push({ x: coordenadas.x, y: coordenadas.y });
  }
};

btnNotacao.onmouseup = function() {
  setTimeout(function() {
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 1000); //Espera-se um atraso de 1 segundo(1000 milésimo).
};

//Para translação:
btnTranslacao.onmouseup = function() {
  let angulo = this.value;
  for (let { x, y } of matriz) {
    console.log(x, y);
    let coordenadas = translacao([x, y], [parseInt(angulo), parseInt(angulo)]);
    obj.data[0].dataPoints.push({ x: coordenadas.x, y: coordenadas.y });
  }

  setTimeout(function() {
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 1000); //Espera-se um atraso de 1 segundo(1000 milésimo).
};

//btnCisalhamento: 
btnCisalhamento.onmouseup = function() {
  let valor = this.value;


  for (let { x, y } of matriz) {
    
    let coordenadas = cisalhamento([x, y], parseInt(valor));
    obj.data[0].dataPoints.push({ x: coordenadas.x, y: coordenadas.y });
  }


  console.log( obj.data[0].dataPoints);
  /*setTimeout(function() {
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 1000); //Espera-se um atraso de 1 segundo(1000 milésimo).
*/
};