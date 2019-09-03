# webhook-examples 

Examples of servers to listen for and process webhooks from SurveyLegend

Note: It's necessary to have an IP or URL that is accessible from the Internet for SurveyLegend webhook processing service or SurveyLegend app to reach the server.

## Node.js

1. Copy and rename .env.example to .env, modify environment variables. 
2. Run ```npm install``` in terminal

### Node HTTP

1. Run ```npm run http``` in terminal
2. Enter url in SurveyLegend app

### Express.js

1. Run ```npm run express``` in terminal
2. Enter url in SurveyLegend app

### Hapi.js

1. Run ```npm run hapi``` in terminal
2. Enter url in SurveyLegend app

## PHP

### API Usage Examples

These examples are meant to be run from the command-line like so and usually require an API-key.
```php examples/script.php --apikey=XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX```

#### Get survey list for user

Run ```php ./php/examples/get_survey_list.php --apikey=XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX```

#### Get specific survey

Note that no API-key is necessary, surveys are available publicly otherwise they wouldn't load when someone wants to participate. 

Run ```php ./php/examples/get_survey.php --survey_id=#######```

#### Get responses for specific survey

Run ```php ./php/examples/get_responses_for_survey.php --apikey=XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX --survey_id=#######```

#### Get responses for specific survey

Run ```php ./php/examples/get_response.php --apikey=XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX --response_id=#######```

### Webhook Examples

To use a PHP script for receiving a web-server such as Nginx, Apache or similar is necessary. 
The server must also be configured to respond to requests coming from the Internet and to run PHP scripts.

TODO: Create script for handling incoming webhook call.