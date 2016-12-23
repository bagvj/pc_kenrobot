define(['vendor/jquery', 'app/util/util', 'app/config/config', 'app/util/emitor', 'app/model/projectModel'], function($1, util, config, emitor, projectModel) {
	var dialogWin;
	var image;
	var imageHash;
	var dialogType;
	var projectInfo;

	function init() {
		dialogWin = $('.project-dialog');
		image = $('.image', dialogWin);

		$('.upload', dialogWin).on('click', onUploadClick);

		emitor.on('project', 'show', onShow);
	}

	function onShow(args) {
		args = args || {};
		
		dialogType = args.type || "new";
		
		if(dialogType == "edit" || dialogType == "save") {
			projectInfo = args.data;
			imageHash = projectInfo.imageHash;
			setImage((config.target != "pc" ? "" : config.host) + "/project/image/" + (projectInfo.imageHash || "default"));
			$('.upload', dialogWin).val("修改项目图片");
			$('.name', dialogWin).val(projectInfo.project_name).focus();
			$('.intro', dialogWin).val(projectInfo.project_intro);
			$('.public[value="' + projectInfo.public_type + '"]', dialogWin).attr("checked", true);
			$('.confirm', dialogWin).val("保存");
		} else {
			imageHash = null;
			setImage();
			$('.upload', dialogWin).val("上传项目图片");
			$('.name', dialogWin).val('').focus();
			$('.intro', dialogWin).val('');
			$('.confirm', dialogWin).val("创建");
		}

		util.dialog({
			selector: dialogWin,
			onConfirm: onConfirmClick,
			onClosed: onDialogClosed,
		});
	}

	function onConfirmClick() {
		var data = {
			imageHash: imageHash || "default",
			id: projectInfo ? projectInfo.id : 0,
			project_name: $('.name', dialogWin).val(),
			project_intro: $('.intro', dialogWin).val(),
			public_type: $('.public:checked', dialogWin).val(),
		}
		emitor.trigger("project", "save", data, dialogType, dialogType == "save");
	}

	function onDialogClosed() {
		imageHash = null;
		dialogType = null;
		projectInfo = null;
		setImage();
		$('.name', dialogWin).val('').focus();
		$('.intro', dialogWin).val('');
		$('.public:eq(0)', dialogWin).attr("checked", true);
	}

	function onUploadClick(e) {
		$('.file', dialogWin).replaceWith('<input class="file" type="file" accept="image/jpeg" />').on("change", onFileChange).trigger('click');
	}

	function onFileChange(e) {
		var file = this.files[0];
		var message = $('.message', dialogWin);
		if(file.size > 1024 * 1024 * 2) {
			util.showMessage(message, "图片不超过2M");
			return;
		}
		
		var url = window.URL.createObjectURL(file);
		setImage(url);

		var data = new FormData();
		data.append('file', file);
		projectModel.upload(data, onUploadProgress).done(function(result) {
			util.showMessage(message, result.message);
			imageHash = result.status == 0 ? result.hash : null;
		});
	}

	function onUploadProgress(e) {

	}

	function setImage(url) {
		if(url) {
			image.css('background-image', 'url("' + url + '")').removeClass("no-image");
		} else {
			image.css('background-image', '').addClass("no-image");
		}
	}

	return {
		init: init,
	};
});