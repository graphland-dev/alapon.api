###################
# Client BUILD FOR PRODUCTION
###################
FROM node:22.5.1-alpine3.20 As client-build
USER node
WORKDIR /application/client-src
COPY --chown=node:node ./client/package*.json ./
RUN npm i && npm cache clean --force
COPY --chown=node:node ./client .
# ENV NODE_ENV production
RUN npm run build


###################
# BUILD FOR PRODUCTION
###################

FROM node:22.5.1-alpine3.20 As build
USER node
WORKDIR /application

COPY --chown=node:node package*.json ./

# RUN npm ci --only=production && npm cache clean --force
RUN npm install && npm cache clean --force

COPY --chown=node:node . .

ENV NODE_ENV production
RUN npm run build

###################
# PRODUCTION
###################

FROM node:22.5.1-alpine3.20 As production
WORKDIR /application

COPY --chown=node:node --from=build /application/node_modules ./node_modules
COPY --chown=node:node --from=build /application/dist ./dist
COPY --chown=node:node --from=client-build /application/client-src/dist ./client/dist

CMD [ "node", "dist/main.js" ]
