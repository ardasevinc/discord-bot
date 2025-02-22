/* eslint-disable jsdoc/require-param */
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import HistoryModel from "../../../database/models/HistoryModel";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Fetches a user's moderation history from the database and parses it for display.
 */
export const handleHistory: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }
    const targetMember = await guild.members.fetch(target.id);

    if (
      typeof member.permissions === "string" ||
      (!member.permissions.has(PermissionFlagsBits.KickMembers) &&
        !member.permissions.has(PermissionFlagsBits.BanMembers) &&
        !member.permissions.has(PermissionFlagsBits.ModerateMembers)) ||
      !targetMember ||
      targetMember.permissions.has(PermissionFlagsBits.KickMembers) ||
      targetMember.permissions.has(PermissionFlagsBits.BanMembers) ||
      targetMember.permissions.has(PermissionFlagsBits.ModerateMembers)
    ) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:noPermission")),
      });
      return;
    }

    const targetRecord = await HistoryModel.findOne({
      serverId: guild.id,
      userId: target.id,
    });

    if (!targetRecord) {
      await interaction.editReply({
        content: t<string, string>("commands:mod.history.clean"),
      });
      return;
    }

    const embed = new EmbedBuilder();
    embed.setTitle(
      t<string, string>("commands:mod.history.title", { user: target.tag })
    );
    embed.setDescription(t<string, string>("commands:mod.history.description"));
    embed.setColor(Becca.colours.default);
    embed.setThumbnail(target.displayAvatarURL());
    embed.addFields([
      {
        name: t<string, string>("commands:mod.history.ban"),
        value: String(targetRecord.bans),
        inline: true,
      },
      {
        name: t<string, string>("commands:mod.history.kick"),
        value: String(targetRecord.kicks),
        inline: true,
      },
      {
        name: t<string, string>("commands:mod.history.warn"),
        value: String(targetRecord.warns),
        inline: true,
      },
      {
        name: t<string, string>("commands:mod.history.mute"),
        value: String(targetRecord.mutes),
        inline: true,
      },
      {
        name: t<string, string>("commands:mod.history.unmute"),
        value: String(targetRecord.unmutes),
        inline: true,
      },
    ]);

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "history command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "history", errorId, t)],
    });
  }
};
