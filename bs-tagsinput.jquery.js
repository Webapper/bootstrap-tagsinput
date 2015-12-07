/**
 * Created by assarte on 2015.12.01.
 */
+function ($) {
	'use strict';

	// TAGS INPUT PUBLIC CLASS DEFINITION
	// ================================

	/**
	 * @class TagsInput
	 *
	 * @event addnew.bs.tagsinput.data-api(event, plugin) Fires when a user action requires adding a new tag
	 *
	 * @param element
	 * @param options
	 * @constructor
	 */
	var TagsInput = function (element, options) {
		this.$element      = $(element)
		this.options       = $.extend({}, TagsInput.DEFAULTS, options)
		this.$selectedList = this.$element.find('.tagsinput-selected-tags .input-group')
		this.$selectedTags = this.$element.find('.tagsinput-selected-tags .input-group .input-tag')
		this.$status       = this.$element.find('.tagsinput-status')
		this.$tags         = this.$element.find('.tagsinput-tags input')

		var self = this

		/**
		 * Checkbox initial selection
		 */
		this.$selectedTags.each(function() {
			var $this = $(this),
				$input = $this.find('input')
			self.$element.find('.tagsinput-tags input['+options.valueAttr+'="'+$input.val()+'"]').prop('checked', true)
		})
		this.updateStatus()

		this.$element.find('.tagsinput-tags input').on('click.bs.tagsinput.data-api', {self: this}, OnCheckboxClick)
		this.$element.find('.tagsinput-selected-tags .input-tag a').on('click.bs.tagsinput.data-api', {self: this}, OnTagRemoveClick)
		this.$element.find('.tagsinput-search input').on('keyup.bs.tagsinput.data-api', {self: this}, OnSearchKeyup)
		this.$element.find('.tagsinput-search input').on('keydown.bs.tagsinput.data-api', {self: this}, OnSearchKeydown)
		this.$element.find('.tagsinput-addnew').on('click.bs.tagsinput.data-api', {self: this}, OnAddClick)
	}

	TagsInput.VERSION  = '1.0.0'

	TagsInput.DEFAULTS = {
		valueAttr: 'value',
		labelAttr: false,
		name: 'tags',
		iconRemoveClass: 'glyphicon glyphicon-remove-sign'
	}

	/**
	 * Checkbox handling
	 */
	var OnCheckboxClick = function(e) {
		var $this = $(this),
			label = '',
			id, self = e.data.self

		if (this.checked) {
			if (self.options.labelAttr) {
				label = $this.attr(self.options.labelAttr)
			} else {
				if (id = $this.attr('id')) {
					label = $('label[for="'+id+'"]').text()
				} else {
					label = $this.parent().text()
				}
			}
			AddToSelectedTags(self, $this.attr(self.options.valueAttr), label)
		} else {
			self.$element.find('.tagsinput-selected-tags .input-tag:has(input[value="'+$this.attr(self.options.valueAttr)+'"])').detach()
		}

		self.updateStatus()
	}
	var AddToSelectedTags = function(self, value, label) {
		var $el

		$el = $('<div class="input-tag">'+label+'&nbsp;<a href="#" class="'+self.options.iconRemoveClass+'"></a><input type="hidden" name="'+self.options.name+'[]" value="'+value+'"></div>')
		$el.find('a').on('click.bs.tagsinput.data-api', {self: self}, OnTagRemoveClick)
		self.$selectedList.append($el)
	}

	/**
	 * Tags handling
	 */
	var OnTagRemoveClick = function (e) {
		var $this = $(this),
			$input = $this.parent().find('input'),
			self = e.data.self

		self.$element.find('.tagsinput-tags input['+self.options.valueAttr+'="'+$input.val()+'"]').prop('checked', false)
		$this.parent().detach()

		self.updateStatus()

		e.preventDefault()
		e.stopPropagation()
	}

	/**
	 * Search filter
	 */
	var OnSearchKeyup = function (e) {
		var value = $(this).val().trim(),
			self = e.data.self,
			$labels = self.$element.find('.tagsinput-tags label')

		if (value == '') {
			$labels.css({width: '', height: '', padding: '', margin: '', overflow: ''})
			return
		}

		$labels.css({width: 0, height: 0, padding: 0, margin: 0, overflow: 'hidden'}).addClass('tagsinput-filtered')
		$labels.filter(function() {
			var exp = '('+value.replace(new RegExp('([\\.\\^\\$\\+\\?\\(\\)\\{\\}\\|\\\\])'), '\\$1').toString().replace(/\s+/, '|')+')'
			var re = new RegExp(exp, 'gi')
			var str = $(this).text()
			var m, matches = []

			while ((m = re.exec(str)) !== null) {
				if (m.index === re.lastIndex) {
					re.lastIndex++
				}
				matches.push(m)
			}
			return matches.length > 0
		}).css({width: '', height: '', padding: '', margin: '', overflow: ''}).removeClass('tagsinput-filtered')
	}

	/**
	 * [Enter] handler
	 */
	var OnSearchKeydown = function (e) {
		var self = e.data.self

		if (e.keyCode == 13 && self.$element.find('.tagsinput-search input').val().trim() != '') {
			var $labels = self.$element.find('.tagsinput-tags label'),
				$filtered = self.$element.find('.tagsinput-tags label.tagsinput-filtered'),
				$selected,
				updateStatus = true

			// single result means add to list
			if ($labels.length - $filtered.length == 1) {
				$selected = self.$element.find('.tagsinput-tags label:not(.tagsinput-filtered)')
				if (!$selected.find('input').prop('checked')) {
					$selected.find('input').trigger('click.bs.tagsinput.data-api')
				}
			} else {
				// multi or zero result means add new tag, which would be done by custom listener only.
				updateStatus = AddNew(self)
			}

			if (updateStatus) {
				self.updateStatus()
				self.clearSearch()
			}

			e.preventDefault()
			e.stopPropagation()
		}
	}

	var OnAddClick = function(e) {
		var self = e.data.self,
			updateStatus

		if (self.$element.find('.tagsinput-search input').val().trim() != '') {
			updateStatus = AddNew(self)

			if (updateStatus) {
				self.updateStatus()
				self.clearSearch()
			}
		}

		e.preventDefault()
		e.stopPropagation()
	}

	var AddNew = function(self) {
		var ev = $.Event('addnew.bs.tagsinput.data-api'),
			result = true

		self.$element.trigger(ev, [self]);

		if (ev.result === true) return false; // means listener will maintain status handling
		if (typeof ev.result !== 'undefined') {
			result = false
			var title = ''
			if ($.type(ev.result) == 'string') title = ev.result
			self.updateError(title);
		}

		return result
	}

	TagsInput.prototype.updateStatus = function() {
		this.$selectedTags = this.$element.find('.tagsinput-selected-tags .input-tag')
		this.$status.text(this.$selectedTags.length > 0? this.$selectedTags.length+' selected' : 'No tags selected')
	}

	TagsInput.prototype.updateError = function(reason) {
		this.$status.html('<span class="text-danger" title="'+reason+'">Error occured!</span>')
	}

	TagsInput.prototype.clearSearch = function() {
		this.$element.find('.tagsinput-search input').val('')
		this.$element.find('.tagsinput-tags label')
			.css({width: '', height: '', padding: '', margin: '', overflow: ''})
			.removeClass('tagsinput-filtered')
		;
	}

	TagsInput.prototype.addTag = function(value, label, attrs) {
		attrs = attrs || false
		label = label || value
		var attrList = ''
		if (attrs !== false) attrList = ' ' + $.map(attrs, function(v, k) { return k+'="'+v+'"'; }).join(' ')
		var $label = $('<label><input type="checkbox" value="'+value+'"'+attrList+' checked>'+label+'</label>')

		AddToSelectedTags(this, value, label);
		this.$element.find('.tagsinput-tags').append($label)
		$label.find('input').on('click.bs.tagsinput.data-api', {self: this}, OnCheckboxClick)

		this.updateStatus()
	}

	// TAGS INPUT PLUGIN DEFINITION
	// ==========================

	function Plugin(option) {
		return this.each(function () {
			var $this   = $(this)
			var data    = $this.data('bs.tagsinput')
			var options = $.extend({}, TagsInput.DEFAULTS, $this.data(), typeof option == 'object' && option)

			if (!data) $this.data('bs.tagsinput', (data = new TagsInput(this, options)))
			if (typeof option == 'string') data[option]()
		})
	}

	var old = $.fn.tagsinput

	$.fn.tagsinput             = Plugin
	$.fn.tagsinput.Constructor = TagsInput


	// TAGS INPUT NO CONFLICT
	// ====================

	$.fn.tagsinput.noConflict = function () {
		$.fn.tagsinput = old
		return this
	}


	// TAGS INPUT DATA-API
	// =================

	$(window).on('load.bs.tagsinput.data-api', function (e) {
		$('[data-toggle="tagsinput"]').each(function () {
			var $plugin = $(this)
			Plugin.call($plugin, $plugin.data())
		})
	})

}(jQuery);
