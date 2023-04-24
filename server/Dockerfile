# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Start the app when the container launches
CMD ["npm", "start"]
