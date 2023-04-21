# Git read issues

This sequence reads all of the github issues for a given repositories.

It prepares the data in a format that will be used in [clickup-add-issues]() and send it to a topic.

> ! All issues that has been read by this sequence will be labeled as read in a github

## Setup

Change data in `ghdata.json` to one that applies to you in a given format

```json
{
    "repos": [
        {
            "owner": "owner",
            "repo": "example"
        },
        {
            "owner": "owner",
            "repo": "example1"
        }
    ]
}
```

## Running sequence
>! It is recommended to start Clickup-add-issues before this one

```
//install dependencies
npm install

//build the program and prepare to be sent
npm run build

//deploy a compiled folder with a parameters
//replace 1000 with a interval you want in ms
//replace api key with your github api key
si seq deploy dist --args '[1000,"apikey"]'
```

## Clickup-add-issues

[click here to see this sequence]()
