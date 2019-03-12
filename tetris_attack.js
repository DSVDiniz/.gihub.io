let cursor = 
{
	x:0,
	y:0
};

let tabuleiro = 
{
	dimensoes:
	{
		x:6,
		y:12
	}
};

let jogo;

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
			printCursor(jogo,cur);
		}
	}
}

function printCursor(jogo,cur)
{
	let listaSelecionado = document.getElementsByClassName("selecionado");
	while(listaSelecionado.length != 0){
		listaSelecionado[0].classList.remove("selecionado");
	}
	getBlock(jogo, cur.x, cur.y).classList.add("selecionado")
	getBlock(jogo, cur.x + 1, cur.y).classList.add("selecionado")
}

function randomTile()
{
	switch(Math.floor(Math.random() * 6)){
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
		default:
			return "blue-block";
	}
}

function getBlock(jogo,x,y)
{
	return jogo.children[x].children[y];
}

function switchBlock(jogo, cur)
{
	let block_a = getBlock(jogo, cur.x, cur.y);
	let block_b = getBlock(jogo, cur.x + 1, cur.y);

	if(block_a.classList.contains("blocc-vazio") &&block_b.classList.contains("blocc-vazio"))
		return false;

	block_a.classList.remove("selecionado");
	block_b.classList.remove("selecionado");
	var classBlocoA = block_a.classList[0];
	var classBlocoB = block_b.classList[0];
	block_b.classList.remove(classBlocoB);
	block_b.classList.add(classBlocoA);
	block_a.classList.remove(classBlocoA);
	block_a.classList.add(classBlocoB);
	block_a.classList.add("selecionado");
	block_b.classList.add("selecionado");
	return true;
}

function iniciar()
{
	jogo = document.getElementById("jogo");

	for(let i=0;i<tabuleiro.dimensoes.x; i++)
	{
		let linha = document.createElement("div");
		linha.classList.add("linha");
		jogo.appendChild(linha);
		for(let j=0;j<tabuleiro.dimensoes.y; j++)
		{
			let bloco = document.createElement("div");
			if(j>5)
				bloco.classList.add(randomTile());
			else
				bloco.classList.add("bloco-vazio");
			jogo.children[i].appendChild(bloco);
		}
	}
	printCursor(jogo,cursor);
}

function checkCombinacoes(jogo){
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
		case 32://space
			if(switchBlock(jogo, cursor))
				checkCombinacoes(jogo);
		break;
	}
}

window.onkeydown = input;
window.onload = iniciar;