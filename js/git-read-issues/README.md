# Git read issues

This sequence reads all of the github issues for a given repositories.

It prepares the data in a format that will be used in [clickup-add-issues](https://github.com/scramjetorg/reference-apps/tree/main/js/clickup-add-issues) and send it to a topic.

This sequence validates if the body of issue is empty, if so issue will be skiped.

> ! All issues that has been read by this sequence will be labeled as read in a github

## Prerequisites

- Github api key with a permission to read/write labels and read access to repo

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

Make sure you are in git-read-issues directory, not in a root folder.

```js
//install dependencies
npm install

//build the program and prepare to be sent
npm run build:refapps

//go to a parent direcory
cd ..
//deploy a compiled package with a parameters
//replace api key with your github api key
si seq deploy git-read-issues.tar.gz --args '["apikey"]' // this runs the sequence without any tags specified

si seq deploy git-read-issues.tar.gz --args '["apikey"]' -f path-to-your-config.json // this runs the sequence with the tags specified in the config.json file
//"source" in the sample config.json file defines for which repository specific tags should be set
```

## Clickup-add-issues

[click here to see this sequence](https://github.com/scramjetorg/reference-apps/tree/main/js/clickup-add-issues)
