FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@10.12.1

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml tsconfig.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY /src/ ./src/

# Build TypeScript
RUN pnpm build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "start"] 