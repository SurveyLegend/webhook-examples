<?php

require_once '../api.php';

$survey_id = getComamndLineArgument('survey_id');

$survey_list = getSurveyList();
echo json_encode($survey_list, JSON_PRETTY_PRINT);