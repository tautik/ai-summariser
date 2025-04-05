# SocialData API Endpoints Documentation

This document provides an overview of the available endpoints in the SocialData API that we can integrate with our application.

## Base URL
```
https://api.socialdata.tools/v1
```

## Authentication
All requests require an API key passed in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

## Available Endpoints

### Data API

#### Search Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /twitter/search?query={query}` | Fetch tweets matching specified search criteria |

**Parameters:**
- `query` (required): A UTF-8, URL-encoded search query
- `cursor` (optional): For pagination
- `type` (optional): Search type (Latest or Top)

**Example:**
```
GET https://api.socialdata.tools/twitter/search?query=from%3Aelonmusk&type=Latest
```

#### User Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /twitter/users/by/username/{username}` | Get user profile |
| `POST /twitter/users` | Get multiple user profiles (up to 100) |
| `GET /twitter/users/{user_id}/followers` | Get user followers |
| `GET /twitter/users/{user_id}/verified_followers` | Get verified followers |
| `GET /twitter/users/{user_id}/following` | Get accounts the user follows |
| `GET /twitter/users/{user_id}/tweets` | Get user tweets & replies |
| `GET /twitter/users/{user_id}/mentions` | Get user mentions |
| `GET /twitter/users/{user_id}/highlights` | Get user highlights |
| `GET /twitter/users/{user_id}/affiliates` | Get user affiliates |
| `GET /twitter/users/{user_id}/lists` | Get user lists |
| `GET /twitter/users/{user_id}/likes` | Get user likes |
| `GET /twitter/users/{user_id}/extended_bio` | Get user extended bio |

#### Tweet Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /twitter/tweets/{tweet_id}` | Get tweet details |
| `GET /twitter/tweets/{tweet_id}/comments` | Get tweet comments |
| `GET /twitter/tweets/{tweet_id}/quotes` | Get tweet quotes |
| `GET /twitter/tweets/{tweet_id}/retweeters` | Get tweet retweeters |
| `GET /twitter/tweets/{tweet_id}/thread` | Get thread |
| `GET /twitter/tweets/{tweet_id}/article` | Get article details |

#### List Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /twitter/lists/{list_id}` | Get list details |
| `GET /twitter/lists/{list_id}/members` | Get list members |
| `GET /twitter/lists/{list_id}/tweets` | Get list tweets |

#### Spaces Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /twitter/spaces/{space_id}` | Get space details |

### Social Actions API
| Endpoint | Description |
|----------|-------------|
| `GET /twitter/verify/following?source_user_id={source_id}&target_user_id={target_id}` | Verify if user is following another user |
| `GET /twitter/verify/retweeted?user_id={user_id}&tweet_id={tweet_id}` | Verify if user retweeted a tweet |
| `GET /twitter/verify/commented?user_id={user_id}&tweet_id={tweet_id}` | Verify if user commented on a tweet |

## Search Operators

The search endpoint supports various operators that can be included in the query parameter:

- `@USERNAME -from:USERNAME` — Returns all mentions of @username
- `from:USERNAME` — Returns all tweets and replies made by user
- `from:USERNAME filter:replies` — Returns only replies, not tweets
- `from:USERNAME -filter:replies` — Returns only tweets, not replies
- `since_time:TIMESTAMP` and `until_time:TIMESTAMP` — Returns tweets posted after/before the provided UNIX timestamp
- `since_id:TWEET_ID` and `max_id:TWEET_ID` — Returns tweets with ID higher/lower than the provided TWEET_ID
- `conversation_id:TWEET_ID` — Returns all comments posted in response to TWEET_ID

## Known Limitations

- Twitter removes tweets flagged as spam or from shadow-banned users
- When retrieving large datasets, Twitter may refuse to provide additional cursor values after scraping too many pages with "Latest" search filter 