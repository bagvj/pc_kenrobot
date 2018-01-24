define(function() {
	function matchBuildProgress(output) {
		var reg = /===info \|\|\| Progress \{\d+\} \|\|\| \[(\d+\.\d+)\]/g;
		var result;
		var temp;
		do {
			result = temp;
			temp = reg.exec(output);
		} while(temp);

		return result ? parseInt(result[1]) : -1;
	}

	function matchUploadProgress(helper, output, type) {
		var reg;
		if(type == "genuino101") {
			reg = /Download	\[[= ]+\][ ]+(\d+)\%/g;
			if(!reg.test(output)) {
				return 0;
			}

			var temp;
			var match = reg.exec(output);
			do {
				temp = match;
				match = reg.exec(output);
			} while(match)
			
			return parseInt(temp[1]);
		} else {
			var state = helper.state;
			if(!state) {
				reg = /Writing \|/g;
				if(reg.test(output)) {
					helper.state = "writing";
					return 20;
				}
				return 0;
			} else if(state == "writing") {
				reg = / \| 100\% \d+\.\d+/g;
				if(reg.test(output)) {
					helper.state = "checking";
					return 60;
				}

				reg = /#/g;
				helper.writeCount = helper.writeCount || 0;
				while(reg.exec(output)) {
					helper.writeCount++;
				}
				return 20 + parseInt(40 * helper.writeCount / 50);
			} else {
				reg = / \| 100\% \d+\.\d+/g;
				if(reg.test(output)) {
					return 100;
				}

				reg = /#/g;
				helper.checkCount = helper.checkCount || 0;
				while(reg.exec(output)) {
					helper.checkCount++;
				}
				return 60 + parseInt(40 * helper.checkCount / 50);
			}
		}
	}

	return {
		matchBuildProgress: matchBuildProgress,
		matchUploadProgress: matchUploadProgress,
	}
});