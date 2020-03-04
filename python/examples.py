try:
    from urllib.request import urlopen, Request
except ImportError:
    from urllib2 import urlopen, Request

try:
    from urllib.parse import urlencode
except ImportError:
    from urllib import urlencode

try:
    from urllib.error import HTTPError, URLError
except ImportError:
    from urllib2 import HTTPError, URLError



import sys, getopt, json

def apiRequest (path, apikey = None, query = None, data = None, method = 'GET'):
    # api-endpoint
    URL = "https://api.surveylegend.com"

    HEADERS = {
        'Content-Type': 'application/json'
    }
    if apikey is not None : HEADERS['X-Api-Key'] = apikey

    full_url = URL + '/' + path
    if query is not None: full_url += '?' + urlencode(query)

    try:
        req = Request(url=full_url, data=data, headers=HEADERS, method=method)
    except TypeError as e:
        req = Request(url=full_url, data=data, headers=HEADERS)  # Python2 does not allow method

    try:
        res = urlopen(req)
        return json.load(res)
    except HTTPError as e:
        print(e.code)
        print(e.reason)
        raise e
    except URLError as e:
        print(e.code)
        print(e.reason)
        raise e

def main(argv):
    apikey = None
    limit = 0

    try:
        opts, args = getopt.getopt(argv,'ha:l:',['help', 'apikey=','limit='])
    except getopt.GetoptError:
        print('examples.py --apikey=XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX --limit=1')
        sys.exit(2)

    for opt, arg in opts:
      if opt in ('-h', '--help'):
         print('examples.py --apikey=XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX --limit=1')
         sys.exit()
      elif opt in ('-a', '--apikey'):
         apikey = arg
         print('Using API-key: ' + apikey)
      elif opt in ('-l', '--limit'):
          limit = int(arg)
          print('Setting limit to ' + str(limit) + ' surveys')

    survey_list = apiRequest('surveys', apikey) # survey list is protected, need API-key to access
    if limit > 0 : survey_list = survey_list[0:limit]
    print(survey_list)

    for entry in survey_list:

       # TODO: add your custom code here

       print(entry)
       # Example: Get survey for entry
       survey_id = entry['id']
       survey = apiRequest('surveys/' + survey_id) # Surveys are public, no extra headers needed
       # Tip, add query param include_everything=true to get survey items, logic flows, rules, consequences etc in one request
       #survey = apiRequest('surveys/' + survey_id, None, {'include_everything':'true'})
       print(survey)

       # Get questions in survey
       survey_items = apiRequest('surveys/' + survey_id + '/items') # Survey items are also public, no extra headers needed
       print(survey_items)

if __name__ == '__main__':
   main(sys.argv[1:])
