  /*Verifica se o tabuleiro está completamente preenchido, se estiver, significa que ninguém venceu a rodada*/
  tabuleiroIsFilled = function() {
    var preenchidos = 0;
      for(var i = 0; i < tabuleiro.length; i++)
        if(tabuleiro[i]	!= undefined)
          preenchidos++;
      return preenchidos == tabuleiro.length;
  }

  /*Verifica a existência de ocorrências de um mesmo elemento(X ou O) nas linhas do tabuleiro, procurando um vencedor*/
  allElementsInSomeLine = function() {
    for( var i = 0; i < 7; i += 3) {
      if ( tabuleiro[i] == 'X' && tabuleiro[i + 1] == 'X' && tabuleiro[i + 2] == 'X' ) {
          RegistrarPlacar(jogador1['nome']);
      }
      if ( tabuleiro[i] == 'O' && tabuleiro[i + 1] == 'O' && tabuleiro[i + 2] == 'O' ) {
          RegistrarPlacar(jogador2['nome']);
      }
    }
  }

  /*Verifica a existência de ocorrências de um mesmo elemento(X ou O) nas colunas do tabuleiro, procurando um vencedor*/
  allElementsInSomeColumn = function() {
    for( var i = 0; i < 3; i++) {
      if ( tabuleiro[i] == 'X' && tabuleiro[i + 3] == 'X' && tabuleiro[i + 6] == 'X' ) {
        RegistrarPlacar(jogador1['nome']);
      }
      if ( tabuleiro[i] == 'O' && tabuleiro[i + 3] == 'O' && tabuleiro[i + 6] == 'O' ) {
        RegistrarPlacar(jogador2['nome']);
      }
    }

  }

  /*Verifica a existência de ocorrências de um mesmo elemento(X ou O) nas diagonais do tabuleiro, procurando um vencedor*/
  allElementsInSomeDiagonal = function() {
    if ( (tabuleiro[0] == 'X' && tabuleiro[4] == 'X' && tabuleiro[8] == 'X') ||
       (tabuleiro[2] == 'X' && tabuleiro[4] == 'X' && tabuleiro[6] == 'X')) {
          RegistrarPlacar(jogador1['nome']);
    } else if ( (tabuleiro[0] == 'O' && tabuleiro[4] == 'O' && tabuleiro[8] == 'O') ||
            (tabuleiro[2] == 'O' && tabuleiro[4] == 'O' && tabuleiro[6] == 'O') ) {
            RegistrarPlacar(jogador2['nome']);
    }
  }
