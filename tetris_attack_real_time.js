const CIMA 						= [0,-1];
const BAIXO						= [0,1];
const ESQUERDA					= [-1,0];
const DIREITA					= [1,0];
const PARADO					= [0,0];

const TAMANHO_MIN_COMBINACAO 	= 3;

const LINHA_INICIAL_BLOCOS		= 5;

const TEMPO_NOVALINHA			= 1000;
const SPEED_INICIAL				= 1;		

const NUM_PECAS 				= 6;

const BLOCO_AZULCLARO			= 0;
const BLOCO_AMARELO 			= 1;
const BLOCO_AZUL 				= 2;
const BLOCO_ROXO 				= 3;
const BLOCO_VERDE 				= 4;
const BLOCO_VERMELHO 			= 5;
const BLOCO_VAZIO 				= 6;

const CLASS_BLOCO_AZULCLARO		= "yellow-block";
const CLASS_BLOCO_AMARELO 		= "red-block";
const CLASS_BLOCO_AZUL 			= "green-block";
const CLASS_BLOCO_ROXO 			= "purple-block";
const CLASS_BLOCO_VERDE 		= "aliceblue-block";
const CLASS_BLOCO_VERMELHO 		= "blue-block";
const CLASS_BLOCO_VAZIO 		= "bloco-vazio";

const CURSOR_CLASS				= "selecionado";

let lastFrameTimeMs = 0;
let maxFPS = 60;
let delta = 0;
let timestep = 1000 / 60;
let fps = 60;
let framesThisSecond = 0;
let lastFpsUpdate = 0;

let renderDiv;
let fpsDiv;
let scoreDiv;
let comboDiv;
let speedDiv;
let tabuleiro = 
{
	fimDeJogo: false,
	inicioDeJogo: true,
	combo: 0,
	pontos: 0,
	speed: SPEED_INICIAL,
	tempoParaLinha: TEMPO_NOVALINHA,
	dimensoes:
	{
		x: 6,
		y: 12
	},
	cursor:
	{
		x: 2,
		y: 5,
		proxDirecao: PARADO,
		trocarBloco: false,
	},
	matriz: []
};

window.onkeydown = input;
window.onload = iniciar;

function input(e)
{
	if(!e)
		e = window.event;
	let code;
	if(e.charCode && e.keyCode === 0)
		code = e.charCode;
	else
		code = e.keyCode;

	tabuleiro.cursor.proxDirecao = PARADO;
	if(tabuleiro.fimDeJogo)
		return;

	switch(code)
	{
		case 40://baixo
			tabuleiro.cursor.proxDirecao = BAIXO;
		break;
		case 39://direita
			tabuleiro.cursor.proxDirecao = DIREITA;
		break;
		case 38://cima
			tabuleiro.cursor.proxDirecao = CIMA;
		break;
		case 37://esquerda
			tabuleiro.cursor.proxDirecao = ESQUERDA;
		break;
		case 32://espaço
			tabuleiro.cursor.trocarBloco = true;
		break;
	}
}

function update(delta) 
{
	if(tabuleiro.cursor.proxDirecao !== PARADO)
	{
		tabuleiro.cursor = movimentar(tabuleiro.cursor, tabuleiro.dimensoes);
		tabuleiro.cursor.proxDirecao = PARADO;
	}
	if(tabuleiro.cursor.trocarBloco)
	{
		tabuleiro.cursor.trocarBloco = false;
		if(switchBloco(tabuleiro))
		{
			tabuleiro.combo = 0;
			
			let mudouAlgo = true;
			while(mudouAlgo)
			{
				mudouAlgo = false;
				let blocosParaRemover = checkCombinacoes(tabuleiro);
				let removeuBlocos = removerBlocos(tabuleiro, blocosParaRemover);
				let gravidadeAfetou = gravidade(tabuleiro);
				mudouAlgo = removeuBlocos || gravidadeAfetou;
				if(removeuBlocos)
					tabuleiro.combo++;
			}
		}
	}

	tabuleiro.tempoParaLinha -= tabuleiro.speed;
	if(tabuleiro.tempoParaLinha <= 0)
	{
		tabuleiro.fimDeJogo = adicionaLinha(tabuleiro);
		tabuleiro.tempoParaLinha = TEMPO_NOVALINHA;
		tabuleiro.speed+=0.2;
	}
}

function draw(renderDiv, tabuleiro, interp) 
{
    fpsDiv.textContent = Math.round(fps) + ' FPS';
    scoreDiv.textContent = "Score: " + tabuleiro.pontos;
    comboDiv.textContent = "Combo: " + tabuleiro.combo;
    speedDiv.textContent = "Speed: " + tabuleiro.speed.toFixed(1);
	for(let i=0; i < tabuleiro.dimensoes.x; i++)
	{
		for(let j=0; j < tabuleiro.dimensoes.y; j++)
		{
			let bloco = getBloco(renderDiv, i, j);
			let blocoMatriz = tabuleiro.matriz[i][j];
			if(blocoMatriz !== getTipoBloco(bloco))
			{
				trocaTipoBloco(bloco, blocoMatriz);
			}
		}
	}

	let ultimasPosCursor = renderDiv.getElementsByClassName(CURSOR_CLASS);
	while(ultimasPosCursor.length > 0)
		ultimasPosCursor[0].classList.remove(CURSOR_CLASS);

	let cursor1 = getBloco(renderDiv, tabuleiro.cursor.x, tabuleiro.cursor.y);
	let cursor2 = getBloco(renderDiv, tabuleiro.cursor.x + 1, tabuleiro.cursor.y);
	cursor1.classList.add(CURSOR_CLASS);
	cursor2.classList.add(CURSOR_CLASS);

	checkFimDeJogo(renderDiv, tabuleiro);
}

function begin() {}//preframe

function end(fps) {}//posframe

function mainLoop(timestamp) {
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        requestAnimationFrame(mainLoop);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    begin(timestamp, delta);

    if (timestamp > lastFpsUpdate + 1000) 
    {
        fps = 0.25 * framesThisSecond + 0.75 * fps;

        lastFpsUpdate = timestamp;
        framesThisSecond = 0;
    }
    framesThisSecond++;

    let numUpdateSteps = 0;
    while (delta >= timestep) 
    {
        update(timestep);
        delta -= timestep;
        //numUpdateSteps++;
        if (++numUpdateSteps >= 240) 
        {
            delta = 0;
            break;
        }
    }

    draw(renderDiv, tabuleiro, delta / timestep);
    end(fps);
    requestAnimationFrame(mainLoop);
}

function iniciar()
{
	tabuleiro.matriz = [];
	for(let i=0; i < tabuleiro.dimensoes.x; i++)
	{
		tabuleiro.matriz.push([]);
		for(let j=0; j < tabuleiro.dimensoes.y; j++)
		{
			if(j < LINHA_INICIAL_BLOCOS)
				tabuleiro.matriz[i].push(randomTile(NUM_PECAS));
			else
				tabuleiro.matriz[i].push(BLOCO_VAZIO);
		}
	}
	let mudouAlgo = true;
	while(mudouAlgo)
	{
		mudouAlgo = false;
		let blocosParaRemover = checkCombinacoes(tabuleiro);
		let removeuBlocos = removerBlocos(tabuleiro, blocosParaRemover);
		let gravidadeAfetou = gravidade(tabuleiro);
		mudouAlgo = removeuBlocos || gravidadeAfetou;
	}
	tabuleiro.inicioDeJogo = false;
	iniciar_renderer(tabuleiro);
	requestAnimationFrame(mainLoop);
}

function iniciar_renderer(tabuleiro)
{
	renderDiv = document.getElementById("jogo");
	fpsDiv = document.getElementById('fpsDisplay');
	scoreDiv = document.getElementById('score');
	comboDiv = document.getElementById('combo');
	speedDiv = document.getElementById('speed');

	for(let i=0; i < tabuleiro.dimensoes.x; i++)
	{
		let linha = document.createElement("div");
		linha.classList.add("linha");
		renderDiv.appendChild(linha);
		for(let j=0; j < tabuleiro.dimensoes.y; j++)
		{
			let bloco = document.createElement("div");
			bloco.classList.add(CLASS_BLOCO_VAZIO);
			renderDiv.children[i].appendChild(bloco);
		}
	}
}

function getBloco(jogo,x,y)
{
	return jogo.children[x].children[y];
}

function getTipoBloco(bloco)
{
	let tipo = CLASS_BLOCO_VAZIO;
	if(bloco.classList.contains(CLASS_BLOCO_AZULCLARO))
		tipo = CLASS_BLOCO_AZULCLARO;
	else if(bloco.classList.contains(CLASS_BLOCO_AZUL))
		tipo = CLASS_BLOCO_AZUL;
	else if(bloco.classList.contains(CLASS_BLOCO_VERMELHO))
		tipo = CLASS_BLOCO_VERMELHO;
	else if(bloco.classList.contains(CLASS_BLOCO_VERDE))
		tipo = CLASS_BLOCO_VERDE;
	else if(bloco.classList.contains(CLASS_BLOCO_AMARELO))
		tipo = CLASS_BLOCO_AMARELO;
	else if(bloco.classList.contains(CLASS_BLOCO_ROXO))
		tipo = CLASS_BLOCO_ROXO;
	else if(bloco.classList.contains(CLASS_BLOCO_VAZIO))
		tipo = CLASS_BLOCO_VAZIO;
	return tipo;
}

function trocaTipoBloco(bloco,novoTipo)
{
	let tipo = getTipoBloco(bloco);
	return bloco.classList.replace(tipo,numToTipoBloco(novoTipo));
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

function randomTile(max)
{
	return Math.floor(Math.random() * max);
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

function movimentar(cursor, lim)
{
	if(!checarLimites(cursor.x + cursor.proxDirecao[0] , cursor.y + cursor.proxDirecao[1], lim))
		return cursor;
	else
	{
		cursor.x += cursor.proxDirecao[0];
		cursor.y += cursor.proxDirecao[1];
	}
	return cursor;
}

function switchBloco(tabuleiro)
{
	let cursor = tabuleiro.cursor;
	let bloco_a = tabuleiro.matriz[cursor.x][cursor.y];
	let bloco_b = tabuleiro.matriz[cursor.x + 1][cursor.y];
	if(bloco_a === BLOCO_VAZIO && bloco_b === BLOCO_VAZIO)
		return false
	else
	{
		tabuleiro.matriz[cursor.x][cursor.y] = bloco_b;
		tabuleiro.matriz[cursor.x + 1][cursor.y] = bloco_a;
		return true;
	}
}

function checkFimDeJogo(renderDiv, tabuleiro)
{
	if(tabuleiro.fimDeJogo)
	{
		document.getElementsByClassName("gameover")[0].classList.remove("hidden");
		document.getElementsByClassName("gameover2")[0].classList.remove("hidden");
		return;
	}
}

function marcarBlocosParaRemover(tabuleiro, blocosIguais, blocosParaRemover)
{
	if(blocosIguais.length >= TAMANHO_MIN_COMBINACAO)
	{
		pontuar(tabuleiro, blocosIguais);
		return blocosParaRemover.concat(blocosIguais);
	}
	return blocosParaRemover.concat([]);
}

function checkCombinacoes(tabuleiro)
{
	let blocosIguais = [];
	let dimensoes = tabuleiro.dimensoes;
	let blocosParaRemover = [];
	//primeiro checamos na horizontal
	for(let j=0; j < dimensoes.y; j++)
	{
		for(let i=0; i < dimensoes.x; i++)
		{	
			let bloco = tabuleiro.matriz[i][j];
			if(bloco === BLOCO_VAZIO)
				continue;
			else
			{
				if(blocosIguais.length == 0)
					blocosIguais.push([i,j]);
				else
				{
					let comparar = tabuleiro.matriz[blocosIguais[0][0]][blocosIguais[0][1]];
					if(comparar === bloco)
						blocosIguais.push([i,j]);
					else
					{
						blocosParaRemover = marcarBlocosParaRemover(tabuleiro,blocosIguais,blocosParaRemover);
						blocosIguais = [];
						blocosIguais.push([i,j]);
					}
				}	
			}
		}
		blocosParaRemover = marcarBlocosParaRemover(tabuleiro,blocosIguais,blocosParaRemover);
		blocosIguais = [];
	}
	//depois na vertical
	for(let i=0; i < dimensoes.x; i++)
	{
		for(let j=0; j < dimensoes.y; j++)
		{	
			let bloco = tabuleiro.matriz[i][j];
			if(bloco === BLOCO_VAZIO)
				continue;
			else
			{
				if(blocosIguais.length == 0)
					blocosIguais.push([i,j]);
				else
				{
					let comparar = tabuleiro.matriz[blocosIguais[0][0]][blocosIguais[0][1]];
					if(comparar === bloco)
						blocosIguais.push([i,j]);
					else
					{
						blocosParaRemover = marcarBlocosParaRemover(tabuleiro,blocosIguais,blocosParaRemover);
						blocosIguais = [];
						blocosIguais.push([i,j]);
					}
				}	
			}
		}
		blocosParaRemover = marcarBlocosParaRemover(tabuleiro,blocosIguais,blocosParaRemover);
		blocosIguais = [];
	}
	return blocosParaRemover;
}

function removerBlocos(tabuleiro, blocosParaRemover)
{
	let removeu = blocosParaRemover.length > 0;

	for(let i=0; i < blocosParaRemover.length; i++)
	{	
		let x = blocosParaRemover[i][0];
		let y = blocosParaRemover[i][1];
		tabuleiro.matriz[x][y] = BLOCO_VAZIO;
	}
	blocosParaRemover = [];	
	return removeu;
}

function pontuar(tabuleiro, listaBlocosIguais)
{
	if(!tabuleiro.inicioDeJogo)
		tabuleiro.pontos += 10 *listaBlocosIguais.length * (tabuleiro.combo+1);
}

function gravidade(tabuleiro)
{
	let gravidadeAfetou = false;
	for (let i=0; i < tabuleiro.dimensoes.x; i++) 
	{
		//preparando uma coluna da matriz sem os espaços vazios
		let coluna = [];
		for (let j=0; j < tabuleiro.dimensoes.y; j++)
		{
			let bloco = tabuleiro.matriz[i][j];
			if(bloco !== BLOCO_VAZIO)
				coluna.push(bloco);
		}
		//sobrepondo a coluna atual com a coluna sem espaços em vazios
		for (let j=0; j < tabuleiro.dimensoes.y; j++)
		{
			let bloco = tabuleiro.matriz[i][j];
			//se estiver na altura da coluna sem espaços...
			if(j >= tabuleiro.dimensoes.y - coluna.length)
			{
				let bloco2 = coluna[j - (tabuleiro.dimensoes.y - coluna.length)];
				//se o bloco atual for diferente do da coluna sem espaços
				if(bloco !== bloco2)
				{
					//trocamos o bloco e falamos que algum bloco foi afetado pela gravidade
					tabuleiro.matriz[i][j] = bloco2;
					if(!gravidadeAfetou)
						gravidadeAfetou = true;
				}
			}
			else if(bloco !== BLOCO_VAZIO) //caso contrário só trocamos se não for vazio
			{
				//e trocamos para vazio, pq a coluna de blocos não vazios é menor do que isso
				//ou seja, só deveria ter bloco vazio aqui
				tabuleiro.matriz[i][j] = BLOCO_VAZIO; 
			} 
				
		}
	}
	return gravidadeAfetou;
}

function adicionaLinha(tabuleiro)
{
	for(let i=0; i < tabuleiro.dimensoes.x; i++)
	{
		let bloco = tabuleiro.matriz[i][0];
		if(bloco !== BLOCO_VAZIO)
			return true;//fim de jogo
	}

	let excluidos = [];
	let novaLinha = [];
	for(let i=0; i < tabuleiro.dimensoes.x; i++)
	{
		let bloco_a = tabuleiro.matriz[i][tabuleiro.dimensoes.y - 2];
		let bloco_b = tabuleiro.matriz[i][tabuleiro.dimensoes.y - 1];
		if(bloco_a === bloco_b)
			excluidos.push(bloco_a);

		if(novaLinha.length > 1)
			excluidos.push(novaLinha[i - 1]);

		novaLinha.push(randomTileEspecifico(excluidos));
		excluidos = [];
	}

	for (let i=0; i < tabuleiro.dimensoes.x; i++) 
	{
		let coluna = [];
		for (let j=0; j < tabuleiro.dimensoes.y; j++)
		{
			coluna.push(tabuleiro.matriz[i][j]);
		}
		coluna.shift();
		coluna.push(novaLinha[i]);
		for (let j=0; j < tabuleiro.dimensoes.y; j++)
		{
			let bloco = tabuleiro.matriz[i][j];
			if(bloco !== coluna[j])
				tabuleiro.matriz[i][j] = coluna[j];
		}
	}
	return false;	
}