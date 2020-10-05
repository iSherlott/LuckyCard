const xlsxFile = require("read-excel-file/node");
const Discord = require("discord.js");
const client = new Discord.Client();

const mongoose = require("mongoose");
const connectDB = require("./config/connection");
connectDB();

const Auth = require("./help/Auth");
const Buy = require("./help/Buy");

const config = require("./config/config.json");

require("./model/Book");
const Book = mongoose.model("book");

require("./model/Register");
const Register = mongoose.model("register");

require("./model/CardObtained");
const CardObtained = mongoose.model("cardObtained");

require("./model/Card");
const Card = mongoose.model("card");

require("./model/Setting");
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
                let data = new Date(profiler.daily);
                let day = data.getDate().toString();
                let month = (data.getMonth() + 1).toString();
                let year = data.getFullYear();
                let hour =
                  data.getHours() +
                  ":" +
                  data.getMinutes() +
                  ":" +
                  data.getSeconds();
                message.channel.send(
                  `<@!${message.author.id}>, Seu daily só estará habilitado depois do dia ${day}/${month}/${year} ás ${hour}`
                );
              } else {
                let data = new Date(profiler.daily);
                let day = data.getDate().toString();
                let month = (data.getMonth() + 1).toString();
                let year = data.getFullYear();
                let hour =
                  data.getHours() +
                  ":" +
                  data.getMinutes() +
                  ":" +
                  data.getSeconds();
                message.channel.send(
                  `<@!${message.author.id}>, você já obteve o daily de hoje, tente novamente depois de ${day}/${month}/${year} ás ${hour}`
                );
              }
            } else {
              message.channel.send(`Primeiro você tem que abrir uma conta!`);
            }
          });
          break;

        case config.prefix + "buy":
          Register.findOne({ id: message.author.id }).then((profiler) => {
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
            try {
              Book.deleteMany({}, () => {});
              Card.deleteMany({}, () => {});

              Book.insertMany([
                { bookName: "Loli" },
                { bookName: "Trap" },
                { bookName: "Ecchi" },
                { bookName: "Hentai" },
                { bookName: "MahouShoujo" },
              ]);

              xlsxFile("./assets/book.xlsx").then((rows) => {
                for (let index = 1; index <= rows.length - 1; index++) {
                  Book.findOne({ bookName: rows[index][4] }).then((book) => {
                    const card = {
                      book_id: book._id,
                      cardName: rows[index][0],
                      anime: rows[index][1],
                      cardURL: rows[index][2],
                      typeRare: rows[index][3],
                    };

                    Card(card).save();
                  });
                }
              });

              message.channel.send(
                `Todos os books e card foram criado com sucesso!`
              );
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
  }
});

client.login(config.token);
