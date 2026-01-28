FROM node:jod-alpine3.23

WORKDIR /src
COPY . .

RUN npm i
CMD [ "npm", "start" ]