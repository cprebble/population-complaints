FROM node:9.3
RUN apt-get update && apt-get install netcat-openbsd -y
RUN mkdir /app
WORKDIR /app
COPY yarn.lock package.json .eslintrc wait-for-postgres.sh /app/
COPY src/ /app/src
COPY test/ /app/test
RUN yarn install
EXPOSE 3333
RUN yarn build
