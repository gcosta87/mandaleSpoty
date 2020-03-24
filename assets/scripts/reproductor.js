/**
 *  Implementacion de funciones y flujos JS, para el control del Reproductor de Spotify y de la GUI
 *
 */
// Representacion del token no valido
const TOKEN_NO_VALIDO = '-1';

// Instancia del reproductor
$poneSpoty = null;

var gui = {
    //Const

    ESTADO_REPRODUCIENDO   : 'R',
    ESTADO_PAUSADO         : 'P',
    ESTADO_DETENIDO        : 'D',

    MODO_REPETECION_DESACTIVADO : 0,
    MODO_REPETECION_TODO        : 1,
    MODO_REPETECION_UNA         : 2,

    DEBUG_TIPO_VERBOSE: 'debug',
    DEBUG_TIPO_ERROR: 'error',

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

    $debug: null,
    //Seters / funciones basicas
    __cambiarColor:function(target,color){
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

        this.$debug = $('textarea#debugLog');

        //inicializacion del form de Auth
        $form = $('form#permisosForm');
        $form.find('input[name="client_id"]').val(config.spotify.client_id);
        $form.find('input[name="scope"]').val(config.spotify.permissions);
        $form.find('input[name="redirect_uri"]').val(config.spotify.redirect_uri);

        //seteo de numero de version
        $version = $('sup.version');
        $version.html(config.version);
    },

    /**
     *
     * @param tipo usa las constantes DEBUG_TIPO_ERROR|DEBUG_TIPO_VERBOSE
     * @param msj string mensaje
     */
    debug:function(tipo,msj){
        //Solo se imprimen los
        if(!(config.debug_enable_verbose == false && tipo == this.DEBUG_TIPO_VERBOSE)){
            var now = new Date();
            var fechaString = now.getHours().toString().padStart(2, '0')+":"+now.getMinutes().toString().padStart(2, '0');
            this.$debug.append("[" + fechaString + " " + (tipo == this.DEBUG_TIPO_ERROR? "***"+tipo.toUpperCase()+"***":tipo) + "]: " + msj + "\n");
        }
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
    var token = TOKEN_NO_VALIDO;
    gui.debug(gui.DEBUG_TIPO_VERBOSE,'Obtencion del Token...');
    //intento leer el token del query params... /#access_token=aabbccc....
    if(window.location.hash){
        gui.debug(gui.DEBUG_TIPO_VERBOSE,'Presencia de token en URL, se procede a extraerlo.');
        var urlSearchParams = new URLSearchParams(window.location.hash.replace('#','?'));
        if(urlSearchParams.has('access_token')){
            token = urlSearchParams.get('access_token');
            gui.debug(gui.DEBUG_TIPO_VERBOSE,'se extrajo el token correctamente!.');
        }
    }
    else{
        gui.debug(gui.DEBUG_TIPO_VERBOSE,'Token no hallado en URL.');
        //TODO intentar recuperar de una cookie o algo similar
    }
    return token;
}
window.onSpotifyWebPlaybackSDKReady = () => {
    gui.inicializar();
    gui.debug(gui.DEBUG_TIPO_VERBOSE,'Inicializacion del SDK correcta!.');

    //debug
    //parcheChrome();

    /*
    Codigo de ejemplo basado en la documentacion ofciona:
    https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
    */
    const token = obtenerToken();
    if(token != TOKEN_NO_VALIDO) {
        $poneSpoty = new Spotify.Player({
            name: 'ponéSpoty!',
            getOAuthToken: cb => {
                cb(token);
            }
        });

        // Error handling
        $poneSpoty.addListener('initialization_error', ({message}) => {
            gui.debug(gui.DEBUG_TIPO_ERROR, 'Ocurrio un error al inicializar:  ' + message);
        });
        $poneSpoty.addListener('authentication_error', ({message}) => {
            gui.debug(gui.DEBUG_TIPO_ERROR, 'Ocurrio un error al autenticar:  ' + message);
        });
        $poneSpoty.addListener('account_error', ({message}) => {
            gui.debug(gui.DEBUG_TIPO_ERROR, 'Ocurrio un error asociado a la cuenta de usuario:  ' + message);
        });
        $poneSpoty.addListener('playback_error', ({message}) => {
            gui.debug(gui.DEBUG_TIPO_ERROR, 'Ocurrio un error al reproducir:  ' + message);
        });

        // Playback status updates
        $poneSpoty.addListener('player_state_changed', state => {
            gui.reproduciendo(state.paused ? gui.ESTADO_PAUSADO : gui.ESTADO_REPRODUCIENDO);
            gui.modoAleatorio(state.shuffle);
            gui.modoRepetecion(state.repeat_mode);
            //console.log(state);
            gui.debug(gui.DEBUG_TIPO_VERBOSE, 'Cambio de estado recibido!.');
        });

        // Ready
        $poneSpoty.addListener('ready', ({device_id}) => {
            gui.conectado(true);
            gui.debug(gui.DEBUG_TIPO_VERBOSE, 'ponéSpoty! se conectó ' + device_id);
        });

        // Not Ready
        $poneSpoty.addListener('not_ready', ({device_id}) => {
            gui.conectado(false);
            gui.debug(gui.DEBUG_TIPO_VERBOSE, 'ponéSpoty! se desconectó ' + device_id);
        });

        // Connect to the player!
        $poneSpoty.connect();
    }
};


/**
 * Al injectarse el Player de Spotify, define un iframe de una forma que no le agrada al Chrome, es por eso que se
 * aplica este parche basado en la respuesta:
 *  https://github.com/spotify/web-playback-sdk/issues/75#issuecomment-487325589
 */
function parcheChrome(){
    if(navigator.appVersion.match(/Chrome|Chromium/)) {
        gui.debug(gui.DEBUG_TIPO_VERBOSE,'Se aplica el parche para Chrome/Chromium.');

        const iframe = document.querySelector('iframe[src="https://sdk.scdn.co/embedded/index.html"]');

        if (iframe) {
            iframe.style.display = 'block';
            iframe.style.position = 'absolute';
            iframe.style.top = '-1000px';
            iframe.style.left = '-1000px';
        }
    }
}
