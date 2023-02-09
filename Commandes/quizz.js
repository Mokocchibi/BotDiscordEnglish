const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {

    name: "quizz",
    description: "Lance le quizz pour la présentation de Discord.js",
    permission: "Aucune",
    dm: false,
    options: [],

    async run(Bot, message) {

        if ( !(message.user.id === "503568040001273877" || message.user.id === "363781911346151424") ) {
            return message.reply({content: "Vous n'êtes pas autorisé à utiliser cette commande.", ephemeral: true});
        }

        let participants = []

        let button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Primary),
            );

        const questions = [
            {
                "nQuestion": 1,
                "title": "When Discord was created ?",
                "answer1": "2014",
                "answer2": "2015",
                "answer3": "2016",
                "answer4": "2017",
                "answer": "2",
                "color": "Red"
            },
            {
                "nQuestion": 2,
                "title": "Is \"Better Discord\" allowed by Discord?",
                "answer1": "Yes",
                "answer2": "No",
                "answer3": "",
                "answer4": "",
                "answer": "2",
                "color": "Red"
            },
            {
                "nQuestion": 3,
                "title": "What is a Runtime environment ?",
                "answer1": "The terminal",
                "answer2": "A software to run programs",
                "answer3": "The Operating System",
                "answer4": "A virtual space in the PC where the program has admin authorisation",
                "answer": "2",
                "color": "Red"
            }
        ]

        let isPresentationShowingPhase = true;
        let isAnwsersShowingPhase = true;
        let cantAnswer = false;

        let nbQuestion = 1;

        let currentQuestion = questions[nbQuestion-1];

        let embed  = new EmbedBuilder()
            .setColor(currentQuestion.color)
            .setTitle("DiscordJS Quizz")
            .setDescription(`This quiz is similar to a kahoot, the faster you answer, the more points you earn. It contains ${questions.length} questions.\nYou do not have to register for the quiz, you will be registered the moment you answer a question.\nGood quiz !`);

        await message.channel.send({ embeds: [embed], components: [button]});

        const collector = await message.channel.createMessageComponentCollector();

        let timer = 0;
        let intervalId = null;

        const startTimer = () => {
            timer = 0;
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                timer+=0.1;
            }, 100);
        };

        const stopTimer = () => {
            clearInterval(intervalId);
        };

        startTimer();

        collector.on("collect", async i => {

            const data = collector.collected.last();

            if (cantAnswer && !(data.customId === "next")) {
                return await i.reply({ content: "Vous ne pouvez pas choisir de réponse pendant la phase d'annonce des réponses.", ephemeral: true })
            }

            const currentParticipant = participants.find(o => o.id === data.user.id);

            if (currentParticipant === undefined && data.customId !== "next") {
                participants.push({
                    "id": data.user.id,
                    "name": data.user.username,
                    "points": 0,
                    "answered": true,
                    "goodAnswers": 0
                });
            } else if (currentParticipant !== undefined && data.customId !== "next") {
                if (currentParticipant.answered) {
                    return i.reply({ content: "Vous avez déjà répondu à cette question, veuillez attendre la prochaine", ephemeral: true });
                } else {
                    for (j=0; j<participants.length;j++) {
                        if (participants[j].id === data.user.id) {
                            participants[j].answered = true;
                        }
                    }
                }
            }

            switch (data.customId) {
                case "next":
                    if ( !(data.user.id === "503568040001273877" || data.user.id === "363781911346151424") ) {
                        return await i.reply({content: "Vous n'êtes pas autorisé à passer à la prochaine question, veuillez attendre que les organisateurs le fasse.", ephemeral: true});
                    } else {

                        if (isPresentationShowingPhase) {
                            isPresentationShowingPhase = false;

                            button = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("1")
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("2")
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId("3")
                                    .setLabel("3")
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId("4")
                                    .setLabel("4")
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId("next")
                                    .setLabel("Next")
                                    .setStyle(ButtonStyle.Primary),
                            );

                            embed = new EmbedBuilder()
                                    .setColor(currentQuestion.color)
                                    .setTitle(currentQuestion.title)
                                    .setDescription(`1 - ${currentQuestion.answer1}\n2 - ${currentQuestion.answer2}\n3 - ${currentQuestion.answer3}\n4 - ${currentQuestion.answer4}`);

                            return await i.update({ embeds: [embed], components: [button] });
                        }

                        if (isAnwsersShowingPhase) {
                            cantAnswer = true;
                            isAnwsersShowingPhase = false;

                            stopTimer();

                            for (j=0; j<button.components.length-1;j++) {
                                if (button.components[j].data.custom_id === currentQuestion.answer) {
                                    button.components[j].setStyle(ButtonStyle.Success)
                                } else {
                                    button.components[j].setStyle(ButtonStyle.Danger)
                                }
                            }
                            await i.update({ embeds: [embed], components: [button] });

                        } else {
                            cantAnswer = false;
                            isAnwsersShowingPhase = true;
    
                            participants.sort(function(a, b){
                                return a.points - b.points;
                            });
    
                            if (nbQuestion < questions.length) {
                                nbQuestion++
                                currentQuestion = questions[nbQuestion-1]
        
                                embed = new EmbedBuilder()
                                    .setColor(currentQuestion.color)
                                    .setTitle(currentQuestion.title)
                                    .setDescription(`1 - ${currentQuestion.answer1}\n2 - ${currentQuestion.answer2}\n3 - ${currentQuestion.answer3}\n4 - ${currentQuestion.answer4}`);
        
                                for (j=0; j<button.components.length-1;j++) {
                                    button.components[j].setStyle(ButtonStyle.Secondary)
                                }

                                startTimer();

                                await i.update({ embeds: [embed], components: [button] });

                                for (j=0; j<participants.length;j++) {
                                    participants[j].answered = false;
                                }
                            } else {

                                let stringRanking = "";

                                participants = participants.reverse()

                                for (j=0; j<participants.length;j++) {
                                    stringRanking += `${j+1} - ${participants[j].name} | ${participants[j].points} points  (${participants[j].goodAnswers}/${questions.length})`
                                    switch (j) {
                                        case 0:
                                            stringRanking += " :first_place:"
                                            break;
                                        case 1:
                                            stringRanking += " :second_place:"
                                            break;
                                        case 2:
                                            stringRanking += " :third_place:"
                                            break;
                                    }
                                    if (j == participants.length-1) {
                                        stringRanking += '\n\n**Winner :**';
                                    } else {
                                        stringRanking += '\n'
                                    }
                                }

                                const member = message.guild.members.cache.get(participants[0].id);
                                const user = await member.fetch();
                                const avatar = user.user.displayAvatarURL({ format: "png", dynamic: true });

                                embed = new EmbedBuilder()
                                    .setColor("Gold")
                                    .setTitle("Ranking")
                                    .setDescription(stringRanking)
                                    .setImage(avatar);

                                await i.update({ embeds: [embed], components: [] });

                                isPresentationShowingPhase = true;
                                isAnwsersShowingPhase = true;

                                participants = []
                            }
                        }
                    }
                    break;

                default:
                    if (data.customId === currentQuestion.answer) {
                        for (j=0; j<participants.length;j++) {
                            if (participants[j].id === data.user.id) {
                                const y = 1000 * Math.exp(-0.05 * (timer)); // Calcul des points par rapport au temps mis pour répondre
                                participants[j].points += Math.ceil(y);
                                participants[j].goodAnswers++;
                            }
                        }
                    }
                    await i.reply({ content: `Vous avez choisis la réponse ${data.customId} à la question numéro ${nbQuestion}`, ephemeral:true })
                    break;

            }
            
        })

    }

}