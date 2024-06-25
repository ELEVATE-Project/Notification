FROM node:16

#Set working directory
WORKDIR /var/src/

#Copy package.json file
COPY ./src/package.json .

#Install node packages
RUN npm install

#Copy all files 
COPY ./src .

#Expose the application port
EXPOSE 3002

#Start the application
CMD [ "node", "app.js" ]