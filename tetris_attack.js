let cursor = 
{
	x:2,
	y:5
};

let tabuleiro = 
{
	fimDeJogo:false,
	combo:0,
	pontos:0,
	tempoInsercao: 7000,
	adicionarNovaLinha:false,
	dimensoes:
	{
		x:6,
		y:12
	}
};

let jogo;

function getBloco(jogo,x,y)
{
	return jogo.children[x].children[y];
}

function hasTipo(bloco, tipo)
{
	return bloco.classList.contains(tipo);
}

function trocaTipo(bloco,tipo,novoTipo)
{
	return bloco.classList.replace(tipo,novoTipo);
}

function trocaTipo2(bloco,novoTipo)
{
	return trocaTipo(bloco,getTipoBlocoString(bloco),novoTipo);
}

function trocaBlocos(bloco_a,bloco_b)
{
	var classBlocoA = getTipoBlocoString(bloco_a);
	var classBlocoB = getTipoBlocoString(bloco_b);
	if(classBlocoA === classBlocoB)
		return true;
	let return1 = trocaTipo(bloco_b, classBlocoB, classBlocoA);
	let return2 = trocaTipo(bloco_a, classBlocoA, classBlocoB);
	return return1 && return2;
}

function addTipo(bloco,tipo)
{
	bloco.classList.add(tipo);
	return bloco;
}

function remTipo(bloco,tipo)
{
	bloco.classList.remove(tipo);
	return bloco;
}

function numToTipoBloco(num){
	switch(num)
	{
		case 0:
			return "yellow-block";
		case 1:
			return "red-block";
		case 2:
			return "green-block";
		case 3:
			return "purple-block";
		case 4:
			return "aliceblue-block";
		case 5:
			return "blue-block";
		case 6:
		default:
			return "bloco-vazio";
	}
}

function stringToTipoBlocoNum(s){
	switch(s)
	{
		case "yellow-block":
			return 0;
		case "red-block":
			return 1;
		case "green-block":
			return 2;
		case "purple-block":
			return 3;
		case "aliceblue-block":
			return 4;
		case "blue-block":
			return 5;
		case "bloco-vazio":
		default:
			return 6;
	}
}

function getTipoBloco(bloco)
{
	if(hasTipo(bloco,"yellow-block"))
		return 0;
	else if(hasTipo(bloco,"red-block"))
		return 1;
	else if(hasTipo(bloco,"green-block"))
		return 2;
	else if(hasTipo(bloco,"purple-block"))
		return 3;
	else if(hasTipo(bloco,"aliceblue-block"))
		return 4;
	else if(hasTipo(bloco,"blue-block"))
		return 5;
}

function getTipoBlocoString(bloco)
{
	if(hasTipo(bloco,"yellow-block"))
		return "yellow-block";
	else if(hasTipo(bloco,"red-block"))
		return "red-block";
	else if(hasTipo(bloco,"green-block"))
		return "green-block";
	else if(hasTipo(bloco,"purple-block"))
		return "purple-block";
	else if(hasTipo(bloco,"aliceblue-block"))
		return "aliceblue-block";
	else if(hasTipo(bloco,"blue-block"))
		return "blue-block";
	else if(hasTipo(bloco,"blue-block"))
		return "blue-block";
	else if(hasTipo(bloco,"bloco-vazio"))
		return "bloco-vazio";
}

function trocaTipoBloco(bloco, tipoBloco)
{
	if(hasTipo(bloco,"yellow-block"))
		trocaTipo(bloco, "yellow-block", tipoBloco);
	else if(hasTipo(bloco,"red-block"))
		trocaTipo(bloco, "red-block",tipoBloco);
	else if(hasTipo(bloco,"green-block"))
		trocaTipo(bloco, "green-block",tipoBloco);
	else if(hasTipo(bloco,"purple-block"))
		trocaTipo(bloco, "purple-block",tipoBloco);
	else if(hasTipo(bloco,"aliceblue-block"))
		trocaTipo(bloco, "aliceblue-block",tipoBloco);
	else if(hasTipo(bloco,"blue-block"))
		trocaTipo(bloco, "blue-block",tipoBloco);
}

function checarLimites(x, y, lim)
{
	if(x < 0 
	|| x > lim.x - 2
	|| y < 0
	|| y > lim.y - 1)
		return false;
	else
		return true;
}

function movimentar(jogo,cur, x, y, lim)
{
	if(cur != null)
	{
		if(!checarLimites(cur.x + x , cur.y + y, lim))
			return;
		else
		{
			cur.x += x;
			cur.y += y;
		}
	}
}

function printCursor(jogo,cur)
{
	let listaSelecionado = document.getElementsByClassName("selecionado");
	while(listaSelecionado.length != 0)
	{
		remTipo(listaSelecionado[0],"selecionado");
	}
	addTipo(getBloco(jogo, cur.x, cur.y), "selecionado");
	addTipo(getBloco(jogo, cur.x + 1, cur.y), "selecionado");
}

function randomTile()
{
	return numToTipoBloco(Math.floor(Math.random() * 6));
}

function randomTileEspecifico(excluidos)
{
	let blocos = [0,1,2,3,4,5];
	let achou = true;
	let random;
	for(let i=0; i<excluidos.length; i++)
	{	
		let index = blocos.indexOf(excluidos[i]);
		blocos.splice(index, 1);
	}
	achou = false;
	random = Math.floor(Math.random() * blocos.length);
	return blocos[random];
}


function switchBloco(jogo, x1, y1, x2, y2)
{
	let block_a = getBloco(jogo, x1, y1);
	let block_b = getBloco(jogo, x2, y2);

	if (!hasTipo(block_a,"bloco-vazio") || !hasTipo(block_b,"bloco-vazio"))
	{
		var classBlocoA = getTipoBlocoString(block_a);
		var classBlocoB = getTipoBlocoString(block_b);
		trocaTipo(block_b, classBlocoB, classBlocoA);
		trocaTipo(block_a, classBlocoA, classBlocoB);
		return true;
	}
	else
		return false;
}

function iniciar()
{
	jogo = document.getElementById("jogo");

	for(let i=0; i<tabuleiro.dimensoes.x; i++)
	{
		let linha = document.createElement("div");
		linha.classList.add("linha");
		jogo.appendChild(linha);
		for(let j=0; j<tabuleiro.dimensoes.y; j++)
		{
			let bloco = document.createElement("div");
			if( j > 5 )
				addTipo(bloco, randomTile());
			else
				addTipo(bloco, "bloco-vazio");
			jogo.children[i].appendChild(bloco);
		}
	}
	checkCombinacoes(jogo, tabuleiro);
	removerBlocos(jogo);
	gravidade(jogo, tabuleiro.dimensoes);
	printCursor(jogo, cursor);
}

function marcarBlocosParaRemover(blocosIguais,tabuleiro)
{
	if(blocosIguais.length >= 3)
	{
		pontuar(blocosIguais,tabuleiro);
		for(let k=0; k<blocosIguais.length; k++)
		{
			addTipo(blocosIguais[k], "remover");
		}
	}
}

function compararBlocos(jogo,tabuleiro, x, y, bloco, blocosIguais)
{
	if(blocosIguais.length == 0)
		blocosIguais.push(bloco);
	else
	{
		if(getTipoBloco(blocosIguais[0]) == getTipoBloco(bloco))
			blocosIguais.push(bloco);
		else
		{
			marcarBlocosParaRemover(blocosIguais,tabuleiro);
			blocosIguais = [];
			blocosIguais.push(bloco);
		}
	}	
	return blocosIguais;
}

function checkCombinacoes(jogo,tabuleiro)
{
	let blocosIguais = [];
	let dimensoes = tabuleiro.dimensoes;
	for(let j=0; j<dimensoes.y; j++)
	{
		for(let i=0; i<dimensoes.x; i++)
		{	
			let bloco = getBloco(jogo, i, j);
			if(hasTipo(bloco,"bloco-vazio"))
				continue;
			else
				blocosIguais = compararBlocos(jogo,tabuleiro, i, j, bloco, blocosIguais);
		}
		marcarBlocosParaRemover(blocosIguais,tabuleiro);
		blocosIguais = [];
	}

	for(let i=0; i<dimensoes.x; i++)
	{
		for(let j=0; j<dimensoes.y; j++)
		{	
			let bloco = getBloco(jogo, i, j);
			if(hasTipo(bloco,"bloco-vazio"))
				continue;
			else
				blocosIguais = compararBlocos(jogo,tabuleiro, i, j, bloco, blocosIguais);
		}
		marcarBlocosParaRemover(blocosIguais,tabuleiro);
		blocosIguais = [];
	}
}

function removerBlocos(jogo)
{
	let listaBlocos = document.getElementsByClassName("remover")
	for(let i=0; i<listaBlocos.length; i++)
	{
		trocaTipoBloco(listaBlocos[i],"bloco-vazio");
	}
	while(listaBlocos.length != 0){
		remTipo(listaBlocos[0], "remover");
	}
	if(listaBlocos.length > 0 )
		return true;
	else
		return false;
}

function pontuar(listaBlocosIguais, tabuleiro)
{
	tabuleiro.pontos += 10 *listaBlocosIguais.length;
}

function gravidade(jogo, dimensoes)
{
	let gravidadeAfetou = false;
	for (let i=0; i < dimensoes.x; i++) 
	{
		let coluna = [];
		for (let j=0; j < dimensoes.y; j++)
		{
			let bloco = getBloco(jogo, i, j);
			if(!hasTipo(bloco,"bloco-vazio"))
			{
				coluna.push(getTipoBlocoString(bloco));
			}
		}
		for (let j=0; j < dimensoes.y; j++)
		{
			let bloco = getBloco(jogo, i, j);
			let tipoBloco = getTipoBlocoString(bloco);
			if(j >= dimensoes.y - coluna.length){
				let tipoBloco2 = coluna[j - (dimensoes.y - coluna.length)];
				if(tipoBloco != tipoBloco2)
				{
					trocaTipo2(bloco, tipoBloco2);
					if(!gravidadeAfetou)
						gravidadeAfetou = true;
				}
			}
			else if(!hasTipo(bloco,"bloco-vazio"))
				trocaTipo2(bloco, "bloco-vazio");
		}
	}
	return gravidadeAfetou;
}

function adicionaLinha(jogo, dimensoes)
{
	for(let i=0; i<dimensoes.x; i++)
	{
		let bloco = getBloco(jogo, i, 0);
		if(!hasTipo(bloco, "bloco-vazio"))
			return true;//fim de jogo
	}

	let excluidos = [];
	let novaLinha = [];
	for(let i=0; i<dimensoes.x; i++)
	{
		let bloco_a = getTipoBloco(getBloco(jogo, i, dimensoes.y-2));
		let bloco_b = getTipoBloco(getBloco(jogo, i, dimensoes.y-1));
		if(bloco_a == bloco_b)
		{
			excluidos.push(bloco_a);
		}

		if(novaLinha.length > 1)
			excluidos.push(novaLinha[i-1]);

		novaLinha.push(randomTileEspecifico(excluidos));
		excluidos = [];
	}

	for (let i=0; i < dimensoes.x; i++) 
	{
		let coluna = [];
		for (let j=0; j < dimensoes.y; j++)
		{
			coluna.push(getTipoBloco(getBloco(jogo, i, j)));
		}
		coluna.shift();
		coluna.push(novaLinha[i]);
		for (let j=0; j < dimensoes.y; j++)
		{
			let bloco = getBloco(jogo, i, j);
			if(getTipoBloco(bloco) != stringToTipoBlocoNum(coluna[j]))
			{
				trocaTipo2(bloco,numToTipoBloco(coluna[j]));
			}
		}
	}
	return false;	
}

function input(e)
{
	if(!e)
		e = window.event;
	let code;
	if(e.charCode && e.keyCode ==0)
		code = e.charCode;
	else
		code = e.keyCode;

	jogo = document.getElementById("jogo");	
	if(tabuleiro.fimDeJogo){
		document.getElementsByClassName("gameover")[0].classList.remove("hidden");
		document.getElementsByClassName("gameover2")[0].classList.remove("hidden");
		return;
	}

	switch(code){
		case 40://baixo
			movimentar(jogo, cursor, 0, 1, tabuleiro.dimensoes)
		break;
		case 39://direita
			movimentar(jogo, cursor, 1, 0, tabuleiro.dimensoes)
		break;
		case 38://cima
			movimentar(jogo, cursor, 0, -1, tabuleiro.dimensoes)
		break;
		case 37://esquerda
			movimentar(jogo, cursor, -1, 0, tabuleiro.dimensoes)
		break;
		case 32://espaço
			if(switchBloco(jogo, cursor.x, cursor.y, cursor.x+1, cursor.y)){
				tabuleiro.combo = 0;
				checkCombinacoes(jogo, tabuleiro);
				let mudouAlgo = true;
				while(mudouAlgo)
				{
					mudouAlgo = false;
					let removeuBlocos = removerBlocos(jogo);
					let gravidadeAfetou = gravidade(jogo, tabuleiro.dimensoes);
					mudouAlgo = removeuBlocos || gravidadeAfetou;
					if(removeuBlocos)
						tabuleiro.combo++;
				}
			}
		break;
	}
	if(tabuleiro.adicionarNovaLinha){
		tabuleiro.fimDeJogo = adicionaLinha(jogo,tabuleiro.dimensoes);
		tabuleiro.adicionarNovaLinha = false;
	}
	printCursor(jogo, cursor);
}

var intervaloInserirLinhas = setInterval(ligarAdicionarLinha, tabuleiro.tempoInsercao);
function ligarAdicionarLinha() {
	tabuleiro.adicionarNovaLinha = true;
	if(tabuleiro.tempoInsercao > 500)
		tabuleiro.tempoInsercao -= 500;
	clearInterval(intervaloInserirLinhas);
	intervaloInserirLinhas = setInterval(ligarAdicionarLinha, tabuleiro.tempoInsercao);
}

window.onkeydown = input;
window.onload = iniciar;