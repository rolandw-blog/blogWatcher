FROM node:14 as common

# RUN chown -R node /usr/local/lib/node_modules
# RUN chown -R node /usr/local/bin/npm
# RUN chown -R node /usr/local/bin/npx

# Keep npm up to date
# fixed an invalid package-lock.json warning
RUN npm install -g npm

# Create app directory
RUN mkdir -p /usr/src/app
RUN chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# USER node

# Install dependencies
COPY ./package*.json ./
RUN npm install

# Copy stuff over
COPY  --chown=node:node . ./

# RUN chown -R node:node .
# RUN find . -type f -path ./node_modules -prune -o -exec chown node:node {} \;

# Make dist directory
RUN mkdir -p dist
RUN chmod 777 /usr/src/app/dist
RUN chown -R node:node /usr/src/app/dist

FROM common as development
ENV NODE_ENV development
USER node
CMD [ "npm", "run", "dev" ]

FROM common as production
ENV NODE_ENV production
USER node
CMD [ "npm", "run", "start" ]
