#####################################
#                                   #
#  @author      : 00xWolf           #
#    GitHub    : @mmsaeed509       #
#    Developer : Mahmoud Mohamed   #
#  﫥  Copyright : Mahmoud Mohamed   #
#                                   #
#####################################

# Use an official Alpine Node runtime as a parent image #
FROM node:lts-alpine

# Set the working directory in the container #
WORKDIR /app

# Copy package.json into the container at /app #
COPY package.json .

# Install Dependencies #
RUN npm install

# Copy the code into the container at /app
COPY . .

# Make port 3000 available to the world outside this container #
EXPOSE 3000

# Run app.js when the container launches #
CMD ["node", "app.js"]
