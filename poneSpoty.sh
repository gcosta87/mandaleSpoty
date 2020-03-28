#!/bin/bash
#   Este pequeño bashscript intenta montar un pequeño servidor web para levantar poneSpoty de manera local.
#   Se iniciliazará escuchando todas las IPs (0.0.0.0) y utilizará el puerto definidio en config.service.port
#
declare -r PUERTO=`grep -E '^\s+port:' config.js | grep -Eo '[0-9]+'`
declare -r IP=`hostname -I | cut -f1 --delimiter=" "`
declare -r URL="http://$IP:$PUERTO";
declare SERVER_WEB_PID=-1;

### FUNCTIONS
# Se captura una interrupcion y se lanza la funcion para finalizar el
trap ctrl_c INT

function ctrl_c() {
    echo "Finalizando servicio web [PID #$SERVER_WEB_PID]";
    kill $SERVER_WEB_PID;
    echo "Presione [Enter] para terminar";
}

## MAIN
echo "Iniciando servicio en $URL";
python -m SimpleHTTPServer "$PUERTO" > /dev/null &
SERVER_WEB_PID=$!

# Se actualiza el config.js (previo a lanzarlo) con el host valido
sed -i -e "s@^\s*host.*@    host: '$IP',@g" config.js

echo
# Se aguarda unos segundos hasta que se levante el servicio, para invocarlo
sleep 2
xdg-open "$URL"
echo;
echo;
read  -p "Servicio iniciado. Utiliza «Ctrl + C», para finalizarlo";
