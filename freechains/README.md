
# Unistall
```sh
sudo apt-get remove docker docker-engine docker.io containerd runc
```

# Install

## Install - repo

```sh
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
	
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
 
```


## Install - docker

```sh
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

# Build e run de imagem

Escrever em um arquivo de nome Dockerfile:

```docker
FROM ubuntu:18.04

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt install -y \
    git \
    wget \
    unzip \
    default-jre \
    libsodium23

WORKDIR /freechains
RUN wget https://github.com/Freechains/README/releases/download/v0.8.6/install-v0.8.6.sh && sh install-v0.8.6.sh .
ENV PATH="/freechains:${PATH}"

CMD freechains-host start /tmp/freechains
```

No terminal execute o comando:
```sh
sudo docker build -t freechains . #build image
sudo docker run -d -p 8401:8330 --name freechains-server1 freechains #levanta primeiro servidor na porta 8401 do host
sudo docker run -d -p 8402:8330 --name freechains-server2 freechains # levanta segundo servidor na porta 8402 do host
```

Para acessar o container execute no terminal:
```sh
sudo docker exec -it freechains-server1 /bin/bash #entrará no terminal deste container e pode executar os comandos do freechains chamando neste terminal
```

