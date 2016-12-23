define(['app/util/util', 'app/util/emitor', './block'], function(util, emitor, block) {
	var schema;
	var groupBlocks = {};

	function init(container, dragContainer) {
		block.init(container, dragContainer);
	}

	function loadSchema(_schema) {
		schema = {
			blocks: {},
		};

		_schema.blocks.forEach(function(blockData) {
			schema.blocks[blockData.name] = blockData;
		});

		block.loadSchema(schema.blocks);
	}

	function getSchema() {
		return schema;
	}

	function getCode() {
		return {
			global: getGroupBlock("global").getCode(),
			setup: getGroupBlock("setup").getCode(),
			loop: getGroupBlock("loop").getCode()
		};
	}

	function getData() {
		var globalBlock = getGroupBlock("global");
		var setupBlock = getGroupBlock("setup");
		var loopBlock = getGroupBlock("loop");

		return {
			global: globalBlock.getStructure(),
			setup: setupBlock.getStructure(),
			loop: loopBlock.getStructure(),
		};
	}

	function setData(data) {
		data = data || {};
		block.resetBlocks();

		emitor.trigger("software", "update-block");

		groupBlocks = {};

		var globalBlock = block.buildBlock(ensureGroupStructure(data.global));
		groupBlocks["global"] = globalBlock;

		var setupBlock = block.buildBlock(ensureGroupStructure(data.setup));
		groupBlocks["setup"] = setupBlock;

		var loopBlock = block.buildBlock(ensureGroupStructure(data.loop));
		groupBlocks["loop"] = loopBlock;
	}

	function getBlock(uid) {
		return block.getBlock(uid);
	}

	function createBlock(name) {
		return block.createBlock(name);
	}

	function getGroupBlock(name) {
		return groupBlocks[name];
	}

	function updateDynamicBlocks(groups) {
		block.updateDynamicBlocks(groups);
	}

	function ensureGroupStructure(structure, name) {
		structure = structure || {};
		structure.name = structure.name || "group";
		structure.enable = structure.enable || true;
		structure.children = structure.children || [];
		structure.content = structure.content || [];

		return structure;
	}

	return {
		init: init,

		getData: getData,
		setData: setData,
		getCode: getCode,

		loadSchema: loadSchema,
		getSchema: getSchema,

		createBlock: createBlock,
		getBlock: getBlock,

		getGroupBlock: getGroupBlock,

		updateDynamicBlocks: updateDynamicBlocks,
	}
});