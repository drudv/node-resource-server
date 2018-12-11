# node-resource-server

Resource Server PoC done in Node.js

# Instructions

    yarn install

    export MONGO_URL="mongodb://localhost:27017/database"
    export UUID_GENERATOR_URL="http://localhost:8080/uuid" # optional
    export PORT="8080" # optional
    yarn start

    # get last 5 messages
    curl http://localhost:8080/give-me-five

    # post a new message
    curl -H 'Content-Type: application/json' \
        --request POST \
        --data '{"message": "Hello"}' \
        http://localhost:8080/save-me