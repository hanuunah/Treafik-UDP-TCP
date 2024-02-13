FROM node:latest
USER root
RUN mkdir -p /tcp-listener
WORKDIR /tcp-listener
COPY . .
RUN npm install 
RUN npm install forever -g

EXPOSE 8085
CMD npm run start
