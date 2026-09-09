# Inspetor Helio

O **Inspetor Helio** inspeciona os inversores do sistema Helios, analisando os equipamentos **um por um** e identificando ocorrências relevantes.

## Modos de inspeção

### 🔎 Inspecionar

Realiza uma **inspeção completa** dos inversores, independentemente de o equipamento estar gerando ou não.

A inspeção considera:

- Falhas identificadas no inversor;
- Potência igual a zero;
- Ausência de informação de potência;
- Falhas de comunicação, após confirmação.

### 📋 Coleta simples

Realiza uma **inspeção simplificada**.

Inversores que estejam gerando são ignorados:

- **P ≠ 0** → pular inversor
- **P = 0** → inspecionar
- **P = null** → inspecionar

O objetivo é coletar apenas os inversores que apresentam alguma condição que justifique uma inspeção adicional.

## Instalação

O Inspetor Helio funciona como um **bookmarklet**, diretamente no navegador.

### 1. Copiar o bookmarklet

Abra o arquivo **[Versão Bookmarklet](./Bookmarklet.md)** e copie **todo o conteúdo**:

**CTRL + A** → **CTRL + C**

> **Importante:** copie o conteúdo completo, incluindo o início `javascript:`.

### 2. Criar o favorito

No navegador:

1. Crie um novo favorito.
2. Dê um nome, por exemplo: **Inspetor Helio**.
3. No campo **URL / Endereço**, cole o conteúdo copiado com **CTRL + V**.
4. Salve o favorito.

### 3. Executar

Com o **Helios aberto**, clique no favorito **Inspetor Helio**.

O painel do Inspetor será carregado na página e você poderá utilizar:

- 🔎 **Inspecionar**
- 📋 **Coleta simples**

## Estrutura

- `README.md` → documentação do projeto
- `Bookmarklet.md` → versão pronta para instalação no navegador
