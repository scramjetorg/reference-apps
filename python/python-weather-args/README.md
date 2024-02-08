# Python Weather Data Scraper

## Description

This project contains a sequence to run on ScramjetTransformHub for fetching weather data for specified cities. The script is written in Python and uses the OpenMeteo API for data retrieval.

## Running on Scramjet Hub

To run the sequence on ScramjetTransformHub, follow these steps:

1. Download the package containing the sequence: `python-weather-args.tar.gz`.

2. Prepare the JSON configuration file in the following format:

```json
{
    "appConfig": {
        "current": [
            "temperature_2m",
            "is_day",
            "rain",
            "snowfall",
            "wind_speed_10m"
        ]
    },
    "args": [{ "cities": ["Warsaw", "Berlin", "Moscow"] }]
}
```

Where:

-   The appConfig key contains optional application configuration. In this case, it defines typical parameters such as the type of data to be fetched. The available options for the current key can be found on the open-meteo.com website.
-   The args key contains a list of arguments passed to the application. In this case, we pass a list of cities for which data should be fetched.

3. Execute the `si seq deploy` command, providing the path to the package and the startup configuration file in JSON format:
   `si seq deploy python-weather-args.tar.gz --startup-config <path-to-json-config>`
   or
   `si seq deploy dist --args [{"cities":["Warsaw","Berlin","Boston"]}]`

4. To read data from the application, use the command `si inst output <instance_id>`.
