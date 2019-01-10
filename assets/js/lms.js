//variáveis blobais
var lmsCommit_;
var student_name,student_id,lesson_location,total_time,session_time,session_time,session_status;
// usarei este (suspend_data) como padrão para armazenamento de dados da aplicação
var suspend_data;
/* objSuperDefine -- varilavel global para receber/modificar valores no decorrer da aula/jogo
Exemplo da declaração do objeto e manipulação dos atributos:
Declaração:
objSuperDefine = ({ 'cmi.suspend_data' : {'currentScreen' : '0', 'completedScreen' : Array(), 'totalScreen' : '0'} });
Manipulação:
objSuperDefine['cmi.suspend_data']['totalScreen'] = 29;
No exemplo acima, demostro como altar o valor (29) do atributo totalScreen do objeto objSuperDefine
Nota: o objeto bjSuperDefine também desfruta de técnicas de atribuição desistruturada (destructuring-assignment) no atributo marcacoesTabuleiro.
*/
var objSuperDefine = ({  'cmi.suspend_data' : {
                       'currentScreen' : 1,
                        'completedScreen' : Array(),
                         'totalScreen' : 3,
                          'pontuacao1' : 0,
                           'pontuacao2' : 0,
                            'nomeJogador2' : '',
                            'marcacoesTabuleiro' : { posRestore: Array(), formaRestore : Array()}
                          } });

// INICIALIZA LMS
//
// opção de contorno 1 - trasfere o método alert para console.log
window.alert = window.console.log;
var lmsStart = getAPIHandle();
/* opção de contorno 2
if( document.domain != "equipeconteudo.webaula.com.br" || location.protocol != "file:" ){
    var lmsStart = getAPIHandle();
    //var lmsStart = findAPI(window);
    }
*/
//
// FIM INICIALIZA LMS

const searchApiScorm = setInterval( ()=>{
      // localizador ApiScorm
      if( lmsStart ){
          console.log('API Scorm encontrada, prosseguindo...');
          clearInterval(searchApiScorm);
          loadPage();
      }else{
        console.log('Procurando API Scorm...');
      //  lmsStart = findAPI(window);
        lmsStart = getAPIHandle();
        return;
      }

  // se iniciado, define as variáveis e prossegue
    student_name = doLMSGetValue("cmi.core.student_name");
    student_id = doLMSGetValue("cmi.core.student_id");
    lesson_location = doLMSGetValue("cmi.core.lesson_location");
    // usarei este (suspend_data) como padrão para armazenamento de dados da aplicação
    suspend_data = doLMSGetValue("cmi.suspend_data");
    total_time = doLMSGetValue("cmi.core.total_time");
    //var session_time = doLMSGetValue("cmi.core.session_time");
    //var session_time = doLMSGetValue("cmi.core.session_time");
    // var session_status = doLMSGetValue("cmi.core.session_status");
    //console.log("Api LMS iniciou");
    // persolalizados:
    // regata valeres em cmi.suspend_data e recria objSuperDefine
    suspend_data = doLMSGetValue("cmi.suspend_data");
    if(suspend_data.length > 0){
        // reconstroi o objeto
        objSuperDefine = ({ 'cmi.suspend_data' : JSON.parse(suspend_data.replace(/[\\']/g,"\"")) });
        console.log(objSuperDefine);
    }else{
        console.log("Não há dados em cmi.suspend_data em API SCORM");
    }
    lmsIntegratorApp();

},1000);

// ESTA FUNÇÃO (lmsIntegratorApp) É RESPONSÁVEL POR RESTAURAR OS DADOS (OBTIDOS DO LMS) DA PARTIDA
const lmsIntegratorApp = () => {
        // inicia contagem da sessão de usuário
        startTimer();
        // Define nome em LMS para input text da tela inicial
        $("#jogador1").val( student_name );

        //configura variáveis de placar
        placar['jogador1'] = objSuperDefine['cmi.suspend_data']['pontuacao1'];
        placar['jogador2'] = objSuperDefine['cmi.suspend_data']['pontuacao2'];

        // aplica placar no painel
        $("#painelJogador1").find(".pontuacao").text( placar['jogador1'] );
        $("#painelJogador2").find(".pontuacao").text( placar['jogador2'] );

        // informa partida atual
        partidaAtual = objSuperDefine['cmi.suspend_data']['currentScreen'];
        $("#painelTotalPartida span").text(partidaAtual +" / "+ totalPartidas);

        // restaura o nome do jogador2 (computador) para continuar a partida
        nomeJogador2 = objSuperDefine['cmi.suspend_data']['nomeJogador2'];

        // causa o mesmo efeito que clicar no botão começar. se nomeJogador2 estiver definido então pula a tela inicial do jogo.
        if(nomeJogador2.length != 0){
          btn_startGame();
        }


              // restaura valores do tabuleriro (posições e formas)
              // total posições
              totalPositionsTab = objSuperDefine['cmi.suspend_data']['marcacoesTabuleiro']['posRestore'].length;
              for (var i = 0; i < totalPositionsTab; i++){

                //resgata posição
                var elemPosition = objSuperDefine['cmi.suspend_data']['marcacoesTabuleiro']['posRestore'][i];
                //resgata forma da posição
                var forma = objSuperDefine['cmi.suspend_data']['marcacoesTabuleiro']['formaRestore'][i];

                // aplica forma
                $($("#retoreElements").find( "span" )[elemPosition]).text( forma );
                // registra posição do elemento no Array tabuleiro
                tabuleiro[elemPosition] = forma;

                console.log(elemPosition);
                console.log(forma);

              }

}

const lsmCommitData = () =>{

  if(lmsStart){
      //doLMSCommit(); // Commit contém em doQuit
      unloadPage();
  }

}

// total telas, total telas vistas, lesson_status, nota min,nota max, nota total.
// a cda nova definição para o objeto objSuperDefine esta função deve ser chamada para doLMSSetValue registrar em memória o novo valor.
const lmsSaveData = (objSuper) => {

      // exemplo do formato do objSuper recebido pela função:
      // resultado = ({ 'cmi.suspend_data' : {currentScreen : 5, completedScreen : Array(1,1), totalScreen : 20} });
      // doLMSSetValue("cmi.suspend_data", "{currentScreen : 5, completedScreen : Array(1,1), totalScreen : 20} }")
      // fim exemplo

      // for abaixo trata o obj com indice e valor = equivale ao foreach do php
      for(var indice in objSuper) {
        // converte valor do indice em string (principalmente quando valor for obj)
        //console.log('Indice/attributo: ' + indice + ' Valor: '+ JSON.stringify(objSuper[indice]));
        // indice é o nome no campo = exemplo : "cmi.core.lesson.location"
        // objSuper é o objeto propriamente dito
        resultado_string = JSON.stringify(objSuper[indice]).replace(/[\\"]/g,"\'").toString();
        if(lmsStart){ doLMSSetValue(indice, resultado_string); }
      }
      // após o laço, commita os dados e passa o rultado para variável lmsCommit_ (resultado é 'true' 'false' em String )
/*
  Commit transferido para o encerramento da página através do método onbeforeunload.

      (doLMSCommit()) ? lmsCommit_ = true : lmsCommit_ = false;

      if(lmsCommit_){
        console.log("Commit OK");
      }else{
        console.log("Commit ERRO");
      }
*/

}


/*
doLMSInitialize()
doLMSFinish()
doLMSGetValue(name)
doLMSSetValue(name, value)
doLMSCommit()
doLMSGetLastError()
startTimer()
computeTime();
doQuit()

#GET:
doLMSGetValue("cmi.core.student_id")
doLMSGetValue("cmi.core.student_name")
doLMSGetValue("cmi.core.lesson_location")
doLMSGetValue("cmi.core.credit")
doLMSGetValue("cmi.core.lesson_status")
doLMSGetValue("cmi.entry")

doLMSGetValue("cmi.core.score.raw")
doLMSGetValue("cmi.core.score.min")
doLMSGetValue("cmi.core.score.max")

doLMSGetValue("cmi.core.total_time")
doLMSGetValue("cmi.core.lesson_mode")
doLMSGetValue("cmi.core.exit")
doLMSGetValue("cmi.suspend_data")

#SET:
doLMSSetValue("cmi.core.student_id")
doLMSSetValue("cmi.core.student_name")
doLMSSetValue("cmi.core.lesson_location")
doLMSSetValue("cmi.core.credit")
doLMSSetValue("cmi.core.lesson_status")
doLMSSetValue("cmi.entry")

doLMSSetValue("cmi.core.score.raw")
doLMSSetValue("cmi.core.score.min")
doLMSSetValue("cmi.core.score.max")

doLMSSetValue("cmi.core.total_time")
doLMSSetValue("cmi.core.lesson_mode")
doLMSSetValue("cmi.core.exit")
doLMSSetValue("cmi.suspend_data")
*/
