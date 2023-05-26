# Clickup add issues

This sequence reads info send by [git-read-issues](https://github.com/scramjetorg/reference-apps/tree/main/js/git-read-issues) then adds all the issues to a clickup list.

> ! This sequence should be used only in combination with git-read-issues

## Prerequisites

- Clickup api key with a permission to create new tasks
## Setup

Change data in `cudata.json` to one that applies to you

```json
{
    "listId":"list-id",//id of the list where issues will be placed
}
```

When running this sequence it is necessary to use clickup api key as an argument

## Running

Make sure you are in clickup-add-issues directory, not in a root folder.

```js
//install dependencies
npm install

//build the program and prepare to be sent
npm run build:refapps

//go to a parent directory
cd ..

//deploy a compiled package with a parameters
//replace api key with your clickup api key
si seq deploy clickup-add-issues.tar.gz --args '["apikey"]'
```

## Git-read-issues

[click here to see this sequence](https://github.com/scramjetorg/reference-apps/tree/main/js/git-read-issues)
