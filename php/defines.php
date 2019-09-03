<?php

require_once 'utils.php';

define('API_KEY', getComamndLineArgument('apikey'));
define('API_URL', 'https://api.surveylegend.com');

if (!is_string(API_KEY) || API_KEY === '') {
 exit('Must provide api key on command line like so, "php ' . $argv[0] . ' --apikey=XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX"');
}