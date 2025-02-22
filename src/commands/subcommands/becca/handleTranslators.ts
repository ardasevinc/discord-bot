/* eslint-disable jsdoc/require-param */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { translatorList } from "../../../config/commands/translatorList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles providing a list of translators.
 */
export const handleTranslators: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const list = translatorList.length
      ? translatorList.map((el) => `${el.name} - ${el.language}`).join("\n")
      : t<string, string>("commands:becca.translators.none");
    const embed = new EmbedBuilder();
    embed.setTitle(t<string, string>("commands:becca.translators.title"));
    embed.setDescription(list);
    embed.setColor(Becca.colours.default);
    embed.addFields([
      {
        name: t<string, string>("commands:becca.translators.help"),
        value: t<string, string>("commands:becca.translators.join"),
      },
    ]);
    embed.setFooter({
      text: t<string, string>("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const button = new ButtonBuilder();
    button.setStyle(ButtonStyle.Link);
    button.setLabel(t<string, string>("commands:becca.translators.button"));
    button.setURL("https://chat.nhcarrigan.com");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "translators command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "translators", errorId, t)],
    });
  }
};
