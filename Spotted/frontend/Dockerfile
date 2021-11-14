FROM spotted-backend

RUN apt update && apt install -y \
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

# CMD sleep infinity
CMD /freechains/start.sh