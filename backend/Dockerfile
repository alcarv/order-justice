# Dockerfile
FROM node:20.11.1-buster

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
