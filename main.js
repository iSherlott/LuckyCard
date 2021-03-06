const xlsxFile = require("read-excel-file/node");
const Discord = require("discord.js");
const client = new Discord.Client();

const mongoose = require("mongoose");
const connectDB = require("./config/connection");
connectDB();

const Auth = require("./help/Auth");
const Buy = require("./help/Buy");
const SearchCard = require("./help/SearchCard");
const Rank = require("./help/Rank");

const config = require("./config/config.json");

require("./model/log");
const Log = mongoose.model("log");

require("./model/book");
const Book = mongoose.model("book");

require("./model/register");
const Register = mongoose.model("register");

require("./model/cardobtained");
const CardObtained = mongoose.model("cardObtained");

require("./model/card");
const Card = mongoose.model("card");

require("./model/setting");
const Setting = mongoose.model("setting");

client.on("ready", () => {
  console.log("Seu dinheiro, meu sucesso!");
  client.user.setActivity(`"+comandos: ai!help"`);
});

client.on("message", async (message) => {
  let auth = new Auth(message);

  if (auth.noBot() == true) {
    let opc = auth.opc();

    //Comandos GM
    switch (opc[0]) {
      case config.prefix + "config":
        if (auth.checkGM() == true || auth.authLevel3() == true) {
          Setting.findOne({ serverID: message.guild.id }).then((setting) => {
            if (!setting) {
              const signUpServer = {
                serverID: message.guild.id,
                channel: message.channel.id,
                serverGM: message.guild.owner.id,
              };

              new Setting(signUpServer).save().then(() => {
                message.channel
                  .send(`Bot Configurado com sucesso!`)
                  .catch((err) => {
                    message.channel.send(`008 - Erro interno: ${err}`);
                  });
              });
            } else {
              var channel = 0;
              for (let key in setting.channel) {
                if (setting.channel[key] == message.channel.id) {
                  channel += 1;
                }
              }
              if (channel == 0) {
                setting.channel.push(message.channel.id);

                Setting.updateOne({ serverID: message.guild.id }, setting).then(
                  () => {
                    message.channel.send(`Sala configurada com sucesso!`);
                  }
                );
              } else {
                message.channel.send(`Sala já cadastrada`);
              }
            }
          });
        } else {
          message.channel.send(
            `Você precisa ser o Dono do servidor para executar esse comando`
          );
        }
        break;

      case config.prefix + "deconfigured":
        Setting.findOne({ serverID: message.guild.id }).then((setting) => {
          setting.channel.pull(message.channel.id);

          Setting(setting)
            .save()
            .then(() => {
              message.channel.send(
                "A preferencia desse chat foi removida com sucesso, Aisha não ira mais responder comandos desse sala"
              );
            });
        });
        break;
    }

    if (auth.validation() == true && (await auth.validationChannel()) == true) {
      let opc = auth.opc();

      //Comandos
      switch (opc[0]) {
        case config.prefix + "register":
          Register.findOne({ id: message.author.id }).then((register) => {
            if (register == null) {
              const singUp = {
                id: message.author.id,
                update: 0,
                daily: parseInt(new Date().getTime()),
                fortune: parseInt(new Date().getTime()),
                date: parseInt(new Date().getTime()),
              };

              new Register(singUp)
                .save()
                .then(() => {
                  message.channel.send("Cadastrado com sucesso!");
                })
                .catch((err) => {
                  message.channel.send("007 - Erro interno: " + err);
                });
            } else {
              message.channel.send("Usuario já cadastrado!");
            }
          });
          break;

        case config.prefix + "wallet":
          Register.findOne({ id: message.author.id }).then((profiler) => {
            if (!profiler) {
              message.channel.send(`Primeiro você tem que abrir uma conta!`);
            } else {
              message.channel.send(
                `<@!${message.author.id}>, Seu saldo é de: ${profiler.wallet} ${config.moeda}`
              );
            }
          });
          break;

        case config.prefix + "daily":
          Register.findOne({ id: message.author.id }).then((profiler) => {
            if (profiler) {
              if (profiler.daily + 86400000 <= new Date().getTime()) {
                profiler.daily = new Date().getTime();
                profiler.wallet += 1000;

                Register(profiler)
                  .save()
                  .then(() => {
                    message.channel.send(
                      `Parabéns <@!${message.author.id}>, Seu novo saldo é de ${profiler.wallet}.`
                    );
                  })
                  .catch((err) => {
                    message.channel.send(`010 - Erro interno: ${err}`);
                  });
              } else if (profiler.date + 86400000 >= new Date().getTime()) {
                let data = new Date(profiler.daily + 86400000);
                let day = data.getDate().toString();
                let month = (data.getMonth() + 1).toString();
                let year = data.getFullYear();
                let hour =
                  ("00" + data.getHours()).slice(-2) +
                  ":" +
                  ("00" + data.getMinutes()).slice(-2) +
                  ":" +
                  ("00" + data.getSeconds()).slice(-2);
                message.channel.send(
                  `<@!${message.author.id}>, Seu daily só estará habilitado depois do dia ${day}/${month}/${year} ás ${hour}`
                );
              } else {
                let data = new Date(profiler.daily + 86400000);
                let day = data.getDate().toString();
                let month = (data.getMonth() + 1).toString();
                let year = data.getFullYear();
                let hour =
                  ("00" + data.getHours()).slice(-2) +
                  ":" +
                  ("00" + data.getMinutes()).slice(-2) +
                  ":" +
                  ("00" + data.getSeconds()).slice(-2);
                message.channel.send(
                  `<@!${message.author.id}>, você já obteve o daily de hoje, tente novamente depois de ${day}/${month}/${year} ás ${hour}`
                );
              }
            } else {
              message.channel.send(`Primeiro você tem que abrir uma conta!`);
            }
          });
          break;

        case config.prefix + "fortune":
          Register.findOne({ id: message.author.id }).then((profiler) => {
            if (profiler) {
              if (profiler.fortune + 3600000 <= new Date().getTime()) {
                profiler.fortune = new Date().getTime();
                let number_random = Math.floor(Math.random() * 500);
                profiler.wallet += number_random;

                Register(profiler)
                  .save()
                  .then(() => {
                    message.channel.send(
                      `Parabéns <@!${message.author.id}>, Você acabou de ganhar: ${number_random} ${config.moeda}`
                    );
                  });
              } else {
                let fortune = new Date(profiler.fortune + 3600000);
                let fortune_hour =
                  ("00" + fortune.getHours()).slice(-2) +
                  ":" +
                  ("00" + fortune.getMinutes()).slice(-2) +
                  ":" +
                  ("00" + fortune.getSeconds()).slice(-2);
                message.channel.send(
                  `<@!${message.author.id}>, você ainda está no intervalo de tempo, retorna somente depois das ${fortune_hour}`
                );
              }
            } else {
              message.channel.send(`Primeiro você tem que abrir uma conta!`);
            }
          });
          break;

        case config.prefix + "buy":
          Register.findOne({ id: message.author.id }).then((profiler) => {
            if (profiler) {
              if (profiler.wallet >= 50) {
                profiler.wallet -= 50;

                const buy = new Buy();

                buy.card().then((buyCard) => {
                  CardObtained.findOne({
                    id: message.author.id,
                    cardName: buyCard.cardName,
                  }).then((card) => {
                    if (card) {
                      card.amount += 1;

                      CardObtained(card)
                        .save()
                        .then(() => {
                          message.channel.send(
                            `Parabéns <@!${message.author.id}>, Essa é a sua ${card.amount} carta ${buyCard.cardName}`,
                            {
                              files: [
                                `./assets/Book_${buyCard.book_id}${buyCard.cardURL}`,
                              ],
                            }
                          );
                        });
                    } else {
                      const newCard = {
                        id: message.author.id,
                        amount: 1,
                        cardName: buyCard.cardName,
                        typeRare: buyCard.typeRare,
                        typeBook: buyCard.book_id,
                      };

                      new CardObtained(newCard).save().then(() => {
                        message.channel.send(
                          `<@!${message.author.id}>, Parabéns você obteve uma carta ${buyCard.typeRare}`,
                          {
                            files: [
                              `./assets/Book_${buyCard.book_id}${buyCard.cardURL}`,
                            ],
                          }
                        );
                      });
                    }
                  });

                  Register(profiler).save();
                });
              } else {
                message.channel.send(
                  `<@!${message.author.id}>, Seu saldo é insuficiente`
                );
              }
            } else {
              message.channel.send(
                `<@!${message.author.id}>, Você primeiro tem que abri uma conta`
              );
            }
          });
          break;

        case config.prefix + "packbuy":
          if (opc[1]) {
            let text = opc[1];
            let endText = "";
            let textUpper = [...text];
            textUpper[0] = textUpper[0].toUpperCase();
            textUpper.forEach((element) => {
              endText = endText + element;
            });
            if (endText == "Mahoushoujo") {
              endText = "MahouShoujo";
            }
            let typebook = endText;

            Book.find({ bookName: typebook }).then((bookValid) => {
              if (bookValid.length > 0) {
                Register.findOne({ id: message.author.id }).then((profiler) => {
                  if (profiler) {
                    if (profiler.wallet >= 200) {
                      profiler.wallet -= 200;

                      const buy = new Buy();

                      buy.specialCard(opc[1]).then((buyCard) => {
                        CardObtained.findOne({
                          id: message.author.id,
                          cardName: buyCard.cardName,
                        }).then((card) => {
                          if (card) {
                            card.amount += 1;

                            CardObtained(card)
                              .save()
                              .then(() => {
                                message.channel.send(
                                  `Parabéns <@!${message.author.id}>, Essa é a sua ${card.amount} carta ${buyCard.cardName}`,
                                  {
                                    files: [
                                      `./assets/Book_${buyCard.book_id}${buyCard.cardURL}`,
                                    ],
                                  }
                                );
                              });
                          } else {
                            const newCard = {
                              id: message.author.id,
                              amount: 1,
                              cardName: buyCard.cardName,
                              typeRare: buyCard.typeRare,
                              typeBook: buyCard.book_id,
                            };

                            new CardObtained(newCard).save().then(() => {
                              message.channel.send(
                                `<@!${message.author.id}>, Parabéns você obteve uma carta ${buyCard.typeRare}`,
                                {
                                  files: [
                                    `./assets/Book_${buyCard.book_id}${buyCard.cardURL}`,
                                  ],
                                }
                              );
                            });
                          }
                        });

                        Register(profiler).save();
                      });
                    } else {
                      message.channel.send(
                        `<@!${message.author.id}>, Seu saldo é insuficiente`
                      );
                    }
                  } else {
                    message.channel.send(
                      `<@!${message.author.id}>, Você primeiro tem que abri uma conta`
                    );
                  }
                });
              } else {
                message.channel.send(
                  `<@!${message.author.id}>, Não existe um book com esse nome: ${opc[1]}`
                );
              }
            });
          } else {
            message.channel.send(
              `<@!${message.author.id}>, Você precisa informa qual book deseja compra!`
            );
          }
          break;

        case config.prefix + "list":
          let searchCard = new SearchCard();
          searchCard.book(message.author.id, opc[1]).then((dateRank) => {
            if (dateRank.length > 0) {
              const dateTop = new Discord.MessageEmbed()
                .setAuthor(
                  message.author.username,
                  `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`
                )
                .setTitle(`Lista de cartas do book ${opc[1]}`)
                .setColor("#8A2BE2")
                .setFooter(
                  `Você possue ${dateRank.length}/10 cartas do book ${opc[1]} `
                );
              dateRank.forEach((element) => {
                dateTop.addField(
                  element.typeRare + " " + element.cardName,
                  element.amount + "x Exemplares"
                );
              });

              message.channel.send(dateTop);
            } else {
              message.channel.send(
                `<@!${message.author.id}>, Você não tem cartas desse book`
              );
            }
          });
          break;

        case config.prefix + "rank":
          const rank = new Rank();

          rank.rank().then((consultRank) => {
            if (consultRank.length >= 10) {
              Card.find({})
                .countDocuments()
                .then((totalcard) => {
                  const rank_card = new Discord.MessageEmbed()
                    .setTitle("Top Rank Cartas")
                    .setColor("#8A2BE2").setDescription(`
                  #01 Nome: <@!${consultRank[0].id}> - Quantidade de cartas: ${consultRank[0].total}/${totalcard}\n
                  #02 Nome: <@!${consultRank[1].id}> - Quantidade de cartas: ${consultRank[1].total}/${totalcard}\n
                  #03 Nome: <@!${consultRank[2].id}> - Quantidade de cartas: ${consultRank[2].total}/${totalcard}\n
                  #04 Nome: <@!${consultRank[3].id}> - Quantidade de cartas: ${consultRank[3].total}/${totalcard}\n
                  #05 Nome: <@!${consultRank[4].id}> - Quantidade de cartas: ${consultRank[4].total}/${totalcard}\n
                  #06 Nome: <@!${consultRank[5].id}> - Quantidade de cartas: ${consultRank[5].total}/${totalcard}\n
                  #07 Nome: <@!${consultRank[6].id}> - Quantidade de cartas: ${consultRank[6].total}/${totalcard}\n
                  #08 Nome: <@!${consultRank[7].id}> - Quantidade de cartas: ${consultRank[7].total}/${totalcard}\n
                  #09 Nome: <@!${consultRank[8].id}> - Quantidade de cartas: ${consultRank[8].total}/${totalcard}\n
                  #10 Nome: <@!${consultRank[9].id}> - Quantidade de cartas: ${consultRank[9].total}/${totalcard}\n
                  `);
                  message.channel.send(rank_card);
                });
            } else {
              message.channel.send(
                `Ainda não há quantidade minima de jogadores para exibir um rank`
              );
            }
          });
          break;

        case config.prefix + "rankr":
          const rankR = new Rank();

          rankR.rankR().then((consultRank) => {
            if (consultRank.length >= 10) {
              Card.find({ typeRare: "[R]" })
                .countDocuments()
                .then((totalcard) => {
                  const rankR_card = new Discord.MessageEmbed()
                    .setTitle("Top Rank Cartas [R]")
                    .setColor("#8A2BE2").setDescription(`
                  #01 Nome: <@!${consultRank[0].id}> - Quantidade de cartas: ${consultRank[0].total}/${totalcard}\n
                  #02 Nome: <@!${consultRank[1].id}> - Quantidade de cartas: ${consultRank[1].total}/${totalcard}\n
                  #03 Nome: <@!${consultRank[2].id}> - Quantidade de cartas: ${consultRank[2].total}/${totalcard}\n
                  #04 Nome: <@!${consultRank[3].id}> - Quantidade de cartas: ${consultRank[3].total}/${totalcard}\n
                  #05 Nome: <@!${consultRank[4].id}> - Quantidade de cartas: ${consultRank[4].total}/${totalcard}\n
                  #06 Nome: <@!${consultRank[5].id}> - Quantidade de cartas: ${consultRank[5].total}/${totalcard}\n
                  #07 Nome: <@!${consultRank[6].id}> - Quantidade de cartas: ${consultRank[6].total}/${totalcard}\n
                  #08 Nome: <@!${consultRank[7].id}> - Quantidade de cartas: ${consultRank[7].total}/${totalcard}\n
                  #09 Nome: <@!${consultRank[8].id}> - Quantidade de cartas: ${consultRank[8].total}/${totalcard}\n
                  #10 Nome: <@!${consultRank[9].id}> - Quantidade de cartas: ${consultRank[9].total}/${totalcard}\n
                  `);
                  message.channel.send(rankR_card);
                });
            } else {
              message.channel.send(
                `Ainda não há quantidade minima de jogadores para exibir um rank`
              );
            }
          });
          break;

        case config.prefix + "ranksr":
          const rankSR = new Rank();

          rankSR.rankSR().then((consultRank) => {
            if (consultRank.length >= 10) {
              Card.find({ typeRare: "[SR]" })
                .countDocuments()
                .then((totalcard) => {
                  const rankSR_card = new Discord.MessageEmbed()
                    .setTitle("Top Rank Cartas [R]")
                    .setColor("#8A2BE2").setDescription(`
                  #01 Nome: <@!${consultRank[0].id}> - Quantidade de cartas: ${consultRank[0].total}/${totalcard}\n
                  #02 Nome: <@!${consultRank[1].id}> - Quantidade de cartas: ${consultRank[1].total}/${totalcard}\n
                  #03 Nome: <@!${consultRank[2].id}> - Quantidade de cartas: ${consultRank[2].total}/${totalcard}\n
                  #04 Nome: <@!${consultRank[3].id}> - Quantidade de cartas: ${consultRank[3].total}/${totalcard}\n
                  #05 Nome: <@!${consultRank[4].id}> - Quantidade de cartas: ${consultRank[4].total}/${totalcard}\n
                  #06 Nome: <@!${consultRank[5].id}> - Quantidade de cartas: ${consultRank[5].total}/${totalcard}\n
                  #07 Nome: <@!${consultRank[6].id}> - Quantidade de cartas: ${consultRank[6].total}/${totalcard}\n
                  #08 Nome: <@!${consultRank[7].id}> - Quantidade de cartas: ${consultRank[7].total}/${totalcard}\n
                  #09 Nome: <@!${consultRank[8].id}> - Quantidade de cartas: ${consultRank[8].total}/${totalcard}\n
                  #10 Nome: <@!${consultRank[9].id}> - Quantidade de cartas: ${consultRank[9].total}/${totalcard}\n
                  `);
                  message.channel.send(rankSR_card);
                });
            } else {
              message.channel.send(
                `Ainda não há quantidade minima de jogadores para exibir um rank`
              );
            }
          });
          break;

        case config.prefix + "rankur":
          const rankUR = new Rank();

          rankUR.rankUR().then((consultRank) => {
            if (consultRank.length >= 10) {
              Card.find({ typeRare: "[UR]" })
                .countDocuments()
                .then((totalcard) => {
                  const rankUR_card = new Discord.MessageEmbed()
                    .setTitle("Top Rank Cartas [UR]")
                    .setColor("#8A2BE2").setDescription(`
                  #01 Nome: <@!${consultRank[0].id}> - Quantidade de cartas: ${consultRank[0].total}/${totalcard}\n
                  #02 Nome: <@!${consultRank[1].id}> - Quantidade de cartas: ${consultRank[1].total}/${totalcard}\n
                  #03 Nome: <@!${consultRank[2].id}> - Quantidade de cartas: ${consultRank[2].total}/${totalcard}\n
                  #04 Nome: <@!${consultRank[3].id}> - Quantidade de cartas: ${consultRank[3].total}/${totalcard}\n
                  #05 Nome: <@!${consultRank[4].id}> - Quantidade de cartas: ${consultRank[4].total}/${totalcard}\n
                  #06 Nome: <@!${consultRank[5].id}> - Quantidade de cartas: ${consultRank[5].total}/${totalcard}\n
                  #07 Nome: <@!${consultRank[6].id}> - Quantidade de cartas: ${consultRank[6].total}/${totalcard}\n
                  #08 Nome: <@!${consultRank[7].id}> - Quantidade de cartas: ${consultRank[7].total}/${totalcard}\n
                  #09 Nome: <@!${consultRank[8].id}> - Quantidade de cartas: ${consultRank[8].total}/${totalcard}\n
                  #10 Nome: <@!${consultRank[9].id}> - Quantidade de cartas: ${consultRank[9].total}/${totalcard}\n
                  `);
                  message.channel.send(rankUR_card);
                });
            } else {
              message.channel.send(
                `Ainda não há quantidade minima de jogadores para exibir um rank`
              );
            }
          });
          break;

        case config.prefix + "bookall":
          const allBook = new Rank();

          allBook.allCard(message.author.id).then((all_book) => {
            const resultbook = new Discord.MessageEmbed()
              .setAuthor(
                message.author.username,
                `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`
              )
              .setColor("#836FFF");
            all_book.forEach((element) => {
              resultbook.addField(
                "Book " + element.id,
                "Total de cards: " + element.total + "/10",
                true
              );
            });

            message.channel.send(resultbook);
          });
          break;

        case config.prefix + "help":
          const help = new Discord.MessageEmbed()
            .setTitle("Help Commands")
            .setDescription(
              `Register - Cadastra-se no jogo.\n Wallet - Exibe o saldo da conta\n Daily - Obtem 1000 moedas diariamente\n Fortune - Obtem por hora um valor aleatório dentre 1 a 500\n Buy - Compra 1 pacote de cartas no valora de 50 ${config.moeda}\n PackBuy "book" - Compra um pack do book desejado no valor de 200 ${config.moeda}.\n BookAll - Exibe todas as cartas de todos os books\n List "Nome do book" - exibe as cartas que você já obteve do book especifico.\n Rank - Rank do top 10 cartas.\n RankR - Rank do top 10 cartas [R].\n RankSR - Rank do top 10 cartas [SR].\n RankUR - Rank do top 10 cartas [UR].\n\n\n`
            )
            .setColor("#8A2BE2")
            .setFooter(
              `Dica: Utilize o prefixo ${config.prefix} para executar os comandos.`
            );
          message.channel.send(help);
          break;

        case config.prefix + "commandgm":
          const commandgm = new Discord.MessageEmbed()
            .setTitle("Comandos GM")
            .setDescription(
              `Config - Configura o bot para responder somente na sala que foi gerado esse comando.\n  Deconfigured - Retira a permissão de capturar comandos da sala que foi gerado esse comando.\n\n\n`
            )
            .setColor("#8A2BE2")
            .setFooter(
              `Dica: Utilize o prefixo ${config.prefix} para executar os comandos.`
            );
          message.channel.send(commandgm);
          break;
      }

      //Comandos Level3
      if (auth.authLevel3() == true) {
        switch (opc[0]) {
          case config.prefix + "createbook":
            try {
              Book.deleteMany({}, () => {
                Card.deleteMany({}, () => {
                  Book.insertMany([
                    { bookName: "Loli" },
                    { bookName: "Trap" },
                    { bookName: "Ecchi" },
                    { bookName: "Hentai" },
                    { bookName: "MahouShoujo" },
                    { bookName: "Shounen" },
                    { bookName: "Romance" },
                    { bookName: "Yuri" },
                    { bookName: "Harem" },
                  ]);

                  xlsxFile("./assets/book.xlsx").then((rows) => {
                    for (let index = 1; index <= rows.length - 1; index++) {
                      Book.findOne({ bookName: rows[index][4] }).then(
                        (book) => {
                          const card = {
                            book_id: book._id,
                            cardName: rows[index][0],
                            anime: rows[index][1],
                            cardURL: rows[index][2],
                            typeRare: rows[index][3],
                          };

                          Card(card).save();
                        }
                      );
                    }
                  });

                  message.channel.send(
                    `Todos os books e card foram criado com sucesso!`
                  );
                });
              });
            } catch (error) {
              message.channel.send(`013 - Erro interno: ${error}`);
            }

            break;

          case config.prefix + "erasebook":
            Book.deleteMany();
            Card.deleteMany({});
            message.channel.send(
              `Todos os books e card foram apagadas com sucesso!`
            );
            break;

          case config.prefix + "add":
            let value = parseInt(opc[1]);
            let user = opc[2].slice(3, 21);

            Register.findOne({ id: user }).then((profiler) => {
              if (profiler) {
                if (value >= 0) {
                  profiler.wallet += value;
                  profiler.update = new Date().getTime();

                  Register(profiler)
                    .save()
                    .then(() => {
                      message.channel.send(
                        `Valor de ${value} ${config.moeda} adicionada com sucesso na conta do ${opc[2]}`
                      );
                    });
                } else {
                  message.channel.send(`Valor digitado invalido.`);
                }
              } else {
                message.channel.send(`Usuario ${opc[2]} não localizado.`);
              }
            });
            break;

          case config.prefix + "sub":
            let valueSub = parseInt(opc[1]);
            let userSub = opc[2].slice(3, 21);
            Register.findOne({ id: userSub }).then((profiler) => {
              if (profiler) {
                if (valueSub >= 0 && valueSub <= profiler.wallet) {
                  profiler.wallet -= valueSub;
                  profiler.update = new Date().getTime();

                  Register(profiler)
                    .save()
                    .then(() => {
                      message.channel.send(
                        `Valor de ${valueSub} ${config.moeda} subtraido com sucesso na conta do ${opc[2]}`
                      );
                    })
                    .catch((err) => {
                      message.channel.send(`012 - Erro interno: ${err}`);
                    });
                } else if (profiler.wallet) {
                  message.channel.send(
                    `O valor a ser retirado é supeior a o valor que há na conta.`
                  );
                } else {
                  message.channel.send(`Valor digitado invalido.`);
                }
              } else {
                message.channel.send(`Usuario ${opc[2]} não localizado.`);
              }
            });
            break;
        }
      }
    }

    if (auth.validation() == true && (await auth.validationChannel()) == true) {
      //System Log
      Log.findOne({
        servidor_id: message.guild.id,
        channel_id: message.channel.id,
      }).then((log) => {
        if (log) {
          log.command.push([message.author.id, message.content, new Date()]);
          Log.updateOne(
            { servidor_id: message.guild.id, channel_id: message.channel.id },
            log
          );
        } else {
          const log = {
            command: [],
            servidor_id: message.guild.id,
            servidor_Name: message.guild.name,
            channel_id: message.channel.id,
            game_master: message.guild.owner,
            memberCount: message.guild.memberCount,
            region: message.channel.region,
          };
          log.command.push([message.author.id, message.content, new Date()]),
            Log(log).save();
        }
      });
      //end System log
    }
  }
});

client.login(config.token);
