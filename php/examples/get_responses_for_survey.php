<?php

require_once '../api.php';

$survey_id = getComamndLineArgument('survey_id');

$responses = getResponsesForSurveyAsFields($survey_id);
echo json_encode($responses, JSON_PRETTY_PRINT);
