FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 5000

COPY . .

CMD ["npx", "ts-node", "src/index.ts"]