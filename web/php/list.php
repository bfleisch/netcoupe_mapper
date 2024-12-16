<?php


#  liste toutes les traces trouvées dans le dossier traces/ dans un format JSON

$FOLDER = dirname(__FILE__) . '/traces';

$ret = [];

foreach (scandir ($FOLDER) as $filename) {
        if (!preg_match('/traces_([0-9]+)\.json/', $filename, $matches))
            continue;

        array_push ($ret, [
            'filename' =>  $filename,
            'annee' => $matches[1]
        ]);
}

header('content-type: application/json');
header('Access-Control-Allow-Origin: *'); 
echo json_encode($ret);