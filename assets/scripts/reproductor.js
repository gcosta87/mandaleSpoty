/**
 *  Implementacion de funciones y flujos JS, para el control del Reproductor de Spotify y de la GUI
 *
 */
var gui = {
    //Const

    ESTADO_REPRODUCIENDO   : 'R',
    ESTADO_PAUSADO         : 'P',
    ESTADO_DETENIDO        : 'D',

    MODO_REPETECION_DESACTIVADO : 0,
    MODO_REPETECION_TODO        : 1,
    MODO_REPETECION_UNA         : 2,



    ICONO_BOTON_REPRODUCIENDO   : 'fa-play',
    ICONO_BOTON_PAUSADO         : 'fa-pause',
    ICONO_BOTON_DETENIDO        : 'fa-stop',

    ICONO_BOTON_REPETIR        : 'fa-redo-alt',
    ICONO_BOTON_REPETIR_TODO   : 'fa-sync-alt',

    //Props
    botones : {
        conectado: null,
        reproduciendo: null,
        modoRepetecion:null,
        modoAleatorio: null
    },
    //Seters / funciones basicas
    __cambiarColor:function(target,color){
        console.log('color '+color);

        target.css("color",color);
    },
    __cambiarColorActivado:function(target){
        this.__cambiarColor(target,'limegreen');
    },
    __cambiarColorDesactivado:function(target){
        this.__cambiarColor(target,'white');
    },

    __cambiarIcono:function(target,icono){
        target.find('i').attr('class', 'fas '+icono);
    },

    //metodos
    inicializar: function(){
        this.botones.conectado =    $('#conectado');
        this.botones.reproduciendo= $('#reproduciendo');
        this.botones.modoRepetecion=$('#modo_repetecion');
        this.botones.modoAleatorio= $('#modo_aleatorio');

        //inicializacion del form de Auth
        $form = $('form#permisosForm');
        $form.find('input[name="client_id"]').val(config.spotify.client_id);
        $form.find('input[name="scope"]').val(config.spotify.permissions);
        $form.find('input[name="redirect_uri"]').val(config.spotify.redirect_uri);

        //seteo de numero de version
        $version = $('sup.version');
        $version.html(config.version);
    },


    conectado:function(conectado){
        if(conectado){
            this.__cambiarColorActivado(this.botones.conectado);
        }
        else{
            this.__cambiarColorDesactivado(this.botones.conectado);
        }
    },


    reproduciendo:function(estado){
        var boton = this.botones.reproduciendo;
        switch(estado){
            case this.ESTADO_PAUSADO:       this.__cambiarColorDesactivado(boton);
                                            this.__cambiarIcono(boton, this.ICONO_BOTON_PAUSADO);
                                            break;

            case this.ESTADO_REPRODUCIENDO: this.__cambiarColorActivado(boton);
                                            this.__cambiarIcono(boton, this.ICONO_BOTON_REPRODUCIENDO);
                                            break;

            case this.ESTADO_DETENIDO:      this.__cambiarColorDesactivado(boton);
                                            this.__cambiarIcono(boton, this.ICONO_BOTON_DETENIDO);
                                            break;
        }
    },



    modoAleatorio:function(activado){
        if(activado){
            this.__cambiarColorActivado(this.botones.modoAleatorio);
        }
        else{
            this.__cambiarColor(this.botones.modoAleatorio,'');
        }
    },



    modoRepetecion:function(modo){
        var boton = this.botones.modoRepetecion;
        switch(modo){
            case this.MODO_REPETECION_DESACTIVADO:  this.__cambiarColor(boton,'');
                                                    this.__cambiarIcono(boton, this.ICONO_BOTON_REPETIR);
                                                    break;

            case this.MODO_REPETECION_UNA:  this.__cambiarColorActivado(boton);
                                            this.__cambiarIcono(boton, this.ICONO_BOTON_REPETIR);
                                            break;

            case this.MODO_REPETECION_TODO: this.__cambiarColorActivado(boton);
                                            this.__cambiarIcono(boton, this.ICONO_BOTON_REPETIR_TODO);
                                            break;
        }
    },


};

/**
 * Recupera el token recibido por "query param" (url)
 * @returns {string} token valido, o bien un string vacio en caso contrario
 */
function obtenerToken(){
    var token = '-1';
    //intento leer el token del query params... /#access_token=aabbccc....
    if(window.location.hash){
        var urlSearchParams = new URLSearchParams(window.location.hash.replace('#','?'));
        if(urlSearchParams.has('access_token')){
            token = urlSearchParams.get('access_token');
        }
    }
    else{
        //TODO intentar recuperar de una cookie o algo similar
    }
    return token;
}
window.onSpotifyWebPlaybackSDKReady = () => {
    /*
    Codigo de ejemplo basado en la documentacion ofciona:
    https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
    */
    const token = obtenerToken();
    const $poneSpoty = new Spotify.Player({
        name: 'ponéSpoty!',
        getOAuthToken: cb => { cb(token); }
    });

    // Error handling
    $poneSpoty.addListener('initialization_error', ({ message }) => { console.error(message); });
    $poneSpoty.addListener('authentication_error', ({ message }) => { console.error(message); });
    $poneSpoty.addListener('account_error', ({ message }) => { console.error(message); });
    $poneSpoty.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    $poneSpoty.addListener('player_state_changed', state => {
        gui.reproduciendo(state.paused? gui.ESTADO_PAUSADO:gui.ESTADO_REPRODUCIENDO);
        gui.modoAleatorio(state.shuffle);
        gui.modoRepetecion(state.repeat_mode);
        console.log(state);
    });

    // Ready
    $poneSpoty.addListener('ready', ({ device_id }) => {
        gui.conectado(true);
        console.log('poneSpoty se conectó', device_id);
    });

    // Not Ready
    $poneSpoty.addListener('not_ready', ({ device_id }) => {
        gui.conectado(false);
        console.log('poneSpoty se desconectó', device_id);
    });

    gui.inicializar();
    // Connect to the player!
    $poneSpoty.connect();
};
