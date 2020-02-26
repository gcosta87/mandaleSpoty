#!/bin/bash
#   Este pequeño bashscript intenta montar un pequeño servidor web para levantar poneSpoty de manera local.
#   Se iniciliazará en localhost, escuchando todas las IPs (0.0.0.0) y utilizará el puerto definidio en config.service.port
#
declare -r PUERTO=`grep -E '^\s+port:' config.js | grep -Eo '[0-9]+'`
declare -r URL="http://localhost:$PUERTO";

echo "Iniciando servicio en $URL";
python -m SimpleHTTPServer "$PUERTO" &
xdg-open "$URL"

# TODO Analizar el status code anterior para mejorar este mensaje.
echo "Servicio iniciado. Utiliza «Ctrl + C», para finalizarlo"
