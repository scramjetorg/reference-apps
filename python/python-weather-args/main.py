import asyncio
import json
import openmeteo_requests
import requests_cache
from retry_requests import retry
from geopy.geocoders import Nominatim

def get_data_from_api(context, args):
    current = context.config['current']
    cities = args['cities']
    json_data = json.dumps(get_meteo_data_for_city(cities, current), indent=4)
    return json_data + "\n"

async def run(context, input, args=None):
    if "current" not in context.config:
        context.config["current"] = ["temperature_2m"]

    if args is None:
        args = {}

    if "cities" not in args or len(args["cities"]) == 0:
        args["cities"] = ["London"]

    while True:
        for result in get_data_from_api(context, args):
            yield result
        await asyncio.sleep(5)

def get_coordinates_for_city(city_name):
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.geocode(city_name)
    if location:
        return location.latitude, location.longitude
    else:
        return None, None
    
def get_meteo_data_for_city(cities, current):
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)
    url = "https://api.open-meteo.com/v1/forecast"
    cities_data = []

    for city in cities:
        latitude, longitude = get_coordinates_for_city(str(city))
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": current,
            "forecast_days": 1
        }
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]

        city_data = {
            "city": city,
            "latitude": response.Latitude(),
            "longitude": response.Longitude(),
            "data": {}
        }

        for i in range(len(current)):
            variable = current[i]
            value = response.Current().Variables(i).Value()
            city_data["data"][variable] = value

        cities_data.append(city_data)

    return cities_data


# {
#     "appConfig": {
#         "current": [
#             "temperature_2m",
#             "is_day",
#             "rain",
#             "snowfall",
#             "wind_speed_10m"
#         ]
#     },
#     "args": [{ "cities": ["Warszawa", "Berlin", "Moskwa"] }]
# }