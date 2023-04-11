# Clickup add issues

This sequence reads info send by [git-read-issues]() then adds all the issues to a clickup list

> ! This sequence should be used only in combination with git-read-issues

## Setup

Change data in `cudata.json` to one that applies to you

```json
{
    "listId":"list-id",//id of the list where issues will be placed
    "token":"token"//api-token
}
```

## Git-read-issues

[click here to see this sequence]()
