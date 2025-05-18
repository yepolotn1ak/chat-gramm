# Вказуємо базовий образ Node.js
FROM node:20-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо ВСІ залежності
RUN npm install

# Копіюємо весь код додатку
COPY . .

# Видаляємо dev-залежності
RUN npm prune --production

# Вказуємо порт, який буде використовуватись
EXPOSE 3002

# Команда для запуску додатку
CMD ["node", "src/index.js"]
