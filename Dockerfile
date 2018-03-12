FROM mhart/alpine-node:8
RUN apk update && apk upgrade && \
    apk add --no-cache bash git
WORKDIR /usr/src/app
COPY package.json package-lock.* yarn.* .npmrc ./
RUN yarn install --production
RUN yarn global add protractor --silent

COPY . ./

ENV PORT 8000

EXPOSE 8000

ARG VERSION
ENV COMMIT $VERSION

CMD [ "node", "server" ]
