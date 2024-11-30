# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of your application
COPY . .

# Expose port (update if necessary)
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]
