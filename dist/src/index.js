"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
logger.setTitle(const_1.PLUGIN_NAME);
logger.setFile(`logs/${const_1.PLUGIN_NAME}.log`);
logger.info("本插件为新月国际服定制版，严禁外传！若在其他服务器上使用而对原作者造成侵权，新月工作室不对此负责")
require('./command');
require('./listener');
ll.registerPlugin(const_1.PLUGIN_NAME, const_1.PLUGIN_DESCRIPTION, const_1.PLUGIN_VERSION, const_1.PLUGIN_EXTRA);
