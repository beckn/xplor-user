FROM node:18-alpine
WORKDIR /job
COPY package*.json ./
COPY tsconfig.json ./
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm" , "run", "start:prod"]