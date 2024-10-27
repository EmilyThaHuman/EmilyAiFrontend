# Specify a base image
FROM node:18

# Set the working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Update npm to the latest version
RUN npm install

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install --silent

# Copy the rest of the app
COPY . ./

# Expose port 3000 to the outside once the container is launched
EXPOSE 3000

# Run the application in production mode
ENV NODE_ENV production

# For development, use npm start
CMD ["npm", "start"]
