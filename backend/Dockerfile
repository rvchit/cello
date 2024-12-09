# Backend Dockerfile
FROM node:22.8.0

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the new backend port
EXPOSE 4001

# Start the backend
CMD ["npm", "run", "start"]
