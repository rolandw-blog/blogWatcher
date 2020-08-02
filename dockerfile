FROM nginx:latest
EXPOSE 3000
EXPOSE 27017
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

FROM node:latest
WORKDIR /app
COPY ./app/package.json /app
RUN npm install
COPY ./app /app
EXPOSE 3000
EXPOSE 27017
CMD ["npm", "start"]
USER node
