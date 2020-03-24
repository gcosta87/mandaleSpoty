/**
Configuración global requerido
*/
var config = {
    version: '0.3 beta',
    /*
        indica si se imprimen (o no) los mensajes de verbose en el debugger
     */
    debug_enable_verbose: true,
};
//Propiedades que impactan al levantar el servicio y/o tras autenticarse en Spotify
config.service= {
    schema: 'https',
    host: 'gcosta87.github.com/poneSpoty',
    port: 8000
};

//Credenciales y de más parámetros requeridos...
config.spotify={
    client_id:      '356ca34315194abd94c05ae398cc67af',
    permissions:     'streaming user-read-email user-modify-playback-state user-read-private',
    //permissions:     'streaming',
    redirect_uri:   config.service.schema+'://'+config.service.host+((config.service.port!=80)?':'+config.service.port:'')+'/',
};

