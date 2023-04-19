# Git read issues

This sequence reads all of the github issues for a given repositories

it prepares the data in a format that will be used in [clickup-add-issues]() and send it to a topic.

> ! All issues that has been read by this sequence will be labeled as read in a github

## Setup

Change data in `ghdata.json` to one that applies to you in a given format

```json
{
    "repos":[
    {
        "owner":"owner",
        "repo":"example"
    },
    {
        "owner":"owner",
        "repo":"example1"
    }
]
}
```

When running app please provide 2 parameters:

- Time interval
- Your Github api key

## Clickup-add-issues

[click here to see this sequence]()

