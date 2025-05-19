# Use official Node.js image as the build environment
FROM node:20-alpine AS build

WORKDIR /app

# Встановлюємо залежності з правами адміністратора
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Use nginx to serve the built app
FROM nginx:alpine

# Copy built files to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY ssl/selfsigned.crt /etc/nginx/ssl/selfsigned.crt
COPY ssl/selfsigned.key /etc/nginx/ssl/selfsigned.key

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
