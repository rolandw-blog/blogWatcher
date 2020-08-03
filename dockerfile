FROM nginx:latest
EXPOSE 3000
EXPOSE 27017
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

FROM node:latest
# WORKDIR /app
# COPY ./app/package.json /app/package.json
# RUN npm install
# COPY ./app /app
# EXPOSE 3000
# EXPOSE 27017
# CMD ["npm", "start"]
# USER node


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY ./app/package.json /usr/src/app
RUN npm install

RUN npm install -g nodemon
RUN npm install -g mongoose

# Bundle app source
COPY ./app /usr/src/app

# Exports
EXPOSE 3000
CMD [ "npm", "run", "start" ]