FROM mhart/alpine-node:10.6

RUN apk update && apk upgrade && \
    apk add --no-cache bash git curl

RUN yarn global add protractor

WORKDIR /usr/src/app

COPY package.json .npmrc ./

RUN yarn

COPY . ./

RUN ln -s /usr/src/app/node_modules/@bower_components /usr/src/app/app/libs

ENV PORT 8000
EXPOSE 8000

ARG VERSION
ENV COMMIT $VERSION

CMD [ "node", "server" ]
