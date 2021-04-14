'use strict';

const iframilyConstants = require('../src/constants');

const FRAME_TYPE_PARENT = 'parent';
const FRAME_TYPE_CHILD = 'child';
const FRAME_TYPE_CHILD1 = 'child1';
const FRAME_TYPE_CHILD2 = 'child2';
const FRAME_TYPE_CHILD2_INNER_CHILD = 'child2_innerchild';

const DEFAULT_FRAMILY_VAR_NAME = 'iframily';
const DEFAULT_FRAMILY_ID = 'testId-default';

const INIT_METHOD_NAMES = {
    [FRAME_TYPE_PARENT]: 'initParent',
    [FRAME_TYPE_CHILD]: 'initChild',
    [FRAME_TYPE_CHILD1]: 'initChild',
    [FRAME_TYPE_CHILD2]: 'initChild',
    [FRAME_TYPE_CHILD2_INNER_CHILD]: 'initChild',
};

module.exports = {
    DANGEROUSLY_SET_WILDCARD: iframilyConstants.DANGEROUSLY_SET_WILDCARD,
    FRAME_TYPE_PARENT,
    FRAME_TYPE_CHILD,
    FRAME_TYPE_CHILD1,
    FRAME_TYPE_CHILD2,
    FRAME_TYPE_CHILD2_INNER_CHILD,
    DEFAULT_FRAMILY_VAR_NAME,
    DEFAULT_FRAMILY_ID,
    INIT_METHOD_NAMES
};
