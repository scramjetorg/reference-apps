#!/bin/sh -x

if [ "$#" -ne 1 ]
then
  echo "Usage: ./seq <multimanager.k8s.example.com|127.0.0.1>"
  exit 1
fi

echo "Image build from https://github.com/scramjetorg/docker"
mmEndpoint=$1

si -v

si config set log --debug false
si config set log --format json

#get first managerID
manager=$(curl -s http://$mmEndpoint:11000/api/v1/list |jq -r .[0].id)
if [ -z "$manager" ]; then
echo "No manager found";
exit 1
else
echo "manager: $manager"
fi

# get first healthy STH ID
sth=$(curl -s http://$mmEndpoint:11000/api/v1/cpm/$manager/api/v1/list |jq -r '[.[] | select( .healthy == true )][0].id')
if [ -z "$sth" ]; then
echo "No healthy STH found";
exit 1
else
echo "STH: $sth"
fi

#check if seq exists, if true exit script
seq=$(curl -s http://$mmEndpoint:11000/api/v1/cpm/$manager/api/v1/sth/$sth/api/v1/sequences |jq -r .[0].id)
if [ -z "$seq" ] || [[ "$seq" == 'null' ]]; then
echo "No sequence found, continuing.."
else
echo "Found sequence $seq Exit script."
exit 0
fi

#si
si config use apiUrl http://$mmEndpoint:11000/api/v1/cpm/$manager/api/v1/sth/$sth/api/v1 |jq

si config p |jq
si seq pack . -o hello.tar.gz
si seq send hello.tar.gz |jq
