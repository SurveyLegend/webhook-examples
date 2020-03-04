# importing the requests library
from urllib.request import urlopen, Request
from urllib.parse import urlencode
from urllib.error import HTTPError
import json

def apiRequest (path, query = None, data = None, method = 'GET'):
    # api-endpoint
    URL = "https://api.surveylegend.com"

    HEADERS = {
        'Content-Type': 'application/json',
        'X-Api-Key': 'XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX' # TODO: add your SurveyLegend API-key here
    }

    full_url = URL + '/' + path
    if query is not None: full_url += '?' + urlencode(query)

    req = Request(url=full_url, data=data, headers=HEADERS, method=method)
    try:
        res = urlopen(req)
    except HTTPError as e:
        print(e.code)
        print(e.read())

    return json.load(res)

survey_list = apiRequest('surveys') # survey list is protected, need API-key to access
survey_list = survey_list[0:3] # take only first three surveys to reduce requests, comment or remove line to get all your surveys

for entry in survey_list:
    
    # TODO: add your custom code here

    print(entry)
    # Example: Get survey for entry
    survey_id = entry['id']
    survey = apiRequest('surveys/' + survey_id) # Surveys are public, no extra headers needed
    # Tip, add query param include_everything=true to get survey items, logic flows, rules, consequences etc in one request
    #survey = apiRequest('surveys/' + survey_id, {'include_everything':'true'})
    print(survey)
    
    # Get questions in survey
    survey_items = apiRequest('surveys/' + survey_id + "/items") # Survey items are also public, no extra headers needed
    print(survey_items)