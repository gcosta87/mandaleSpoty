/**
Configuración global requerido
*/
var config = {
    version: '0.2 beta',
};
//Propiedades que impactan al levantar el servicio y/o tras autenticarse en Spotify
config.service= {
    schema: 'http',
    host: 'localhost',
    port: 8000
};

//Credenciales y de más parámetros requeridos...
config.spotify={
    client_id:      '356ca34315194abd94c05ae398cc67af',
    permissions:     'streaming user-read-email user-modify-playback-state user-read-private',
    redirect_uri:   config.service.schema+'://'+config.service.host+':'+config.service.port+'/',
};

