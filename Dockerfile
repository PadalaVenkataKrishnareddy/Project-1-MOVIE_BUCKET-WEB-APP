# base image
FROM node:14-alpine 

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY client/package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent

# start app
COPY client/public /app/public
COPY client/src /app/src
CMD ["npm", "start"]
