# Utilise une image Node.js avec une version stable
FROM node:18-alpine

RUN apk add --no-cache bash
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/schemas ./src/schemas/

RUN npx prisma generate

COPY . .

# RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "dev"]

# Dossier genere apres l'execution
# CMD ["node", "dist/app.js"]