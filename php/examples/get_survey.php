<?php

require_once '../api.php';

$survey_id = getComamndLineArgument('survey_id');
$response_id = getComamndLineArgument('response_id');

$survey_list = getSurveyList();
echo json_encode($survey_list, JSON_PRETTY_PRINT);

$survey = getSurvey($survey_id);
echo json_encode($survey, JSON_PRETTY_PRINT);

$survey_items = getSurveyItems($survey_id);
echo json_encode($survey_items, JSON_PRETTY_PRINT);

$responses = getResponsesForSurveyAsFields($survey_id);
echo json_encode($responses, JSON_PRETTY_PRINT);

$response = getResponseAsFields($response_id);
echo json_encode($response, JSON_PRETTY_PRINT);