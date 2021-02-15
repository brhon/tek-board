FROM node:14.15.0

COPY . /app

WORKDIR /app

RUN cd client && npm install

RUN cd server && npm install

RUN cd client && npm run build

RUN rm -rf /app/client

WORKDIR /app/server

EXPOSE 8080

CMD [ "npm", "run", "start" ]