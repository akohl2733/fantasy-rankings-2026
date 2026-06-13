FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

COPY . .

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

EXPOSE 3000

USER root
RUN chown -R node:node /app
USER node

CMD ["npm", "run", "dev"]