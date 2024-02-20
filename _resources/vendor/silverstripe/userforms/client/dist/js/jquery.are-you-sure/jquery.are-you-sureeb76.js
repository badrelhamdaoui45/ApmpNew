/*!
* jQuery Plugin: Are-You-Sure (Dirty Form Detection)
* https://github.com/codedance/jquery.AreYouSure/
*
* Copyright (c) 2012-2014, Chris Dance and PaperCut Software http://www.papercut.com/
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* Author: chris.dance@papercut.com
* Version: 1.9.0
* Date: 13th August 2014
*/(function($){$.fn.areYouSure=function(options){var settings=$.extend({'message':'You have unsaved changes!','dirtyClass':'dirty','change':null,'silent':false,'addRemoveFieldsMarksDirty':false,'fieldEvents':'change keyup propertychange input','fieldSelector':":input:not(input[type=submit]):not(input[type=button])"},options);var getValue=function($field){if($field.hasClass('ays-ignore')||$field.hasClass('aysIgnore')||$field.attr('data-ays-ignore')||$field.attr('name')===undefined){return null;}
if($field.is(':disabled')){return 'ays-disabled';}
var val;var type=$field.attr('type');if($field.is('select')){type='select';}
switch(type){case 'checkbox':case 'radio':val=$field.is(':checked');break;case 'select':val='';$field.find('option').each(function(o){var $option=$(this);if($option.is(':selected')){val+=$option.val();}});break;default:val=$field.val();}
return val;};var storeOrigValue=function($field){$field.data('ays-orig',getValue($field));};var checkForm=function(evt){var isFieldDirty=function($field){var origValue=$field.data('ays-orig');if(undefined===origValue){return false;}
return(getValue($field)!=origValue);};var $form=($(this).is('form'))?$(this):$(this).parents('form');if(isFieldDirty($(evt.target))){setDirtyStatus($form,true);return;}
$fields=$form.find(settings.fieldSelector);if(settings.addRemoveFieldsMarksDirty){var origCount=$form.data("ays-orig-field-count");if(origCount!=$fields.length){setDirtyStatus($form,true);return;}}
var isDirty=false;$fields.each(function(){$field=$(this);if(isFieldDirty($field)){isDirty=true;return false;}});setDirtyStatus($form,isDirty);};var initForm=function($form){var fields=$form.find(settings.fieldSelector);$(fields).each(function(){storeOrigValue($(this));});$(fields).unbind(settings.fieldEvents,checkForm);$(fields).bind(settings.fieldEvents,checkForm);$form.data("ays-orig-field-count",$(fields).length);setDirtyStatus($form,false);};var setDirtyStatus=function($form,isDirty){var changed=isDirty!=$form.hasClass(settings.dirtyClass);$form.toggleClass(settings.dirtyClass,isDirty);if(changed){if(settings.change)settings.change.call($form,$form);if(isDirty)$form.trigger('dirty.areYouSure',[$form]);if(!isDirty)$form.trigger('clean.areYouSure',[$form]);$form.trigger('change.areYouSure',[$form]);}};var rescan=function(){var $form=$(this);var fields=$form.find(settings.fieldSelector);$(fields).each(function(){var $field=$(this);if(!$field.data('ays-orig')){storeOrigValue($field);$field.bind(settings.fieldEvents,checkForm);}});$form.trigger('checkform.areYouSure');};var reinitialize=function(){initForm($(this));}
if(!settings.silent&&!window.aysUnloadSet){window.aysUnloadSet=true;$(window).bind('beforeunload',function(){$dirtyForms=$("form").filter('.'+settings.dirtyClass);if($dirtyForms.length==0){return;}
if(navigator.userAgent.toLowerCase().match(/msie|chrome/)){if(window.aysHasPrompted){return;}
window.aysHasPrompted=true;window.setTimeout(function(){window.aysHasPrompted=false;},900);}
return settings.message;});}
return this.each(function(elem){if(!$(this).is('form')){return;}
var $form=$(this);$form.submit(function(){$form.removeClass(settings.dirtyClass);});$form.bind('reset',function(){setDirtyStatus($form,false);});$form.bind('rescan.areYouSure',rescan);$form.bind('reinitialize.areYouSure',reinitialize);$form.bind('checkform.areYouSure',checkForm);initForm($form);});};})(jQuery);