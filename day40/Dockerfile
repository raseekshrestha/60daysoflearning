FROM node:alpine

WORKDIR /backend

COPY package*.json .

RUN npm install

RUN npm i -g pm2

COPY . .

CMD [ "pm2-runtime","src/index.js" ]