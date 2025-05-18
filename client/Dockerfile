# Використовуємо Node.js для побудови
FROM node:20-alpine AS build

WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо ВСІ залежності (dev та prod)
RUN npm install

# Копіюємо весь код додатку
COPY . .

# Будуємо проєкт (Vite, React)
RUN npm run build

# Використовуємо nginx для сервера
FROM nginx:alpine

# Копіюємо збілджені файли до nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Вказуємо порт
EXPOSE 3000

# Запускаємо nginx
CMD ["nginx", "-g", "daemon off;"]
