# Stage 1: Build Stage (Alpine-based)
FROM node:18-alpine AS builder

# Increase memory limit for Node.js to prevent Jest worker crashes
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install OpenSSL and other necessary build tools
RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 2: Production Stage (Alpine-based)
FROM node:18-alpine

# Install OpenSSL in production container
RUN apk add --no-cache openssl

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Set the working directory
WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.env ./.env

# Expose port
EXPOSE 3000

# Use the correct production start command
CMD ["npm", "run", "start"]