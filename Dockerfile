FROM node:latest
WORKDIR /devops
COPY package*.json .
COPY . .
RUN npm install
EXPOSE 3000

CMD [ "node","app.js" ]