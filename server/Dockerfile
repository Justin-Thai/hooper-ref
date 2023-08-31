FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app/server
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:production"]