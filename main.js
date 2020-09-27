const Discord = require("discord.js");
const client = new Discord.Client();

const mongoose = require("mongoose");
const connectDB = require("./config/connection");
connectDB();

const Auth = require("./help/Auth");
const Buy = require("./help/Buy");

const config = require("./config/config.json");
const { profile } = require("console");

require("./model/book");
const Book = mongoose.model("book");

require("./model/register");
const Register = mongoose.model("register");

require("./model/setting");
const Setting = mongoose.model("setting");

client.on("ready", () => {
  console.log("Seu dinheiro, meu sucesso!");
});

client.on("message", async (message) => {
  let auth = new Auth(message);

  if (auth.noBot() == true) {
    let opc = auth.opc();

    //Comandos GM
    switch (opc[0]) {
      case config.prefix + "config":
        if (auth.checkGM() == true) {
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
                `Seu saldo é de: ${profiler.wallet} ${config.moeda}`
              );
            }
          });
          break;

        case config.prefix + "buy":
          Register.findOne({ id: message.author.id }).then((profiler) => {
            if (profiler) {
              if (profiler.wallet >= 50) {
                profiler.wallet -= 50;
                const buy = new Buy();

                buy.searchBook().then((arraybook) => {
                  let number = buy.discoveryCard();
                  switch (number) {
                    case "cardR":
                      Book.findOne({ name: arraybook.name }).then((book) => {
                        let indice = [0, 1, 3, 5, 8, 9];
                        indice =
                          indice[Math.floor(Math.random() * indice.length)];

                        let cont = 0;
                        for (let key in profiler.card) {
                          if (profiler.card[key].name == book.card[indice]) {
                            cont += 1;
                          }
                        }

                        if (cont == 0) {
                          profiler.card.push({
                            name: book.card[indice],
                            amount: 1,
                          });
                        } else {
                          for (let key in profiler.card) {
                            if (profiler.card[key].name == book.card[indice]) {
                              profiler.card[key].amount += 1;
                            }
                          }
                        }

                        Register(profiler)
                          .save()
                          .then(() => {
                            message.channel.send(
                              `Parabéns <@!${message.author.id}>, você conseguiu uma carta ${book.typeRare[indice]}.`,
                              {
                                files: [
                                  `./db/Book_${arraybook.name}${book.cardURL[indice]}`,
                                ],
                              }
                            );
                          });
                      });
                      break;

                    case "cardSR":
                      Book.findOne({ name: arraybook.name }).then((book) => {
                        let indice = [2, 4, 6];
                        indice =
                          indice[Math.floor(Math.random() * indice.length)];

                        let cont = 0;
                        for (let key in profiler.card) {
                          if (profiler.card[key].name == book.card[indice]) {
                            cont += 1;
                          }
                        }

                        if (cont == 0) {
                          profiler.card.push({
                            name: book.card[indice],
                            amount: 1,
                          });
                        } else {
                          for (let key in profiler.card) {
                            if (profiler.card[key].name == book.card[indice]) {
                              profiler.card[key].amount += 1;
                            }
                          }
                        }

                        Register(profiler)
                          .save()
                          .then(() => {
                            message.channel.send(
                              `Parabéns <@!${message.author.id}>, você conseguiu uma carta ${book.typeRare[indice]}.`,
                              {
                                files: [
                                  `./db/Book_${arraybook.name}${book.cardURL[indice]}`,
                                ],
                              }
                            );
                          });
                      });
                      break;

                    case "cardUR":
                      Book.findOne({ name: arraybook.name }).then((book) => {
                        let indice = 7;

                        let cont = 0;
                        for (let key in profiler.card) {
                          if (profiler.card[key].name == book.card[indice]) {
                            cont += 1;
                          }
                        }

                        if (cont == 0) {
                          profiler.card.push({
                            name: book.card[indice],
                            amount: 1,
                          });
                        } else {
                          for (let key in profiler.card) {
                            if (profiler.card[key].name == book.card[indice]) {
                              profiler.card[key].amount += 1;
                            }
                          }
                        }

                        Register(profiler)
                          .save()
                          .then(() => {
                            message.channel.send(
                              `Parabéns <@!${message.author.id}>, você conseguiu uma carta ${book.typeRare[indice]}.`,
                              {
                                files: [
                                  `./db/Book_${arraybook.name}${book.cardURL[indice]}`,
                                ],
                              }
                            );
                          });
                      });
                      break;

                    default:
                      message.channel.send(
                        `011 - Erro interno: Carta não localizada`
                      );
                      break;
                  }
                });
              } else {
                message.channel.send(
                  `<@!${message.author.id}>, Seu saldo é insuficiente, seu saldo ${profile.wallet}`
                );
              }
            } else {
              message.channel.send(`Primeiro você tem que abrir uma conta!`);
            }
          });
          break;

        case config.prefix + "daily":
          Register.findOne({ id: message.author.id }).then((profiler) => {
            if (profiler) {
              if (profiler.daily + 86400000 <= new Date().getTime()) {
                profiler.daily = new Date().getTime();
                profiler.wallet += 500;

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
                message.channel.send(
                  `<@!${message.author.id}>, Seu daily só estará habilitado dentre 24h`
                );
              } else {
                message.channel.send(
                  `<@!${message.author.id}>, você já obteve o daily de hoje, tente novamente amanhã!`
                );
              }
            } else {
              message.channel.send(`Primeiro você tem que abrir uma conta!`);
            }
          });
          break;

        case config.prefix + "help":
          const help = new Discord.MessageEmbed()
            .setTitle("Help Commands")
            .setDescription(
              `Register - Cadastra-se no jogo.\n Wallet - Exibe o saldo da conta\n Daily - Obtem 500 moedas diariamente\n Buy - Compra 1 pacote de cartas\n\n\n`
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
              `Config - Configura o bot para responder somente na sala que foi gerado esse comando.\n  ai!Deconfigured - Retira a permissão de capturar comandos da sala que foi gerado esse comando.\n\n\n`
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
            let cont = 0;
            //bookloli
            Book.find({ name: "Loli" }).then((loli) => {
              if (loli.length <= 0) {
                const bookloli = require("./db/Book_Loli/bookLoli");
                new Book(bookloli).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`002 - Erro interno: ${err}`);
                });
              }
            });
            //booktrap
            Book.find({ name: "Trap" }).then((trap) => {
              if (trap.length <= 0) {
                const booktrap = require("./db/Book_Trap/bookTrap");
                new Book(booktrap).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`003 - Erro interno: ${err}`);
                });
              }
            });
            //bookecchi
            Book.find({ name: "Ecchi" }).then((ecchi) => {
              if (ecchi.length <= 0) {
                const bookecchi = require("./db/Book_Ecchi/bookEcchi");
                new Book(bookecchi).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`004 - Erro interno: ${err}`);
                });
              }
            });
            //bookhentai
            Book.find({ name: "Hentai" }).then((hentai) => {
              if (hentai.length <= 0) {
                const bookhentai = require("./db/Book_Hentai/bookHentai");
                new Book(bookhentai).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`005 - Erro interno: ${err}`);
                });
              }
            });
            //mahoushoujo
            Book.find({ name: "MahouShoujo" }).then((mahoushoujo) => {
              if (mahoushoujo.length <= 0) {
                const bookmahoushoujo = require("./db/Book_MahouShoujo/bookMahouShoujo");
                new Book(bookmahoushoujo).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`006 - Erro interno: ${err}`);
                });
              }
            });

            if (cont == 0) {
              message.channel.send("Todos os books criado com sucesso!");
            }

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
  }
});

client.login(config.token);
