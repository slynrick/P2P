FROM ubuntu:18.04

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt install -y \
    git \
    curl
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn 
    #&& \
    #npx browserslist@latest --update-db

WORKDIR /spotted

#COPY src .
#COPY start.sh .

EXPOSE 8080

CMD sleep infinity
#CMD start.sh