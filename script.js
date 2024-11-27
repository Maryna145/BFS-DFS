
function buildGraph() {
  //отримуємо матрицю суміжності з текстової області
  let input = document.getElementById("matrixInput1").value.trim();
  let rows = input.split("\n");
  let adjacencyMatrix = rows.map(function (row) {
    return row.trim().split(/\s+/).map(Number);
  });

  let size = adjacencyMatrix.length;
  //тип графа орієнтований чи ні
  let graphType = document.querySelector(
    'input[name="graphType"]:checked'
  ).value;
  let isDirected = graphType === "directed";

  //створення вершин
  nodes = new vis.DataSet();
  for (let i = 0; i < size; i++) {
    nodes.add({ id: i + 1, label: "x" + (i + 1) });
  }

  //створення ребер за матрицею суміжності
  edges = new vis.DataSet();
  let edgeIdCounter = 1;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let edgeCount = adjacencyMatrix[i][j];
      for (let k = 0; k < edgeCount; k++) {
        //для неорієнтованого графа додаємо одне ребро
        if (!isDirected && i > j) continue;

        edges.add({
          id: edgeIdCounter,
          from: i + 1,
          to: j + 1,
          label: "y" + edgeIdCounter,
          arrows: isDirected ? "to" : undefined,
        });
        edgeIdCounter++;
      }
    }
  }

  //граф
  let container = document.getElementById("mynetwork");
  let data = { nodes: nodes, edges: edges };
  let options = {
    nodes: {
      size: 16,
      font: {
        size: 14,
        color: "#000000",
      },
      borderWidth: 2,
    },
    edges: {
      width: 2,
      color: { inherit: "from" },
      font: {
        size: 12,
        color: "black",
        background: "none",
        strokeWidth: 0,
      },
    },
  };

  window.network = new vis.Network(container, data, options);
}
//обхід в ширину
function bfsTraversal() {
  //початкова вершина
  let startNode = parseInt(document.getElementById("startNode").value);
  if (isNaN(startNode) || startNode < 1 || startNode > nodes.length) {
    alert("Введіть коректну початкову вершину.");
    return;
  }

  let visited = new Set();//для унікальних вершин
  let queue = [startNode];
  let order = 1; //номер проходу
  let visitedList = []; //порядок відвіданих вершин

  //BFS
  while (queue.length > 0) {
    let currentNode = queue.shift();//отримуємо вершину з черги 

    if (!visited.has(currentNode)) {//чи немає поточної вершини в списку відвіданих
      visited.add(currentNode);//додаємо вершину до відвіданих
      visitedList.push(currentNode);

      //додаємо мітку вузла з номером проходу
      nodes.update({ id: currentNode, label: "x" + currentNode + " (" + order + ")" });
      order++;

      //додаємо сусідні вузли у чергу: Якщо ребро починається (from) або закінчується (to) поточною вершиною, і сусідня вершина ще не відвідана
      edges.forEach((edge) => {
        if (edge.from === currentNode && !visited.has(edge.to)) {
          queue.push(edge.to);//додаємо її у чергу 
        } else if (edge.to === currentNode && !visited.has(edge.from)) {
          queue.push(edge.from);
        }
      });
    }
  }

  // Виводимо список відвіданих вершин
  document.getElementById("bfsOutput").textContent = "Порядок обходу в ширину: " + visitedList.join(", ");
}


//обхід в глибину
function dfsTraversal() {
//початкова вершина
let startNode = parseInt(document.getElementById("startNode").value);
if (isNaN(startNode) || startNode < 1 || startNode > nodes.length) {
  alert("Введіть коректну початкову вершину.");
  return;
}

let visited = new Set(); //для унікальних відвіданих вершин
let stack = [startNode]; //стек для DFS
let visitedList = []; //порядок відвідування
let order = 1; //номер проходу

//DFS
while (stack.length > 0) {
  let currentNode = stack.pop(); //беремо вершину зі стеку

  if (!visited.has(currentNode)) {
    visited.add(currentNode); //позначаємо як відвідану
    visitedList.push(currentNode);

    //оновлюємо мітку вузла з номером проходу
    nodes.update({ id: currentNode, label: "x" + currentNode + " (" + order + ")" });
    order++;

    //додаємо сусідні вузли до стеку
    edges.forEach((edge) => {
      if (edge.from === currentNode && !visited.has(edge.to)) {
        stack.push(edge.to); //додаємо сусіда у стек
      } else if (edge.to === currentNode && !visited.has(edge.from)) {
        stack.push(edge.from);
      }
    });
  }
}
//виводимо список відвіданих вершин
document.getElementById("dfsOutput").textContent = "Порядок обходу в глибину: " + visitedList.join(", ");
}

//побудова графа при завантаженні сторінки
window.onload = buildGraph;
function Clean() {
  document.getElementById("matrixInput1").value = " ";
}