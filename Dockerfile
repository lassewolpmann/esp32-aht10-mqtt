FROM node
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN ["npm", "ci"]
COPY --chown=node:node . .
RUN npx prisma db pull
RUN mkdir -p prisma/migrations/0_init
RUN npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
RUN npx prisma migrate resolve --applied 0_init
RUN npm install @prisma/client
RUN npx prisma generate
CMD ["npx", "ts-node", "index.ts"]
