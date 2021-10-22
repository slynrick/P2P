# P2P: Freechains Docker

O Freechains é u m protocolo peer-to-peer(P2P) pubsub não permissionado de disseminação de conteúdo e todo seu protocolo, bem como sua utilização pode ser encontrado na sua página do [GitHub](https://github.com/Freechains/README)

Docker pode ser descrito através da tradução de um texto encontrado no site oficial:
> Docker é uma plataforma aberta para desenvolvimento, envio e execução de aplicativos. O Docker permite que você separe seus aplicativos de sua infraestrutura para que possa entregar o software rapidamente. Com o Docker, você pode gerenciar sua infraestrutura da mesma forma que gerencia seus aplicativos. Tirando proveito das metodologias do Docker para envio, teste e implantação de código rapidamente, você pode reduzir significativamente o atraso entre escrever o código e executá-lo na produção.
>
> -- <cite>[Docker](https://docs.docker.com/get-started/overview/)</cite>

Pode ser encontrada a lista de comandos para trabalhar no docker [aqui](https://docs.docker.com/engine/reference/run/)

Para facilitar os testes e o desenvolvimento da aplicação, foi criada uma imagem docker do freechains para rodar aplicações e testes e as informações para o build e utilização desta imagem pode ser encontada [aqui](freechains/README.md)

# P2P: Spotted
Como parte prática da matéria, deveríamos desenvolver uma aplicação P2P usando o sistema de reputação do Freechains.

A ideia da aplicação é replicar o funcionamento de páginas spotted que vemos dentro de redes sociais como Facebook de uma forma descentralizada, privada e segura.

Todo o trabalho prático pode ser encontrado nos sequintes links:
 - [Descrição da aplicação](Spotted/README.md)
 - [Funcionamento do backend](Spotted/backend/README.md)
 - [Funcionamento do frontend](Spotted/frontend/README.md)
 - [Simulação do freechains em cima do Spotted](Spotted/simu/README.md)