FROM spotted-backend

RUN apt update && apt install -y \
    curl
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn 

WORKDIR /spotted

COPY spotted .

EXPOSE 8080

CMD /freechains/start.sh & sleep 30 && yarn install && yarn start