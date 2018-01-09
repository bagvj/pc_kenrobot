ace.define("ace/theme/default",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isdefault = true;
exports.cssClass = "ace-default";
exports.cssText = "\
.ace-default .ace_gutter {\
  background: transparent;\
  color: #979797;\
}\
.ace-default .ace_print-margin {\
  width: 1px;\
  background: #555651;\
}\
.ace-default {\
  background-color: transparent;\
  color: rgba(18, 42, 64, 0.8);\
}\
.ace-default .ace_cursor {\
  color: transparent;\
}\
.ace-default .ace_marker-layer .ace_selection {\
  background-color: rgba(225, 231, 246, 0.5);\
}\
.ace-default.ace_multiselect .ace_selection.ace_start {\
  box-shadow: 0 0 3px 0px #534F59;\
}\
.ace-default .ace_marker-layer .ace_step {\
  background: rgb(102, 82, 0);\
}\
.ace-default .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
}\
.ace-default .ace_marker-layer .ace_active-line {\
  background: transparent;\
}\
.ace-default .ace_gutter-active-line {\
  background-color: transparent;\
}\
.ace-default .ace_invisible {\
  color: #52524d;\
}\
.ace-default .ace_entity.ace_name.ace_tag,\
.ace-default .ace_keyword,\
.ace-default .ace_meta.ace_tag,\
.ace-default .ace_storage {\
  color: #f66f6f;\
}\
.ace-default .ace_punctuation,\
.ace-default .ace_punctuation.ace_tag {\
  color: white;\
}\
.ace-default .ace_constant.ace_character,\
.ace-default .ace_constant.ace_language {\
  color: #AE81FF;\
}\
.ace-default .ace_constant.ace_other {\
  color: #12a9df;\
}\
.ace-default .ace_constant.ace_numeric{\
  color: #ef3c97;\
}\
.ace-default .ace_invalid {\
  color: #F8F8F0;\
  background-color: #F92672;\
}\
.ace-default .ace_invalid.ace_deprecated {\
  color: #F8F8F0;\
  background-color: #AE81FF;\
}\
.ace-default .ace_support.ace_constant,\
.ace-default .ace_support.ace_function {\
  color: #ffa24d;\
}\
.ace-default .ace_fold {\
  background-color: #A6E22E;\
  border-color: #F8F8F2;\
}\
.ace-default .ace_storage.ace_type,\
.ace-default .ace_support.ace_class,\
.ace-default .ace_support.ace_type {\
  color: #6f9fc5;\
}\
.ace-default .ace_entity.ace_name.ace_function,\
.ace-default .ace_entity.ace_other,\
.ace-default .ace_entity.ace_other.ace_attribute-name,\
.ace-default .ace_variable {\
  color: #A6E22E;\
}\
.ace-default .ace_variable.ace_parameter {\
  color: #FD971F;\
}\
.ace-default .ace_string {\
  color: #ffaa26;\
}\
.ace-default .ace_comment {\
  color: #a9b6d2;\
}\
.ace-default .ace_identifier {\
  color: #0088ff;\
}\
.ace-default .ace_operator {\
  color: rgba(18, 42, 64, 0.8);\
}\
.ace-default .ace_br1 {\
  border-top-left-radius: 0;\
}\
.ace-default .ace_br12 {\
  border-bottom-right-radius: 0;\
  border-bottom-left-radius: 0;\
}\
.ace-default .ace_br15 {\
  border-radius: 0;\
}\
.ace-default .ace_gutter-cell {\
	padding-left: 19px;\
  border-right: 1px solid #a9b6d2;\
  color: #718ac0;\
  letter-spacing: 2px;\
}\
.ace-default .ace_content {\
  padding-left: 15px;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
