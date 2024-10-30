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
