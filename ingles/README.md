# Inglês como se fala

Um app para aprender inglês **falando pela leitura** e **ouvindo pelo ouvido**.

Toda frase aparece em três linhas:

| | |
|---|---|
| Inglês | Could you say that again? |
| Fala-se | **KUD**-jâ **SEI** dhét â-**GUÉN**? |
| Significa | Pode repetir? |

A linha do meio é a pronúncia escrita com as regras de leitura do português (a mesma ideia do romaji no japonês). A sílaba em MAIÚSCULA é a forte.

## Como usar

Abra `index.html` no navegador (Chrome, Edge ou Safari, que têm voz em inglês). Não precisa instalar nada.

Cada lição tem 4 passos:

1. **Ler**: o diálogo com inglês, pronúncia e tradução. Leia em voz alta e compare com o áudio.
2. **Falar**: você faz um papel e a voz faz o outro. Aparece a frase em português e você fala em inglês.
3. **Ouvir**: o texto fica escondido. Você escuta, tenta entender, e só depois confere.
4. **Ditado**: ouça e escreva. O app marca as palavras que escaparam.

Tudo que você estuda vai para a **Revisão**, que traz as frases de volta em intervalos crescentes (1, 3, 7, 14, 30 dias).

## Conteúdo

12 lições com diálogos do dia a dia: pedir para repetir, cumprimentos, se apresentar, café, restaurante, direções, imigração, hotel, compras, reunião online, combinar com amigos e farmácia. Além do diálogo, cada lição tem frases úteis extras e observações sobre os erros mais comuns de brasileiros.

O **Guia de pronúncia** explica cada símbolo com exemplos em áudio, pares de palavras que confundem (ship/sheep, can/can't, fifteen/fifty) e as palavras que "encolhem" na fala rápida.

## Arquivos

- `index.html`: página e estilos
- `app.js`: lógica (voz, passos, ditado, revisão)
- `lessons.js`: todo o conteúdo. Para criar uma lição nova, copie uma existente e siga o mesmo formato.

O progresso fica salvo no navegador (localStorage).
