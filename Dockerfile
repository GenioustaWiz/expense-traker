# Use Node.js v14
FROM node:20

# Create app directory
# this is the docker directory folder
WORKDIR /app
# Bundle app source
# this copy all files and folders on the root folder to the docker folder
COPY . .
# ====END OF ROOT SETTINGs ====

# Usernode exists to protect the previous from being accessed by people with root previlages
# USER node
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

#the app.js should be your main index js file
CMD [ "node", "app.js" ]  

# Expose the port
#should match yah projects port
EXPOSE 5000