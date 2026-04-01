# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /usr/src

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
# RUN apt-get update && apt-get install -y protobuf-compiler
RUN pnpm install --frozen-lockfile
# RUN pnpm add -g @nestjs/cli

# Copy the rest of the application code to the working directory
COPY . .

# Generate TypeScript files from .proto files (if using ts-proto)
# RUN pnpm run generate:proto

# Compile TypeScript code
RUN pnpm run build

# Expose the port your app runs on
EXPOSE 7069

# Command to run your application 
CMD ["pnpm", "run", "start"]