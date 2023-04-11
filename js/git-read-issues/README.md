# Git read issues

This sequence reads all of the github issues for a given repositories

it prepares the data in a format that will be used in [clickup-add-issues]() and send it to a topic.

> ! All issues that has been read by this sequence will be labeled as read in a github

## Setup

Change data in `ghdata.json` to one that applies to you

```json
{
    "owner": "owner", //Repository owner
    "auth": "KEY", //API-KEY
    "repos":["example", "example2"] //aray of repositories to check
}
```

## Clickup-add-issues

[click here to see this sequence]()

