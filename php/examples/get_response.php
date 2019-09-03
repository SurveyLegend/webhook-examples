<?php

require_once '../api.php';

$response_id = getComamndLineArgument('response_id');

$response = getResponseAsFields($response_id);
echo json_encode($response, JSON_PRETTY_PRINT);