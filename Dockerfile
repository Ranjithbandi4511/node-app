FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production \
    PORT=5000 \
    MONGODB_DB=dental-db

EXPOSE 5000

CMD ["npm", "start"]
