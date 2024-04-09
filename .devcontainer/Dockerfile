# Use the specified base image
FROM mcr.microsoft.com/devcontainers/universal:2

# Install Docker CLI and Docker Compose
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Install NVM, Node.js, and NPM
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 14.17.0

RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Create the docker-env directory and frontend.env file as per your requirement
RUN mkdir -p /workspace/docker-env && \
    touch /workspace/docker-env/frontend.env

# Set the default working directory to /workspace
# This is where your project would be mounted
WORKDIR /workspace

# Note: You do not need to manually run `nvm install`, `npm install`, or create the `docker-env/frontend.env` file in `postCreateCommand` anymore
# as they are handled in this Dockerfile. You might still want to use `postCreateCommand` for other initialization tasks.