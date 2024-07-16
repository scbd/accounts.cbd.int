FROM node:20.13-alpine

ARG BRANCH='master'
ENV BRANCH $BRANCH

ARG VERSION
ENV VERSION $VERSION

RUN echo 'running on branch ' $VERSION

RUN apk update && apk upgrade && \
    apk add --no-cache git curl yarn nano

WORKDIR /usr/src/app

COPY package.json .npmrc ./

COPY . ./

RUN yarn install

RUN yarn run build

ENV PORT 8000
EXPOSE 8000

ARG COMMIT
ENV COMMIT $COMMIT

ARG TAG
ENV VERSION $TAG

ENV TAG $TAG

CMD [ "node", "server" ]
