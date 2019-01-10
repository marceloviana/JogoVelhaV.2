continue_ = false;
const applyAnimation = (elemID,time_,animation_) =>{
        var ValuePositonTop = 0;
        var maxPositionTop = 100;
        this.time_ = time_;
        this.elem = elemID;

            switch (animation_) {
              case "transition":{

                screen_h =  Math.floor(window.screen.height / 16);
                $($(this.elem)[0]).css("top",screen_h+"em");
                $($(".container-center-body")[0]).css("bottom","auto");

                const intervalEffect1 = setInterval( ()=>
                {
                    $($(this.elem)[0]).css("top",(screen_h--)+"em");

                        if(screen_h == 0){
                            clearInterval(intervalEffect1);
                            console.log("Animação transition fim");
                              // a linha abaixo deverá retornar em uma função de callback
                              $($(".container-area-form")[0]).css("display","none");
                              $($(".container-CurrentPlay")[0]).css("display","block");
                              initGame();
                            continue_ = true;
                        }

                },this.time_);
                break;
              }

              case "opacity":{
                var opacity_v = 0;
                const intervalEffect2 = setInterval( ()=>
                {
                $($(this.elem)[0]).css("opacity","."+(opacity_v++));
                    if(opacity_v == 9){
                        clearInterval(intervalEffect2);
                        $($(this.elem)[0]).css("opacity","1");
                        console.log("Animação opacity fim");
                        continue_ = true;
                  }
                },this.time_);
                break;
              }

              default: {
                console.log('Nenhum efeito foi informado');
                clearInterval(intervalEffect);
                continue_ = true;
              }

            }



}

/*
const returnAnimation = setInterval( ()=>
{
  if(continue_){
      // repósiciona o conteudo no topo da página
      //$($(".container-center-body")[0]).css("bottom","auto");
      //$($(".container-center-body")[0]).css("top","0");

      // prepara tela para exibição do nome do play atual
      $($(".container-area-form")[0]).css("display","none");
      $($(".container-CurrentPlay")[0]).css("display","block");
      clearInterval(returnAnimation);
      initGame();
  }
},100);
*/
