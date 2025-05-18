# Вказуємо базовий образ Node.js
FROM node:20-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install --production

# Копіюємо весь код додатку
COPY . .

# Вказуємо порт, який буде використовуватись
EXPOSE 3002

# Команда для запуску додатку
CMD ["node", "index.js"]
