FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN npx prisma migrate deploy
CMD ["npm", "start"]
EXPOSE 3001