/* eslint-disable jsdoc/require-param */
import { GuildMember, PermissionFlagsBits } from "discord.js";

import LevelModel from "../../../database/models/LevelModel";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Deletes the server's level data, resetting everyone's progress.
 */
export const handleResetLevels: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { guild, member } = interaction;

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has(
        PermissionFlagsBits.ManageGuild
      ) &&
      member.user.id !== Becca.configs.ownerId
    ) {
      await interaction.editReply({
        content: getRandomValue(t<string, string[]>("responses:noPermission")),
      });
      return;
    }

    const currentLevels = await LevelModel.find({ serverID: guild.id });

    if (!currentLevels || !currentLevels.length) {
      await interaction.editReply({
        content: t<string, string>("commands:manage.levels.none"),
      });
      return;
    }
    for (const level of currentLevels) {
      await level.delete();
    }
    await interaction.editReply({
      content: t<string, string>("commands:manage.levels.success"),
    });
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset level command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reset level", errorId, t)],
    });
  }
};
