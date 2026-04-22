FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (for caching)
COPY package.json package-lock.json turbo.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/services/crm/package.json ./apps/services/crm/
COPY apps/services/vehicle/package.json ./apps/services/vehicle/
COPY apps/services/finance/package.json ./apps/services/finance/
COPY apps/services/deal/package.json ./apps/services/deal/
COPY apps/services/partner/package.json ./apps/services/partner/
COPY apps/services/lead/package.json ./apps/services/lead/
COPY apps/services/analytics/package.json ./apps/services/analytics/
COPY packages/shared-types/package.json ./packages/shared-types/

# Note: In a real monorepo we'd copy workspaces properly, but here we just copy everything to ensure we don't miss monorepo links
COPY . .

# Install all dependencies
RUN npm install

# Build shared packages
RUN npm run build --filter=@merkato/shared-types...

# Expose the API Gateway port
EXPOSE 3000

# Start the application using the auto-seed script
CMD ["npm", "start"]
