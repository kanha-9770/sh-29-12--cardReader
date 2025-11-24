# Stage 1: Build Stage (Alpine-based)
FROM node:20-alpine AS builder

# Increase memory limit for Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install OpenSSL and build tools
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js application
RUN npm run build


# Stage 2: Production Stage (Alpine-based)
FROM node:24-alpine

# Install OpenSSL
RUN apk add --no-cache openssl

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Copy build artifacts
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
