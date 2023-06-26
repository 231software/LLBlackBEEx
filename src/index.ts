// LiteLoaderScript Dev Helper
/// <reference path="../../dts/HelperLib/src/index.d.ts"/>

import {
  PLUGIN_DESCRIPTION,
  PLUGIN_EXTRA,
  PLUGIN_NAME,
  PLUGIN_VERSION,
} from './const';

logger.setTitle(PLUGIN_NAME);
logger.setFile(`logs/${PLUGIN_NAME}.log`);
logger.info("本插件为新月国际服定制版，严禁外传！若在其他服务器上使用而对原作者造成侵权，新月工作室不对此负责")

require('./command');
require('./listener');

ll.registerPlugin(
  PLUGIN_NAME,
  PLUGIN_DESCRIPTION,
  PLUGIN_VERSION,
  PLUGIN_EXTRA
);

// todo: 私有库管理，手动上传私有库，本地黑名单传私有库
