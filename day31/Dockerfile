FROM node:18.18

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm i -g pm2

COPY . . 

CMD ["pm2-runtime","index.js"]
