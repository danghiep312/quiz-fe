FROM node:alpine

RUN npm install -g npm@8.1.4

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ["package.json", "./"]

RUN npm cache clean --force

RUN npm install

COPY . .

EXPOSE 3003

RUN npm run build 

CMD ["npm", "run", "dev"]