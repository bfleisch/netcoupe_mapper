<?php


header('content-type: application/json');
header('Access-Control-Allow-Origin: *'); 


readfile("traces/" . basename($_REQUEST['filename']));