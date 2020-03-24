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
    host: 'gcosta87.github.io/poneSpoty',
    port: 80,

};
config.service.base_url = config.service.schema+'://'+config.service.host+((config.service.port!=80)?':'+config.service.port:'')+'/';


//Credenciales y de más parámetros requeridos...
config.spotify={
    client_id:      '356ca34315194abd94c05ae398cc67af',
    permissions:    'streaming',
    redirect_uri:   config.service.base_url,
};


