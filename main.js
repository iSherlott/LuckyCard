const Discord = require("discord.js");
const client = new Discord.Client();

const mongoose = require("mongoose");
const connectDB = require("./config/connection");
connectDB();

const Auth = require("./help/Auth");

const config = require("./config/config.json");

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

                if (channel == 0) {
                  setting.channel.push(message.channel.id);

                  Setting(setting)
                    .save()
                    .then(() => {
                      message.channel.send(`Nova sala cadastrada`);
                    })
                    .catch((err) => {
                      message.channel.send(`009 - Erro interno: ${err}`);
                    });
                } else {
                  message.channel.send(`Sala já cadastrada`);
                }
              }
            }
          });
        } else {
          message.channel.send(
            `Você precisa ser o Dono do servidor para executar esse comando`
          );
        }
    }

    if (auth.validation() == true) {
      let opc = auth.opc();

      //Comandos
      switch (opc[0]) {
        case config.prefix + "register":
          Register.findOne({ id: message.author.id }).then((register) => {
            if (register == null) {
              const singUp = {
                id: message.author.id,
                daily: new Date().toDateString(),
                date: new Date(),
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
          Register.findOne({ id: message.author.id }).then((Profiler) => {
            if (!Profiler) {
              message.channel.send(`Primeiro você tem que abrir uma conta!`);
            } else {
              message.channel.send(
                `Seu saldo é de: ${Profiler.wallet} ${config.moeda}`
              );
            }
          });
          break;

        case config.prefix + "help":
          const help = new Discord.MessageEmbed()
            .setTitle("Help Commands")
            .setDescription(
              `Register - Cadastra-se no jogo.\n Wallet - Exibe o saldo da conta\n Daily - Obtem 500 moedas diariamente \n\n\n`
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
            .setDescription(`Createbook - Regaz todos os Book\n\n\n`)
            .setColor("#8A2BE2")
            .setFooter(
              `Dica: Utilize o prefixo ${config.prefix} para executar os comandos.`
            );
          message.channel.send(commandgm);
          break;
      }

      //Comandos GM
      if (auth.authLevel3() == true) {
        switch (opc[0]) {
          case config.prefix + "createbook":
            let cont = 0;
            //bookloli
            Book.find({ name: "loli" }).then((loli) => {
              if (loli.length <= 0) {
                const bookloli = require("./db/Book_Loli/bookLoli");
                new Book(bookloli).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`002 - Erro interno: ${err}`);
                });
              }
            });
            //booktrap
            Book.find({ name: "trap" }).then((trap) => {
              if (trap.length <= 0) {
                const booktrap = require("./db/Book_Trap/bookTrap");
                new Book(booktrap).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`003 - Erro interno: ${err}`);
                });
              }
            });
            //bookecchi
            Book.find({ name: "ecchi" }).then((ecchi) => {
              if (ecchi.length <= 0) {
                const bookecchi = require("./db/Book_Ecchi/bookEcchi");
                new Book(bookecchi).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`004 - Erro interno: ${err}`);
                });
              }
            });
            //bookhentai
            Book.find({ name: "hentai" }).then((hentai) => {
              if (hentai.length <= 0) {
                const bookhentai = require("./db/Book_Hentai/bookHentai");
                new Book(bookhentai).save().catch((err) => {
                  cont += 1;
                  message.channel.send(`005 - Erro interno: ${err}`);
                });
              }
            });
            //mahoushoujo
            Book.find({ name: "mahoushoujo" }).then((mahoushoujo) => {
              if (mahoushoujo.length <= 0) {
                const bookmahoushoujo = require("./db/Book_Mahou_Shojo/bookMahouShoujo");
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
        }
      }
    }
  }
});

client.login(config.token);