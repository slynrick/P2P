FROM ubuntu:18.04

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt install -y \
    git \
    wget \
    unzip \
    default-jre \
    libsodium23 \
    python3 \
    python3-pip
RUN pip3 install flask

WORKDIR /freechains
RUN wget https://github.com/Freechains/README/releases/download/v0.8.6/install-v0.8.6.sh && sh install-v0.8.6.sh .
ENV PATH="/freechains:${PATH}"

COPY server.py /freechains/server.py
COPY start.sh /freechains/start.sh

EXPOSE 5000

CMD start.sh