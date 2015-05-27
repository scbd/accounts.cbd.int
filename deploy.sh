#!/bin/bash -e 

docker build -t registry.infra.cbd.int:5000/accounts-cbd-int git@github.com:scbd/accounts.cbd.int.git
docker push     registry.infra.cbd.int:5000/accounts-cbd-int
