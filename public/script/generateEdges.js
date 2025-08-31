function convert(s){
    return (s.replace(/[^\d\s]/g,' ').replace(/\s+/g,' ').trim());
}

function vectorize(s){
    let d = s.split(' ');
    for(let i = 0; i < d.length; i++){
        d[i] = Number(d[i]);
    }
    return d;
}

//Apenas coloquei as funções principais, tem algumas outras auxiliares e também as que interagem com o vis.js que posso mostrar depois se necessário, mas no geral tá no site que mostrei: graphs.denoyr.com.br. O código está bem grande e complexo pois não me importei com maximizar a eficiência visto que o escopo dos grafos que nossa mente pode processar informações relevantes olhando o gráfico é cobrido de forma mais rápida que o necessário mesmo com uma complexidade "ruim"

function evenSum(d){ //Valida a primeira condição, para criar um multigrafo
    let sum = 0;
    for(let i = 0; i < d.length; i++){
        sum += d[i];
    }
    return (sum%2 === 0);
}

function validate(d){ //Valida a segunda condição, para criar um grafo simples
    let sum = 0;
    d.sort((a,b) => b-a);
    for(let k = 1; k <= d.length; k++){
        sum += d[k-1];
        let minSum = 0;
        for(let j = k+1; j <= d.length; j++){
            minSum += Math.min(k, d[j-1]);
        }
        if(sum > k*(k-1) + minSum) return false;
    }
    return true;
}

function getMultigraphData(d){ //d = lista de números se não aprovada por validate(d) mas for aprovada por evenSum(d). Essa função retorna as arestas de um multigrafo
    // Variáveis
    let n = d.length;
    d.sort((a,b) => b-a);
    let sum = 0; //Soma dos graus no momento
    let v = Array(n).fill(0); // Conjunto de graus válidos
    for(let i = 0; i < n; i++){
        v[i] = i;
        sum += d[i];
    }
    
    //Métodos auxiliares
    function chooseRandom(){
        return (Math.floor(Math.random() * 997))%(v.length);
    }
    
    function chooseRandomPos(){
        return ((Math.floor(Math.random() * 997))%(v.length-1) + 1);
    }
    
    //Execução do Algoritmo
    let res = [];
    res.push(d.slice());
    let edge = [];
    
    let ind = d.length-1;
    while(ind > 0){
        while(d[ind] <= 1){
            ind--;
            if(ind === 0) break;
        }
        while(d[ind] > 1 && ind > 0){
            d[ind]--; d[ind-1]--;
            sum -= 2;
            res.push([ind,ind-1]);
        }
    }
    
    while(d[0] > 1 && sum > d[0] && d.length > 1){
        let k = chooseRandomPos();
        if(d[v[k]] === 0){
            v.splice(k,1);
        } else {
            res.push([0,v[k]]);
            sum -= 2;
            d[0]--; d[v[k]]--;
        }
    }
    
    while(sum > 0){
        let k = chooseRandom();
        if(d[v[k]] === 0){
            v.splice(k,1);
        } else {
            edge.push(v[k]);
        }
        if(edge.length === 2){
            if(edge[0] === edge[1]){
                if(d[edge[0]] > 1){
                    sum -= 2; d[edge[0]] -= 2;
                    res.push([edge[0],edge[1]]);
                    edge.splice(0,2);
                } else {
                    edge.splice(0,2);
                }
            } else {
                sum -= 2;
                d[edge[0]]--; d[edge[1]]--;
                res.push([edge[0],edge[1]]);
                edge.splice(0,2);
            }
        }
    }
    return res;
}

function getGraphData(d){ //d = lista de números se aprovada por validate(d) e por evenSum(d). Essa função retorna as arestas de um grafo simples
    // Variáveis
    let n = d.length; // Quantidade de inteiros
    d.sort((a,b) => b-a); // Garante ordem decrescente
    let v = Array(n).fill(0); // Subrealização atual
    let r = 0; // Índice crítico como no algoritmo
    let adj = Array(n); // Matriz de adjacência do grafo
    for(let i = 0; i < n; i++) adj[i] = Array(n).fill(false);

    // Métodos auxiliares
	function hasFreeConnection(){
		let listOfFrees = [];
		for(let i = 0; i < n; i++){
            if(i == r) continue;
			if(d[i] > v[i] && adj[i][r] === false) listOfFrees.push(i);
		}
		if(listOfFrees.length > 0){
            const rand = (Math.floor(Math.random() * 997))%(listOfFrees.length);
            return listOfFrees[rand];
        }
		return n+1;
	}

	function findMinimalDisconnected(){
		for(let i = 0; i < n; i++){
            if(i == r) continue;
			if(adj[i][r] === false) return i;
		}
		return n+1;
	}

	function findTrickyVertexAboveR(){
		for(let i = r+1; i < n; i++){
			if(v[i] < Math.min(r+1,d[i])) return i;
		}
		return n+1;
	}

	function getPairBelowR(){
		for(let i = 0; i < r; i++){
			for(let j = i+1; j < r; j++){
				if(adj[i][j] == false) return [i,j];
			}
		}
		return [n+1,n+1];
	}

    function findU(vi){ 
        for(let i = 0; i < n; i++){
            if(i == r || i == vi || adj[i][vi] == 0 || adj[i][r] == 1) continue;
            return i;
        }
    }

    function findK(){
        for(let i = r+1; i < n; i++){
            if(d[i] > v[i]) return i;
        }
    }

    function findIandU(vk){ 
        let vi = n+1;
        for(let i = 0; i < r; i++){
            if(adj[vk][i] == 0){
                vi = i; break;
            }
        }
        for(let i = 0; i < n; i++){
            if(i == r || i == vi || i == vk || adj[i][vi] == 0 || adj[i][r] == 1) continue;
            return [vi, i];
        }
    }

    function findUandW(vi,vj){
        let u = -1, w = -1;
        for(let k = r+1; k < n; k++){
            if(adj[k][r] === true) continue;
            if((u === -1) && (adj[k][vi] === true)){
                u = k;
            }
            if((w === -1) && (adj[k][vj] === true)){
                w = k;
            }
            if((u !== -1) && (w !== -1)) return [u,w];
        }
        return [u,w];
    }

    // Execução do algoritmo
    while(r < n){
        if(d[r] == v[r]){
            console.log("skip")
            r++; continue;
        }
        let state = hasFreeConnection();
        // Caso 0
        if(state < n){
            console.log("c0")
            let vi = state;
            adj[vi][r] = true; adj[r][vi] = true;
            v[vi]++; v[r]++;
        }
        // Caso 1
        else if((state = findMinimalDisconnected()) < r){ 
            console.log("c1")
            let vi = state;
            let u = findU(vi);
            if(d[r] - v[r] == 1){
                let vk = findK();
                adj[r][vk] = false; adj[vk][r] = false;
                v[r]--; v[vk]--;
            }
            adj[u][vi] = false; adj[vi][u] = false;
            adj[u][r] = true; adj[r][u] = true;
            adj[vi][r] = true; adj[r][vi] = true;
            v[r] += 2;
        } 
        // Caso 2
        else if((state = findTrickyVertexAboveR()) < n){
            console.log("c2")
            let vk = state, vi, u;
            [vi,u] = findIandU(vk);
            adj[u][vi] = false; adj[vi][u] = false;
            adj[u][r] = true; adj[r][u] = true;
            adj[vi][vk] = true; adj[vk][vi] = true;
            v[r]++; v[vk]++;
        } 
        // Caso 3
        else if((state = getPairBelowR()).toString() !== [n+1,n+1].toString()){
            console.log("c3")
            let vi = state[0], vj = state[1], u, w;
            [u,w] = findUandW(vi,vj);
            adj[u][vi] = false; adj[vi][u] = false;
            adj[w][vj] = false; adj[vj][w] = false;
            adj[vi][vj] = true; adj[vj][vi] = true;
            adj[u][r] = true; adj[r][u] = true;
            v[r]++; v[w]--;
        } 
        else {
            console.log("skip")
            r++; continue;
        }
    }

    res = [];
    res.push(d);
    for(let i = 1; i < n; i++){
        for(let j = 0; j < i; j++){
            if(adj[i][j] == 1){
                res.push([j,i]);
            }
        }
    }
    return res;
}