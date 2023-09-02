FROM node:18-alpine

RUN apk update 
RUN apk add --update-cache python3 py3-pip
COPY web_scraper/requirements.txt .
RUN pip3 install -r requirements.txt

WORKDIR /app/server
ENV NODE_ENV=production
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:production"]