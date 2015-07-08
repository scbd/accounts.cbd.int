#!/bin/bash -e

docker build -t localhost:5000/accounts-cbd-int git@github.com:scbd/accounts.cbd.int.git
docker push     localhost:5000/accounts-cbd-int
