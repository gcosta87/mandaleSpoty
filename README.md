# poneSpoty
## Descripción
Es un pequeño proyecto que permite sacar provecho de la API [Web Playback de Spotify](https://developer.spotify.com/documentation/web-playback-sdk/), para implementar así un pequeño reproductor minínimo que pueda ser usado en dispositivos donde el reproductor web oficial o la app no funcionen (Raspberry Pi, TV Smarts antiguos, TV Box limitadas,...).
.
Esta aplicacion solo requiere que le des permisos de streaming (ningun otro permiso se te solicitará). Esto permite que figure entre tus dispositivos vinculados, y puedas contrarlo con el celular o PC. Por el momento no es posible controlarlo via web (mandarle play, pausar, detener,...)

Actualmente esta en un estado de desarrollo, requiere madurar bastaste, y se puede probar aquí:

https://gcosta87.github.io/poneSpoty/

## TO-DOs (pendientes)
- [x] ~~Brindar un modo fullscreen (siempre y cuando esté soportado por el browser).~~
- [x] ~~Persistir en cookie la session,para restablecerla agilmente al acceder al sitio.~~
- [ ] El streaming dura 1 hs (dado la forma de autenticacion actual), se debera analizar las alternativas o bien refrescar el access token.
- [ ] Brindar mejor compatibilidad con browsers que no son los principales (Chrome/FF/IE/Safari).
- [ ] Mejorar el manejo de streaming tras terminar el flujo de pedir permisos. Actualmente cuesta debuggear estas situaciones...
- [ ] Permitir dar permisos desde el celular, via QR o similar, para agilizar enormemente la autenticación.
