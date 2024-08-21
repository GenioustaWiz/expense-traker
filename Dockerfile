# Use Node.js v14
FROM node:22

# Create app directory
# this is the docker directory folder
# you can use any name appart from "app" but for simplicity, I suggest you leave it the way it's
WORKDIR /app

# Usernode exists to protect the previous from being accessed by people with root previlages
# USER node
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# installs th modules based on what the package.json has in dependencies
RUN npm install

# Bundle app source
# this copy all files and folders on the root folder to the docker folder
COPY . .

#the app.js should be your main index js file
# set the path accou according to where your server/app/index js file is located at
CMD [ "node", "app.js" ]  

# Expose the port
#should match yah projects port
EXPOSE 5000