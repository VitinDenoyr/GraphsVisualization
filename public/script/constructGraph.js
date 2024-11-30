function getRandomColor() {
    const randy = Math.floor(Math.random() * 16777215);
    return `#${randy.toString(16).padStart(6, '0')}`.toUpperCase();
}

//Funções de 'teoria das cores' para pegar uma fonte razoável

function getLuminance(hexa) {
    hexa = hexa.replace(/^#/, '');
    // RGB
    const r = parseInt(hexa.substr(0, 2), 16);
    const g = parseInt(hexa.substr(2, 2), 16);
    const b = parseInt(hexa.substr(4, 2), 16);
    //Luminância por definição
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getTextColor(hex) {
    return getLuminance(hex) > 0.5 ? '#000000' : '#FFFFFF'; // Preto fundo claro, branco fundo escuro
}

function getColorMap(vec){
    let mapy = new Map();
    for(let i = 0; i < vec.length; i++){
        mapy.set(`${vec[i]}`,`1`);
    }
    mapy.forEach((val,key) => {
        mapy.set(key,`${getRandomColor()}`);
    });
    return mapy;
}

function edgeFormat(ed){
    if(ed[0] < ed[1]){
        [ed[0], ed[1]] = [ed[1], ed[0]];
    }
    return `${ed[0]}-${ed[1]}`;
}

function printVisGraph(g){
    let edgeConst = Array(g[0].length).fill(1);
    let nodes = new vis.DataSet();
    let colorList = getColorMap(g[0]);
    let edgeMap = new Map();
    
    for(let i = 0; i < g[0].length; i++){
        nodes.add({id: i+1, label: `${g[0][i]}`, color: colorList.get(`${g[0][i]}`), font: { color: getTextColor(colorList.get(`${g[0][i]}`))}});
    }
    
    let edges = new vis.DataSet();
    for(let i = 1; i < g.length; i++){
        if(g[i][0] === g[i][1]){
            edges.add({from: (g[i][0]+1), to: (g[i][1]+1), selfReference:{size:8*edgeConst[g[i][0]], angle: edgeConst[g[i][0]]*(Math.PI/18), renderBehindTheNode: true}});
            edgeConst[g[i][0]] += 1;
        } else if(edgeMap.get(edgeFormat(g[i])) === undefined){
            edges.add({from: (g[i][0]+1), to: (g[i][1]+1)});
            edgeMap.set(edgeFormat(g[i]),1);
        } else {
            let idd = edgeMap.get(edgeFormat(g[i]));
            if(g[i][0] < g[i][1]){
                [g[i][0], g[i][1]] = [g[i][1], g[i][0]];
            }
            edges.add({from: (g[i][0]+1), to: (g[i][1]+1), smooth: {type: 'curvedCW', roundness: 0.2*idd}});
            edgeMap.set(edgeFormat(g[i]),idd+1);
        }
    }
    let container = document.getElementById('realizedGraph');
    
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        autoResize: true,
        physics: {
            enabled: true
        },
        edges: {
            smooth: {
                enabled: true,
                type: 'continuous',
                roundness: 0.5 // base roundness for all edges
            }
        }
    };
    
    let graph = new vis.Network(container, data, options);
}