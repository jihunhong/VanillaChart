FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

ENV PORT=8080

EXPOSE 8080

RUN npx tsc

RUN npm run sync-dir

CMD ["npm", "start"]