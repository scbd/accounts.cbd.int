FROM node:18.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git curl yarn nano

WORKDIR /usr/src/app

COPY package.json .npmrc ./

RUN yarn install --production

COPY . ./

ENV PORT 8000
EXPOSE 8000

ARG COMMIT
ENV COMMIT $COMMIT

ARG TAG
ENV VERSION $TAG

ENV TAG $TAG

CMD [ "node", "server" ]
