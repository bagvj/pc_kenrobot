ace.define("ace/theme/white",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.cssClass = "ace-white";
exports.cssText = "\
.ace-white .ace_gutter {\
  background: #fafafa;\
  color: #b9b9bd;\
}\
.ace-white .ace_print-margin {\
  width: 1px;\
  background: #555651;\
}\
.ace-white {\
  background-color: white;\
  color: #666;\
}\
.ace-white .ace_cursor {\
  color: #666;\
}\
.ace-white .ace_marker-layer .ace_selection {\
  background-color: rgba(81, 126, 255, 0.1);\
}\
.ace-white.ace_multiselect .ace_selection.ace_start {\
  box-shadow: 0 0 3px 0px #534F59;\
}\
.ace-white .ace_marker-layer .ace_step {\
  background: rgb(102, 82, 0);\
}\
.ace-white .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
}\
.ace-white .ace_marker-layer .ace_active-line {\
  background: #edf5ff;\
}\
.ace-white .ace_gutter-active-line {\
  background-color: #edf5ff;\
}\
.ace-white .ace_invisible {\
  color: #52524d;\
}\
.ace-white .ace_entity.ace_name.ace_tag,\
.ace-white .ace_keyword,\
.ace-white .ace_meta.ace_tag,\
.ace-white .ace_storage {\
  color: #9b59b6;\
}\
.ace-white .ace_punctuation,\
.ace-white .ace_punctuation.ace_tag {\
  color: white;\
}\
.ace-white .ace_constant.ace_character,\
.ace-white .ace_constant.ace_language {\
  color: #e74c3c;\
}\
.ace-white .ace_constant.ace_other {\
  color: #e74c3c;\
}\
.ace-white .ace_constant.ace_numeric{\
  color: #e74c3c;\
}\
.ace-white .ace_invalid {\
  color: #F8F8F0;\
  background-color: #F92672;\
}\
.ace-white .ace_invalid.ace_deprecated {\
  color: #F8F8F0;\
  background-color: #AE81FF;\
}\
.ace-white .ace_support.ace_constant {\
  color: #9b59b6;\
}\
.ace-white .ace_support.ace_function {\
  color: #20a0ff;\
}\
.ace-white .ace_fold {\
  background-color: #A6E22E;\
  border-color: #F8F8F2;\
}\
.ace-white .ace_storage.ace_type,\
.ace-white .ace_support.ace_class,\
.ace-white .ace_support.ace_type {\
  color: #9b59b6;\
}\
.ace-white .ace_entity.ace_name.ace_function,\
.ace-white .ace_entity.ace_other,\
.ace-white .ace_entity.ace_other.ace_attribute-name,\
.ace-white .ace_variable {\
  color: #A6E22E;\
}\
.ace-white .ace_variable.ace_parameter {\
  color: #FD971F;\
}\
.ace-white .ace_string,\
.ace-white .ace_string ace_start,\
.ace-white .ace_string ace_end {\
  color: #27ae60;\
}\
.ace-white .ace_comment {\
  color: #b9b9bd;\
}\
.ace-white .ace_identifier {\
  color: #e67e22;\
}\
.ace-white .ace_operator {\
  color: #666;\
}\
.ace-white .ace_br1 {\
  border-top-left-radius: 0;\
}\
.ace-white .ace_br12 {\
  border-bottom-right-radius: 0;\
  border-bottom-left-radius: 0;\
}\
.ace-white .ace_br15 {\
  border-radius: 0;\
}\
.ace-white .ace_gutter-cell {\
	padding-left: 19px;\
  color: #b9b9bd;\
}\
.ace-white .ace_rightAlignedText {\
  display: none;\
}\
.ace_editor.ace_autocomplete {\
  color: #666;\
  line-height: 20px;\
}\
.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\
  background-color: #eaeaea;\
}\
.ace_editor.ace_autocomplete .ace_marker-layer .ace_line-hover {\
  background-color: #f2f2f2;\
  border: none;\
}\
.ace_editor.ace_autocomplete .ace_completion-highlight {\
  color: #20a0ff;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
