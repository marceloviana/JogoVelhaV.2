// $( "#btn-startGame" ).click(function() {
const btn_startGame = ()=>{
  // verificador de campo - se campo do nome de usuário está preenchido
  if($("#jogador1").val().length == 0){
    $(".messageConclusion span").empty();
    $(".messageConclusion span").text("O campo 'Nome do jogador' não pode estar vazio!");
    $('#myModal1').modal('show');
    return;
  }
  applyAnimation(".container-center-body", 5, "transition");
}
// });

// window.onload =	() => { $('#game').css("display", "none"); }

function Jogador(nome, forma) {
  this.nome = nome;
  this.forma = forma;
}

var jogador1, jogador2;
//Jogador da rodada
var jogadorAtual;
var formas = ['X', 'O'];
var index = null;
var placar = { "jogador1" : 0, "jogador2" : 0 };
var totalPartidas = 3;
var partidaAtual = 1;
var nomeJogador2 = '';
var jogadorVencedor = '';

/* exemplo da matriz do jogo
  0 1 2
  3 4 5
  6 7 8
*/

var tabuleiro = new Array(9);
var initGame = () => {
  var nomeJogador1 = $('#jogador1').val();

  // define um nome aleatório para jogador Computador
  var play2Random = LISTA_EXTERNA;
  // se nome do jogador2 contiver no LMS, registra. Caso contrário, define o nome a partir de uma lista de novos definidos em array
  if(nomeJogador2.length == 0){
    nomeJogador2 = play2Random[Math.floor(Math.random() * (play2Random.length -1))];
    objSuperDefine['cmi.suspend_data']['nomeJogador2'] = nomeJogador2;
    lmsSaveData(objSuperDefine);
  }
  // fim define nome aleatório

  jogador1 = new Jogador(nomeJogador1, 0); //X
  jogador2 = new Jogador(nomeJogador2, 1); //O

  jogadorAtual = jogador1;
  setLabelJogadorAtual();

  //APOS DEFINIÇÃO DE JOGADORES, EXIBE A DIV E INICIA JOGO
  $('#game').css("display", "block");

}

/*Reinicia a partida*/
reset = () => {
  //re-registra var tabuleiro
  tabuleiro.length = 0;
  tabuleiro = new Array(9);
  //limpa valores das celulas
  $('#game li').find( "span" ).empty();

  // redefine 'marcacoesTabuleiro' do objeto objSuperDefine para nova partida.
  objSuperDefine['cmi.suspend_data']['marcacoesTabuleiro']['posRestore'].length = 0;
  //resgata forma da posição
  objSuperDefine['cmi.suspend_data']['marcacoesTabuleiro']['formaRestore'].length = 0;
}

/*Seta o nome do jogador da rodada na página HTML*/
setLabelJogadorAtual = () => {
  // Nome jogadores play1 X play2
    $("#painelJogador1").find(".nome").text( jogador1['nome'] );
    $("#painelJogador2").find(".nome").text( jogador2['nome'] );
  // placar
  $("#painelTotalPartida span").text(partidaAtual +" / "+ totalPartidas);
}
var markCel = () =>{
      selectedPosition = freePosition[ Math.floor(Math.random() * freePosition.length) ];
      // envia escolha do computador para configurar no tabuleiro e ajustar valores.
      setOnCeil($('#game li')[selectedPosition], selectedPosition);
}

var pos = 0;
const tabEffects = (pos) => {
  //efeito random de background
  setTimeout( () =>{
    $($('#game li')[pos]).css("background-color","#fff9");
  },0);
  setTimeout( () =>{
      $($('#game li')[pos]).css("background-color","");
  },100);

}

var effectActive = false;
const activeTabEffects = () => {

  if(effectActive === true){return;}

    var posTables = Array(4,0,1,2,5,8,7,6,3,0,4);
    var cont_ = 0;
    let startEffects_ = setInterval( () =>{
    tabEffects(posTables[cont_]);
    if(cont_ >= posTables.length){
      clearInterval(startEffects_);
      cont_ = 0;
      effectActive = false;
    }
    cont_++;
  },130);
}

// inteligencia do Jogador Computador para selecionar uma posição/célula
freePosition = Array();
indexArray = 0;
var VezJogadorComputador = () =>{

    activeTabEffects();
    setTimeout(function(){

        for(var i=0; i < tabuleiro.length; i++){

            if(tabuleiro[i] == undefined){
                  // armazema valores livres do tabuleiro para jogada do computador
                  freePosition[indexArray] = i;
                  indexArray++;
                  // executa a jogada do computador após verificar posição livres.
            }
            if( i == (tabuleiro.length -1) ){
                markCel();
            }
        }
        // limpa valores de indice e array
        indexArray = 0;
        freePosition.length = 0;

    },1200);

}

const RegistrarPlacar = (jogador) =>{

        if(jogador == jogador1['nome']){
          placar['jogador1'] += 1;
        }else{
          placar['jogador2'] += 1;
        }
        console.log("JOGADOR ATUAL: " + jogador + " PLACAR: " + placar['jogador1'] + ":" + placar['jogador2'] );

            // aplica placar no painel
            $("#painelJogador1").find(".pontuacao").text( placar['jogador1'] );
            $("#painelJogador2").find(".pontuacao").text( placar['jogador2'] );
            // informa partida atual
            $("#painelTotalPartida span").text(partidaAtual +" / "+ totalPartidas);

            /* registra valores para LMS em objeto */
            // ({ 'cmi.suspend_data' : {'currentScreen' : 0, 'completedScreen' : Array(), 'totalScreen' : 0, 'pontuacao' : 0} });
            objSuperDefine['cmi.suspend_data']['pontuacao1'] = placar['jogador1'];
            objSuperDefine['cmi.suspend_data']['pontuacao2'] = placar['jogador2'];
            // a idea referida na linha abaixo é incrementar as talas já vistas pelo aluno. O length acompanhado do próprio objeto serve como indice para a construção do array
            // Exemplo:
            // abc = Array();
            // abc[abc.length] = novoValor; Sucessivamente;
            objSuperDefine['cmi.suspend_data']['completedScreen'][objSuperDefine['cmi.suspend_data']['completedScreen'].length] = partidaAtual;
            objSuperDefine['cmi.suspend_data']['currentScreen'] = partidaAtual+1;
            // a função abaixo apenas registra em memória os novos valores do objeto objSuperDefine para doLMSSetValue (função utilizada apenas para o atributo cmi.suspend_data).
            lmsSaveData(objSuperDefine);

        if(partidaAtual == totalPartidas){
              if(placar['jogador1'] >= 2 || placar['jogador2']  >= 2){

                // verifica se lms foi carregado - ajdua a trabalhar no modo off-line
                if(lmsStart){
                  doLMSSetValue("cmi.core.lesson_status", "completed");
                  doLMSSetValue("cmi.core.score.raw", placar['jogador1']);
                }

                  if(placar['jogador1'] >= 2){
                    doLMSSetValue("cmi.core.lesson_status", "passed");
                  }
                  /*
                  Salvar a partida no LMS é acionado somente ao fechamento/descarregamento de página (onBeforeUnload)
                  Esta conclusão foi transfeida para o método de fechamento de página (onBeforeUnload)
                      doLMSCommit();
                      doQuit();
                  */

                  // define nome do jogador ganhador para exibição
                  if( placar['jogador1'] >= 2 ){
                     jogadorVencedor = jogador1['nome'];
                   }else{
                      jogadorVencedor = jogador2['nome'];
                  }

                  // alerta de conclusão
                  $(".btn-modal-continuar").hide();
                  $(".messageConclusion span").text("Parabéns " + jogadorVencedor + " você concluiu!");
                  $('#myModal1').modal('show');
              }
        }
    /* fim registra valores para LMS */
    if(partidaAtual <=  totalPartidas){
      partidaAtual++;
    }
  // efeito no tabuleiro aplicado ao término de cada partida
  applyAnimation(".game", 100, "opacity");
  reset();
}



// a segunte função deve ser a última do script.
/*Preenche a célula da tabela HTML escolhida pelo usuário ao clicar, além de cuidar do jogador atual da rodada e chamar as funções
  de verificação de algum ganhador */

const setOnCeil = (elem, positionElem) => {

    if(tabuleiro[positionElem] == undefined) {
      //cel.innerHTML = formas[jogadorAtual.forma];

      console.log(formas);
      console.log(jogadorAtual);
    //  console.log(forma);


      $(elem).find( "span" ).text( formas[jogadorAtual.forma] );
      tabuleiro[positionElem] = formas[jogadorAtual.forma];

      // Registra os campos marcados do tabuleiro no objeto 'objSuperDefine', nos Arrays da propriedade 'marcacoesTabuleiro', referente a posição de forma (posição 0 a 8 - forma X ou O)
      // A sintaxe ([posRestore[posRestore.length],formRestore[formRestore.length]] quer dizer que o array será incrementado a partir na ultima posição livre.
      posRestoreSize = objSuperDefine['cmi.suspend_data']['marcacoesTabuleiro']['posRestore'].length
      objSuperDefine['cmi.suspend_data']['marcacoesTabuleiro']['posRestore'][posRestoreSize] = positionElem;
      objSuperDefine['cmi.suspend_data']['marcacoesTabuleiro']['formaRestore'][posRestoreSize] = formas[jogadorAtual.forma];
      // registro do objeto
      lmsSaveData(objSuperDefine);

      //define o jogador da rodada
      (jogadorAtual.forma == 0) ? jogadorAtual = jogador2 : jogadorAtual = jogador1;
      setLabelJogadorAtual();

    } else{
      $(".messageConclusion span").text("Ops! Esta marcação já foi registrada!");
      $('#myModal1').modal('show');
    }

    allElementsInSomeLine();
    allElementsInSomeColumn();
    allElementsInSomeDiagonal();

    if ( tabuleiroIsFilled() ) {
      if(partidaAtual == totalPartidas){
          $(".messageConclusion span").html("Nenhum vencedor! :) <br><br> Recarregamento automático em 3seg...");
          $('#myModal1').modal('show');
          $('#myModal1 button').hide();
          setTimeout( ()=>{
            window.location.reload();
          },3000);
      }else{
        $(".messageConclusion span").html("Nenhum vencedor! :)");
        $('#myModal1').modal('show');
        $('#myModal1 button').show();
        reset();
      }
    }

    // verifica se a jogada é vez do Computador
    if(jogadorAtual['nome'] == jogador2['nome']){ VezJogadorComputador(); }

}
