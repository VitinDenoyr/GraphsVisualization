<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Padrão -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grafos</title>
    <meta name="theme-color" content="#bbbbbb" />
    
    <!-- CSS e Scripts -->
    <link rel="stylesheet" type="text/css" href="/public/css/main.css?v=1.12">
    <script src="/public/script/constructGraph.js?v=1.12"></script>
    <script src="/public/script/generateEdges.js?v=1.12"></script>
    
    <!-- Fontes -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&family=Nova+Square&family=Prompt:wght@200;400&display=swap" rel="stylesheet">
    
    <!-- Ícones -->
    <link rel="icon" href="/public/res/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="/public/res/favicon.ico" type="image/x-icon">
    
    <!-- Vis.js -->
    <link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" type="text/css" />
    <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script
</head>
<body>
    <nav id="header">
        <div id="headerLeft">
            <img id="logo" src="/public/res/logo.png" alt="Logo" onclick="window.location.assign(window.location.origin + `/`)">
        </div>
        <div id="headerMiddle">
            <p id="pageTitle">GRAFOS</p>
        </div>
        <div id="headerRight">
            <input id="logicMenu" type="checkbox" placeholder="." />
            <label id="labelMenu" for="logicMenu">
                <div class="visualMenu" id="line1"></div>
                <div class="visualMenu" id="line2"></div>
                <div class="visualMenu" id="line3"></div>
            </label>
            <ul id="menuList">
                <li class="menuElement">
                    <button class="menuButton" onclick="document.getElementById('content').scrollIntoView(); toggleMenuCheckbox();">Realização de Grafos</button>
                </li>
            </ul>
        </div>
    </nav>
    <div id="content">
        <div class="infoSection" id="graphRelization">
            <p class="soloTitle">Realização de Grafos</p>
            <p class="infoParagraph">Insira uma lista de números inteiros não negativos e será criado um grafo cujo grau dos vértices é correspondente a lista de números inserida caso a lista obedeça as condições necessárias e suficientes para existir um grafo com esses graus. Tais condições são apresentadas pelo Teorema de Erdős–Gallai sobre Sequências de Graus, onde se ambas forem satisfeitas, existe um grafo simples com essa sequência de graus, e se somente a segunda for satisfeita, existe um multigrafo com essa sequência de graus. </p>
            <img class="infoParagraph" src="/public/res/math.png" alt="Condições">
            <p class="infoParagraph">Para gerar um grafo, digite uma sequência de graus inteiros não negativos separados por espaço e depois clique em criar grafo.</p>
            <div id="realizationBar">
                <form class="form" onsubmit="return false;" onkeypress="if(event.key === 'Enter') sendRealizationAttempt(convert(document.getElementById('realizInput').value));">
                    <input id="realizInput" class="modTableInput" placeholder="Digite os graus aqui" />
                    <button class="tableGenButton" id="tryRealization" onclick="sendRealizationAttempt();">Criar grafo</button>
                </form>
            </div>
            <p class="infoWarn invis" id="realizationMsg">Formato de entrada incorreto. certifique-se de colocar apenas dígitos entre 0 e 9 e espaços na entrada, tendo pelo menos um dígito.</p>
            <div id="realizedGraph" class="graphBoardSize invis"></div>
        </div>
    </div>
    <footer id="footer">
        <p class="footerText">Grafos.</p>
        <p class="footerText">Contato: vitordenoyr@gmail.com</p>
    </footer>
    <!-- JAVASCRIPT -->
    <script>
        function toggleMenuCheckbox() {
          let checkbox = document.getElementById('logicMenu');
          checkbox.checked = !checkbox.checked;
        }
        function sendRealizationAttempt() {
            document.getElementById('realizationMsg').classList.add('invis');
            document.getElementById('realizedGraph').classList.add('invis');
            s = convert(document.getElementById('realizInput').value);
            document.getElementById('realizInput').value = s;

            if (s.length === 0) {
                document.getElementById('realizationMsg').textContent = "Formato de entrada incorreto! Certifique-se de colocar apenas dígitos entre 0 e 9 e espaços na entrada, tendo pelo menos um dígito.";
                document.getElementById('realizationMsg').classList.remove('invis');
            } else {
                let d = vectorize(s); // Chame a função vectorize para processar a string
                if (evenSum(d)) {
                    if(validate(d)){
                        document.getElementById('realizationMsg').textContent = "A lista inserida possui as duas condições necessárias, e portanto, pode gerar um grafo simples!";
                        document.getElementById('realizationMsg').classList.remove('invis');
                        let gr = getGraphData(d);
                        printVisGraph(gr);
                        document.getElementById('realizedGraph').classList.remove('invis'); 
                    } else {
                        document.getElementById('realizationMsg').textContent = "A lista inserida não é suficiente para gerar um grafos simples, mas possui as condições necessárias para gerar um multigrafo!";
                        document.getElementById('realizationMsg').classList.remove('invis');
                        let gr = getMultigraphData(d);
                        printVisGraph(gr);
                        document.getElementById('realizedGraph').classList.remove('invis');
                    }
                } else {
                    document.getElementById('realizationMsg').textContent = "Sua lista de vértices não pode gerar um grafo, pois a soma dos números é impar. Isso não cumpre a segunda condição do Teorema de Erdős–Gallai sobre Sequências de Graus.";
                    document.getElementById('realizationMsg').classList.remove('invis');
                }
            }
        }
    </script>
</body>
</html>