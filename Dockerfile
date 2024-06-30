# Use a base image with better compatibility
FROM node:20.13.0-slim

ENV PYTHONUNBUFFERED=1
RUN set -ex && \
    apt-get update && \
    apt-get install -y gcc g++ python3 openjdk-17-jdk ruby iptables iputils-ping libsqlite3-dev

# Add frontend files
ADD . /usr/src/app/
WORKDIR /usr/src/app/frontend

# Install frontend dependencies and build the frontend
RUN npm install
RUN npm run build

WORKDIR /usr/src/app

# Remove existing node_modules to avoid architecture mismatch
RUN rm -rf node_modules
# Install server dependencies
RUN npm install

EXPOSE 3000

# Add a dummy user that will run the server, hence sandboxing the rest of the container
RUN addgroup --gid 2000 runner && adduser --uid 2000 --gid 2000 --disabled-password --gecos "" runner
USER runner

CMD ["node", "server.js"]
