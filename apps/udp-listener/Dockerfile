FROM node:latest
USER root
RUN mkdir -p /udp-listener
WORKDIR /udp-listener
COPY . .
RUN npm install 
RUN npm install forever -g

EXPOSE 3000
CMD npm run start
