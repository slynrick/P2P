# Spotted - Simulação

Simule o funcionamento de um fórum público por 3 meses:

- Use o comando `freechains-host now <timestamp>` para simular a passagem de tempo dos nós.
- Use múltiplos nós e usuários. Divida os usuários entre os nós.
- Varie o nível de atividade e perfil entre os usuários (ativo, troll, newbie, etc).
- Varie a qualidade das postagens de modo a despertar o uso likes & dislikes (mensagens neutras, virais, etc).
- Crie um repositório no GitHub com os seguintes arquivos:
    - `[README.md]`: Pequeno documento sobre a simulação (3-5 parágrafos).
    - `[simul.sh]`: Script com todos os comandos para permitir que a simulação seja reproduzível.
- De preferência, faça essa simulação já considerando a aplicação final da disciplina (Pergunta #5).

## Implementação da simulação

Foi desenvolvido um script python que cria containers com a imagem do Spotted-backend já compilada. Para compilar a imagem do spotted backend siga o passo a passo em [Spotted-Backend](../backend/REDME.md)

A ideia da simulação é levantar diversos nós, cada um em um container diferente onde está tanto o servidor freechains quanto o servidor backend do spotted. Como o container exporta para a rede do host nas portas 5XXX, é possível fazer a comunicação entre os nós através do backend usando o endereço `localhost:5XXX`. Já para a comunicação entre peers é usado uma network bridge que já pe criada pelo docker entre os containers criados.
Para saber qual o ip do docker desejado basta executar:
```bash
docker inspect container_id
```
E procurar pela chave `['NetworkSettings']['IPAddress']`, levando em consideração que todo e qualquer container levanta o freechains em sua porta dafault(8330).

O script de simulação utiliza o SDK de docker para python para realizar a instanciação dinâmica de nós conforme solicitado pelo usuário e ao final da execução todos os containers são fechados, mas todos os dados do que acontece no sistema fica em tela com os seguintes tipos de mensagens:
 - `[SETUP]`: Referênte ao setup dos peers
 - `[MESSAGE]`: Referênte ao envio de mensagem
 - `[UNBLOCK]`: Referênte ao desbloqueio do bloco
 - `[LIKE]`: Referênte ao like de bloco
 - `[DISLIKE]`: Referênte ao dislike de bloco
 - `[SYNC]`: Referênte à sincronização de peers
 - `[STEPS]`: Referênte ao lapso de tempo
 
Para movimentar os peers no tempo, utilizamos a seguinte lógica para o cálculo de steps:
```py
total = 24 * 60 * 60 * 1000 * lifetime
lapse = 25 * 60 * 1000 
steps = total//lapse
```

E ao longo de cada iteração realizamos os sequintes processos:
 - Postagens de alguns usuários conforme uma lógica de seleção
 - Desbloqueios realizados por alguns usuários conforme uma lógica de seleção
 - Likes realizados por alguns usuários conforme uma lógica de seleção
 - Dislikes realizados por alguns usuários conforme uma lógica de seleção
 - Movimento temporal adicionando ao step um valor randômico entre 10 e 20 steps
 - Sincronização entre peers

A lógica de seleção de usuários para as tarefas de desbloqueio, like e dislike é feito desta forma:
```py
USERS_TYPE = [(UserType.ACTIVE, 20), (UserType.TROLL, 20), (UserType.CASUALLY, 40), (UserType.CASUALLY, 60), (UserType.CASUALLY, 80)]

def user_selected(user: Dict[str, Any]) -> bool:
    threshold = 100
    selected = random.randrange(200)
    return  threshold + user["type"][1] >= selected or user["pioneer"]
```
Onde o número somado ao threshold é relacionado à assiduidade do usuário, onde quanto menor o número, maior a assiduidade pois serpa maior a chance do randômico chegar dentro do range desejado.

Para a o desbloqueio de mensagens apenas damos likes naquelas que não são desrespeitosas. Quando o usuário adiciona uma mensagem desrespeitosa, essas mensagens são listadas como possíveis mensagens a receber dislike da comunidade. Quando uma mensagem é do tipo viral, a comunidade coloca maior densidade de likes e se for uma mensagem de tipo neutra os likes são esporádicos. Lembrando que o usuário foca em utilizar de 30% a 50% da reputação dele para realizar as operações de like, dislike e unblock.

Temos uma lógica em que o usuário do tipo TROLL só pode mandar mensagens desrespeitosas e neuras enquanto os demais podem enviar mensagens neutras e virais.

As mensagens possuem o seguinte formato:
```json
{
    "text": "blablabla",
    "attachment": {
        "type": "image",
        "b64": "base64code"
}
```
Toda mensagem possuirá um texto base e um anexo. Anteriormente eu pensava em fazer divisão de imagens de alta resolução em um grande número de blocos, mas uma imagem FULLHD já teria potencial de gastar 20 reps e se deixar colocar mais de uma imagem o problema continua, podendo exceder até o total de reputação permitido para um usuário.

A solução para a aplicação é receber uma imagem e quando a imagem for muito grande, realizar um resize ou crop antes de enviar para que a imagem dê em apenas um bloco.

Curiosidades sobre o simulador:
 - Usamos o texto do livro Dom Casmurro como texto da mensagem
 - Usamos imagens geradas pela API https://picsum.photos/



## Execução da simulação

Para executar a simulação basta executar o script python da seguinte forma:
```bash
python3 -m pip install -r requirements.txt
python3 spotted_simulation.py --nodes 5 --users 15 --lifetime 90
```
Sendo:

 - nodes: número de nós simulados
 - users: número de usuários simulados
 - lifetime: Dias simulados, como o trabalho pede 3 meses, colocamos 90 dias

Ou executar o `simul.sh` que faz exatamente os mesmos comandos acima:
```bash
./simul.sh
```