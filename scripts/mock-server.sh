#!/bin/bash 

source .env 
./node_modules/json-server/bin/index.js \
-H ${MOCK_API_HOST} \
-c ./mock-server/json-server.json \
-s ./mock-server/public ./mock-server/db.json \
--middlewares ./mock-server/uploadImageMiddleware.js