FROM node:18-alpine AS builder
WORKDIR /app
COPY . .

RUN npm install -g pnpm@latest
RUN pnpm install && pnpm run build

## temporary fix:
#  for some reason nextjs doesn't automatically move
#  static folder into the standalone/.next/ folder...
#  so we do it manually here
WORKDIR /app/interface/
RUN cp -r ./.next/static ./.next/standalone/.next



FROM node:18-alpine AS runner
COPY --from=builder /app/interface/.next/standalone /app
WORKDIR /app

ENTRYPOINT ["node"]
CMD ["server.js"]