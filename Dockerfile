FROM node:8.10.0-alpine

RUN npm install -g -q protractor

WORKDIR /usr/src/app

COPY package.json bower.json .bowerrc .npmrc ./

RUN npm install -q

COPY . ./

ENV PORT 8000

EXPOSE 8000

ARG VERSION
ENV VERSION $VERSION

CMD [ "node", "server" ]
