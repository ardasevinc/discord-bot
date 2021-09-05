import { MessageEmbed, ThreadChannel } from "discord.js";

import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Logs when a thread is unarchived or archived.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {ThreadChannel} oldThread The thread state before the update.
 * @param {ThreadChannel} newThread The thread state after the update.
 */
export const threadUpdate = async (
  Becca: BeccaInt,
  oldThread: ThreadChannel,
  newThread: ThreadChannel
): Promise<void> => {
  try {
    const threadEmbed = new MessageEmbed();
    threadEmbed.setFooter(`ID: ${oldThread.id}`);
    threadEmbed.setTimestamp();
    threadEmbed.setColor(Becca.colours.warning);

    if (!oldThread.archived && newThread.archived) {
      threadEmbed.setTitle("Thread Archived");
      threadEmbed.setDescription(
        `The ${oldThread.name} thread in ${oldThread.parent?.name} was archived.`
      );
      await sendLogEmbed(Becca, newThread.guild, threadEmbed);
      return;
    }

    if (oldThread.archived && !newThread.archived) {
      threadEmbed.setTitle("Thread Unarchived");
      threadEmbed.setDescription(
        `The ${oldThread.name} thread in ${oldThread.parent?.name} was unarchived.`
      );
      await sendLogEmbed(Becca, newThread.guild, threadEmbed);
      return;
    }
  } catch (err) {
    beccaErrorHandler(Becca, "thread update event", err);
  }
};
