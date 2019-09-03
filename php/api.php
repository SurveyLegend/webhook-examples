<?php

require_once 'defines.php';

function execCurlSurveyLegendRestApi($url, $apiKey = '', $user = '', $passwd = '') {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$headers = array(
		'Content-type: application/json',
		'Accept: application/json'
	);
	if (is_string($apiKey) && $apiKey !== '') {
		$headers[] = 'X-Api-Key: ' . $apiKey;
	}
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	// authenticate
	if( is_string($user) && $user !== '' && is_string($passwd) && $passwd !== '') {
		curl_setopt($ch, CURLOPT_USERPWD, $user . ':' . $passwd);
	}

	$response = curl_exec($ch);

	curl_close($ch);

	return json_decode($response, true);
}

function getSurveyList() {
	$url = API_URL . '/surveys';
	return execCurlSurveyLegendRestApi($url, API_KEY );
}

function getSurvey($survey_id) {
	$url = API_URL . '/surveys/' . $survey_id;
	return execCurlSurveyLegendRestApi($url);
}

function getSurveyItems($survey_id) {
	$url = API_URL . '/surveys/' . $survey_id . '/items';
	return execCurlSurveyLegendRestApi($url);
}

function getResponseAsFields($response_id, $include_all = false) {
	$url = API_URL . '/responses/' . $response_id . '?type=fields';
	if ($include_all) {
		$url .= '&includeAllFields=true';
	}
	return execCurlSurveyLegendRestApi($url, API_KEY);
}

function getResponsesForSurveyAsFields($survey_id, $limit = 100) {
	$url = API_URL . '/responses/surveys/' . $survey_id . '?type=fields&includeAllFields=true&limit=' . $limit;
	return execCurlSurveyLegendRestApi($url, API_KEY);
}