import requests

from django.http import JsonResponse


def get_market_news(request):
    # MarketAux API endpoint
    url = "https://newsapi.org/v2/everything?q=bitcoin&apiKey=68635371b7534380a9c8312926a6cea1"
    # Parameters for the API call
    params = {
        'language': 'en',
        'access_key': '2f9e45f8ce29d58fbcd6528a3745d58d',
    }
    try:
        # Send a GET request to the API
        response = requests.get(url)
        # Check for errors in the response
        response.raise_for_status()
        # Parse the JSON response
        newsData = response.json()
        # Return the data as JSON to the Django view
        return JsonResponse(newsData)

    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({"error": f"HTTP error occurred: {http_err}"}, status=response.status_code)
    except requests.exceptions.ConnectionError:
        return JsonResponse({"error": "Connection error"}, status=500)
    except requests.exceptions.Timeout:
        return JsonResponse({"error": "Request timed out"}, status=504)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"An error occurred: {e}"}, status=500)
    

def get_stock_price(request):

    url = "https://investing11.p.rapidapi.com/get_market_data"

    querystring = {"data_type":"stocks","country":"US"}

    headers = {
        "x-rapidapi-key": "d6ebb271damsh49e7e28d47b4edfp1a676fjsn2712f515cc63",
        "x-rapidapi-host": "investing11.p.rapidapi.com"
    }

    try:

        response = requests.get(url, headers=headers, params=querystring)

        price_data = response.json()

        #print(response.json())

        return JsonResponse(price_data)

    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({"error": f"HTTP error occurred: {http_err}"}, status=response.status_code)
    except requests.exceptions.ConnectionError:
        return JsonResponse({"error": "Connection error"}, status=500)
    except requests.exceptions.Timeout:
        return JsonResponse({"error": "Request timed out"}, status=504)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"An error occurred: {e}"}, status=500)


    
def get_market_indices(request):

    url = "https://real-time-finance-data.p.rapidapi.com/market-trends"

    querystring = {"trend_type":"MARKET_INDEXES","country":"us","language":"en"}

    headers = {
        "x-rapidapi-key": "d6ebb271damsh49e7e28d47b4edfp1a676fjsn2712f515cc63",
        "x-rapidapi-host": "real-time-finance-data.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=querystring)
        index_data = response.json()

        return JsonResponse(index_data)

    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({"error": f"HTTP error occurred: {http_err}"}, status=response.status_code)
    except requests.exceptions.ConnectionError:
        return JsonResponse({"error": "Connection error"}, status=500)
    except requests.exceptions.Timeout:
        return JsonResponse({"error": "Request timed out"}, status=504)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"An error occurred: {e}"}, status=500)
    
def get_market_sectors(request):
    url = ("https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=DtyIBs6VOsSrcNSKQphAy1zklzCVmI9n")


    try:
        response = requests.get(url)
        sector_data = response.json()

        return JsonResponse(sector_data, safe=False)

    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({"error": f"HTTP error occurred: {http_err}"}, status=response.status_code)
    except requests.exceptions.ConnectionError:
        return JsonResponse({"error": "Connection error"}, status=500)
    except requests.exceptions.Timeout:
        return JsonResponse({"error": "Request timed out"}, status=504)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"An error occurred: {e}"}, status=500)


    





