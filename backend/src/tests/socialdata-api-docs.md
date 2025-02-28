# SocialData API Documentation

This document provides a comprehensive overview of the SocialData API endpoints, their parameters, and example responses.

## Authentication

All API requests require authentication using an API key. The API key should be included in the `Authorization` header as a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

## Base URL

The base URL for all API requests is:

```
https://api.socialdata.tools
```

## Endpoints

### 1. Twitter Search

Returns an array of tweets provided by Twitter search page. Typically Twitter returns ~20 results per page.

**Endpoint:** `GET /twitter/search`

**Parameters:**

| Parameter | Type   | Required | Description                                                                                |
|-----------|--------|----------|--------------------------------------------------------------------------------------------|
| query     | string | Yes      | A UTF-8, URL-encoded search query, including any operators supported by Twitter website search |
| cursor    | string | No       | Cursor value obtained from next_cursor response property. Used to retrieve additional pages for the same query |
| type      | enum   | No       | Search type (Latest for recent tweets or Top for popular tweets). Default - Latest         |

**Example Request:**

```bash
curl "https://api.socialdata.tools/twitter/search?query=from%3Aelonmusk&type=Latest" \
    -H 'Authorization: Bearer API_KEY' \
    -H 'Accept: application/json'
```

**Example Response:**

```json
{
    "next_cursor": "DAACCgACGC12FhmAJxAKAAMYLXYWGX_Y8AgABAAAAAILAAUAAADoRW1QQzZ3QUFBZlEvZ0dKTjB2R3AvQUFBQUJNWUxTNkQyQmFoUXhndFRReS9Ga0NOR0MwZG9yS1hzU2NZTFFwYm0xY1I0aGd0YmhZc1drQ3FHQzBjUXNSV1lSZ1lMVml5V3BxQU9CZ3RMbUhUV2tDb0dDMVFuVW1YMEFzWUxKYURhOVpob3hndFZtaklGakNNR0MxWGdlT1dZSE1ZTFRYNFNwZUEraGd0Y2h2bEYxRkxHQzFNMi83V1VGc1lMTTZwemhZQWt4Z3RWMkJKbDNGN0dDMWFGTXBYUUY4WUxUUERuRlp3UVE9PQgABgAAAAAIAAcAAAAADAAICgABGCyWg2vWYaMAAAA",
    "tweets": [
        {
            "tweet_created_at": "2023-12-13T05:39:09.000000Z",
            "id_str": "1734810168053956719",
            "text": null,
            "full_text": "@TeslaHype Pace of Progress",
            "source": "<a href=\"http:\\/\\/twitter.com\\/download\\/iphone\" rel=\"nofollow\">Twitter for iPhone<\\/a>",
            "truncated": false,
            "in_reply_to_status_id_str": "1734777084268920960",
            "in_reply_to_user_id_str": "1311506622821400581",
            "in_reply_to_screen_name": "TeslaHype",
            "user": {
                "id_str": "44196397",
                "name": "Elon Musk",
                "screen_name": "elonmusk",
                "location": "\\ud835\\udd4f\\u00d0",
                "url": null,
                "description": "",
                "protected": false,
                "verified": false,
                "followers_count": 166213349,
                "friends_count": 506,
                "listed_count": 149586,
                "favourites_count": 37958,
                "statuses_count": 34934,
                "created_at": "2009-06-02T20:12:29.000000Z",
                "profile_banner_url": "https:\\/\\/pbs.twimg.com\\/profile_banners\\/44196397\\/1690621312",
                "profile_image_url_https": "https:\\/\\/pbs.twimg.com\\/profile_images\\/1683325380441128960\\/yRsRRjGO_normal.jpg",
                "can_dm": false
            },
            "quoted_status_id_str": null,
            "is_quote_status": false,
            "quoted_status": null,
            "retweeted_status": null,
            "quote_count": 11,
            "reply_count": 156,
            "retweet_count": 78,
            "favorite_count": 977,
            "lang": "en",
            "entities": {
                "user_mentions": [
                    {
                        "id_str": "1311506622821400581",
                        "name": "Tesla Hype",
                        "screen_name": "TeslaHype",
                        "indices": [
                            0,
                            10
                        ]
                    }
                ],
                "urls": [],
                "hashtags": [],
                "symbols": []
            },
            "views_count": 32377,
            "bookmark_count": 19
        }
    ]
}
```

**Response Codes:**

- 200 OK - request succeeded
- 402 Payment Required - not enough credits to perform this request
- 422 Unprocessable Content - validation failed (e.g. one of the required parameters was not provided)
- 500 Internal Error - API internal error, typically means that SocialData API failed to obtain the requested information and you should try again later

**Search Operators:**

The endpoint supports all search operators supported by Twitter. Search operators must be included as part of the query parameter and not as separate endpoint parameters.

Some frequently used search operators:

- `@USERNAME -from:USERNAME` — will return all mentions of @username
- `from:USERNAME` — will return all tweets and replies made by user
- `from:USERNAME filter:replies` — will return only replies, but not tweets
- `from:USERNAME -filter:replies` — will return only tweets, but not replies
- `since_time:TIMESTAMP` and `until_time:TIMESTAMP` — will return tweets and comments posted after or before the provided UNIX timestamp
- `since_id:TWEET_ID` and `max_id:TWEET_ID` — will return tweets with ID higher or lower than the provided TWEET_ID
- `conversation_id:TWEET_ID` — will return all comments posted in response to TWEET_ID

### 2. Twitter User by Username

**Note: This endpoint may not be available in the current API version.**

Returns detailed information about a Twitter user by their username.

**Endpoint:** `GET /twitter/users/by/username/{username}`

**Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| username  | string | Yes      | The Twitter username       |

**Example Request:**

```bash
curl "https://api.socialdata.tools/twitter/users/by/username/elonmusk" \
    -H 'Authorization: Bearer API_KEY' \
    -H 'Accept: application/json'
```

### 3. Twitter User Tweets

**Note: This endpoint may not be available in the current API version.**

Returns tweets posted by a specific Twitter user.

**Endpoint:** `GET /twitter/users/{userId}/tweets`

**Parameters:**

| Parameter    | Type   | Required | Description                                |
|--------------|--------|----------|--------------------------------------------|
| userId       | string | Yes      | The Twitter user ID                        |
| max_results  | number | No       | Number of tweets to return (default: 10)   |

**Example Request:**

```bash
curl "https://api.socialdata.tools/twitter/users/44196397/tweets?max_results=5" \
    -H 'Authorization: Bearer API_KEY' \
    -H 'Accept: application/json'
```

### 4. Twitter User Following

**Note: This endpoint may not be available in the current API version.**

Returns a list of users that a specific Twitter user is following.

**Endpoint:** `GET /twitter/users/{userId}/following`

**Parameters:**

| Parameter    | Type   | Required | Description                                      |
|--------------|--------|----------|--------------------------------------------------|
| userId       | string | Yes      | The Twitter user ID                              |
| max_results  | number | No       | Number of following users to return (default: 10)|

**Example Request:**

```bash
curl "https://api.socialdata.tools/twitter/users/44196397/following?max_results=5" \
    -H 'Authorization: Bearer API_KEY' \
    -H 'Accept: application/json'
```

## Known Limitations

- Twitter removes tweets flagged as spam, or all tweets from all shadow-banned users. Request to retrieve tweets or comments made by a shadow-banned user (i.e. from:USERNAME) will always return 0 tweets, but the user's timeline is still available through User tweets and replies endpoint.

- When retrieving large datasets, Twitter eventually refuses to provide additional cursor values after scraping too many pages with "Latest" search filter. As a workaround, it is possible to cycle through a larger dataset using max_id: and since_id: search operators.

- Some endpoints documented in the API reference may not be available or may have changed. The Twitter Search endpoint is confirmed to be working.

## Useful Resources

- [SocialData Postman collection](https://docs.socialdata.tools/resources/postman-collection)
- [Unofficial TypeScript SDK and type definitions](https://github.com/socialdata-tools/typescript-sdk) 