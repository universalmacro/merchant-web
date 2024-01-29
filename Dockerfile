# build stage
FROM node:18.16.1 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/nginx/health /usr/share/nginx/health
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
