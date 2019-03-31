FROM node:10-slim

WORKDIR /server

COPY . /server
RUN npm install

EXPOSE ${PORT}
CMD [ "npm", "start" ]
