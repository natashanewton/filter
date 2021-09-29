import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import {ExtendFilter}  from './CustomFilter/DepartmentFilter';
import reducers, { namespace } from './states';
var syncClient = require('twilio-sync')
import {DepartmentFilterList} from './CustomFilter/DepartmentFilter'
const PLUGIN_NAME = 'AgentFilterPlugin';
import { AgentFilterList } from './CustomFilter/DepartmentFilter';
import { HierarchyFilterList } from './CustomFilter/DepartmentFilter';

export default class AgentFilterPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    ExtendFilter(flex, manager)
    DepartmentFilterList(flex,manager)
    AgentFilterList(flex,manager)
     
    HierarchyFilterList(flex,manager)
  }
  
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
