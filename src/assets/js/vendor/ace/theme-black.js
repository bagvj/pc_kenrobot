ace.define("ace/theme/black",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.cssClass = "ace-black";
exports.cssText = "\
.ace-black .ace_gutter {\
  background: transparent;\
  color: #979797;\
}\
.ace-black .ace_print-margin {\
  width: 1px;\
  background: #555651;\
}\
.ace-black {\
  background-color: transparent;\
  color: #979797;\
}\
.ace-black .ace_cursor {\
  color: transparent;\
}\
.ace-black .ace_marker-layer .ace_selection {\
  background-color: rgba(225, 231, 246, 0.5);\
}\
.ace-black.ace_multiselect .ace_selection.ace_start {\
  box-shadow: 0 0 3px 0px #534F59;\
}\
.ace-black .ace_marker-layer .ace_step {\
  background: rgb(102, 82, 0);\
}\
.ace-black .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
}\
.ace-black .ace_marker-layer .ace_active-line {\
  background: transparent;\
}\
.ace-black .ace_gutter-active-line {\
  background-color: transparent;\
}\
.ace-black .ace_invisible {\
  color: #52524d;\
}\
.ace-black .ace_entity.ace_name.ace_tag,\
.ace-black .ace_keyword,\
.ace-black .ace_meta.ace_tag,\
.ace-black .ace_storage {\
  color: #f66f6f;\
}\
.ace-black .ace_punctuation,\
.ace-black .ace_punctuation.ace_tag {\
  color: white;\
}\
.ace-black .ace_constant.ace_character,\
.ace-black .ace_constant.ace_language {\
  color: #AE81FF;\
}\
.ace-black .ace_constant.ace_other {\
  color: #12a9df;\
}\
.ace-black .ace_constant.ace_numeric{\
  color: #ef3c97;\
}\
.ace-black .ace_invalid {\
  color: #F8F8F0;\
  background-color: #F92672;\
}\
.ace-black .ace_invalid.ace_deprecated {\
  color: #F8F8F0;\
  background-color: #AE81FF;\
}\
.ace-black .ace_support.ace_constant,\
.ace-black .ace_support.ace_function {\
  color: #ffa24d;\
}\
.ace-black .ace_fold {\
  background-color: #A6E22E;\
  border-color: #F8F8F2;\
}\
.ace-black .ace_storage.ace_type,\
.ace-black .ace_support.ace_class,\
.ace-black .ace_support.ace_type {\
  color: #6f9fc5;\
}\
.ace-black .ace_entity.ace_name.ace_function,\
.ace-black .ace_entity.ace_other,\
.ace-black .ace_entity.ace_other.ace_attribute-name,\
.ace-black .ace_variable {\
  color: #A6E22E;\
}\
.ace-black .ace_variable.ace_parameter {\
  color: #FD971F;\
}\
.ace-black .ace_string {\
  color: #ffaa26;\
}\
.ace-black .ace_comment {\
  color: #a9b6d2;\
}\
.ace-black .ace_identifier {\
  color: #0088ff;\
}\
.ace-black .ace_operator {\
  color: rgba(18, 42, 64, 0.8);\
}\
.ace-black .ace_br1 {\
  border-top-left-radius: 0;\
}\
.ace-black .ace_br12 {\
  border-bottom-right-radius: 0;\
  border-bottom-left-radius: 0;\
}\
.ace-black .ace_br15 {\
  border-radius: 0;\
}\
.ace-black .ace_gutter-cell {\
	padding-left: 19px;\
  color: #22709e;\
  letter-spacing: 2px;\
}\
.ace-black .ace_content {\
  padding-left: 15px;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
