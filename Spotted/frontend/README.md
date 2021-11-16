# Spotted - Frontend

## Introdução

O frontend da aplicação foi feito com [ReactJS](https://pt-br.reactjs.org/) e os componentes e ícones do [Material UI](https://mui.com/). O backend foi desenvolvido em python e pode ser encontrado em [Spotted-Backend](../backend/REDME.md).

Tanto a aplicação frontend quanto a backend foi desenvolvida em cima de uma imagem [Docker](https://www.docker.com/), com o backend tendo sua imagem gerada de uma imagem ubuntu-18.04 e com a imagem do frontend sendo desenvolvida em cima da imagem do backend.

## Instalação

### Instalação e Execução do docker

Para instalar o docker
```sh
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### Instalação do Backend

Para compilar a imagem do spotted backend siga o passo a passo em [Spotted-Backend](../backend/REDME.md)


### Instalação do Frontend

Abaixo está o arquivo DockerFile usado para a criação da imagem do frontend junto com o backend.

```docker
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
```

No terminal execute o comando:
```sh
sudo docker build -t spotted . #build image
sudo docker run -d -p 5000:5000 -p 8080:8080 --name spotted-server1 spotted # levanta primeiro servidor com a api na porta 5000 e o frontend na 8080 do host
sudo docker run -d -p 5001:5000 -p 8081:8080 --name spotted-server2 spotted # levanta primeiro servidor com a api na porta 5001 e o frontend na 8081 do host
```

Para acessar o container execute no terminal:
```sh
sudo docker exec -it spotted-server1 /bin/bash #entrará no terminal deste container
```

Para identificar o ip remoto de algum container:
```sh
sudo docker inspect spotted-server1 # Trará informações sobre o container spotted-server1 e basta procurar IpAddress no resultado
```

