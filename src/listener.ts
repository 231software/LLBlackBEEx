import { banPlayer, formatLocalKickMsg } from './black-local';
import { check, formatBlackBEInfo, formatBlackBEKickMsg } from './blackbe';
import { config, localList, saveLocalList } from './config';
import { formatLocalItemShort } from './query';
import { delFormatCode, stripIp, wrapAsyncFunc } from './util';

// hhh
const listenerType = (config.processOnPreJoin
  ? 'onPreJoin'
  : 'onJoin') as unknown as 'onJoin';

mc.listen(
  listenerType,
  wrapAsyncFunc(async (player) => {
    if (player.isSimulatedPlayer()) return;

    // 查本地
    const { hidePassMessage, banIp, banDevice } = config;

    const { realName, xuid } = player;
    const { ip, clientId } = player.getDevice();
    const stripedIp = stripIp(ip);

    if (!hidePassMessage)
      //logger.info(`正在从本地黑名单查询玩家 ${realName} 的封禁记录……`);

    try {
      for (const it of localList.list) {
        if (
          realName === it.name ||
          xuid === it.xuid ||
          (banIp && it.ips && it.ips.includes(stripedIp)) ||
          (banDevice && it.clientIds && it.clientIds.includes(clientId))
        ) {
          // 更新信息，例如 ip 地址，顺便踢掉
          banPlayer({ player }, { kickTip: formatLocalKickMsg(it) });
          logger.warn(`查询到玩家 ${realName} 存在本地封禁记录，已将其踢出`);
          return;
        }
      }
    } catch (e) {
      logger.error(`查询玩家 ${realName} 的本地黑名单记录出错！\n${String(e)}`);
      return;
    }

    if (!hidePassMessage)
      //logger.info(`没有查询到玩家 ${realName} 的本地黑名单记录`);

    // 查 BlackBE
    if (
      config.pardonBlackBE.includes(realName) ||
      config.pardonBlackBE.includes(xuid)
    ) {
      if (!hidePassMessage)
        //logger.info(`玩家 ${realName} 的 BlackBE 违规记录检查已被赦免`);
      return;
    }

    if (!hidePassMessage)
      //logger.info(`正在从 BlackBE 查询玩家 ${realName} 的违规记录……`);

    try {
      const { data } = await check({ name: realName, xuid });
      const { exist, info } = data;

      if (exist) {
        banPlayer({ player }, { kickTip: formatBlackBEKickMsg(info[0]) });

        const formattedInfo =
          `§6查询到玩家 §d${realName} §6在 BlackBE 中存在违规记录！\n` +
          `§c已将其踢出并加入本地黑名单！§r\n` +
          `${await formatBlackBEInfo(info[0])}`;
        mc.broadcast(formattedInfo);
        logger.warn(delFormatCode(formattedInfo));

        return;
      }
    } catch (e) {
      logger.error(
        `查询玩家 ${realName} 的 BlackBE 违规记录出错！\n${String(e)}`
      );
      return;
    }

    if (!hidePassMessage){
      //logger.info(`没有查询到玩家 ${realName} 的 BlackBE 违规记录`);
    }
      
  })
);

setInterval(() => {
  const { list } = localList;
  const originalLen = list.length;

  let offset = 0;
  for (let i = 0; i < originalLen; i += 1) {
    const realI = i - offset;

    const it = list[realI];
    const { endTime } = it;
    const nowTime = Date.now();

    if (endTime && nowTime >= new Date(endTime).getTime()) {
      // del
      list.splice(realI, 1);
      offset += 1;
      saveLocalList();

      const formatted = delFormatCode(formatLocalItemShort(it));
      logger.warn(`玩家 ${formatted} 的黑名单封禁到期，已自动解封`);
    }
  }
}, config.checkLocalListInterval);
