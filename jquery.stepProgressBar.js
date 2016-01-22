/*--------------------------------------------------------------------
 *JAVASCRIPT "jquery.stepProgressBar.js"
 *Version:    0.1.0 - 2016
 *author:     Mickaël Roy
 *website:    http://www.mickaelroy.com
 *Licensed MIT 
-----------------------------------------------------------------------*/

(function ($){
 
    var pluginName = 'stepProgressBar';
 
    /**
     * The plugin constructor
     * @param {DOM Element} element The DOM element where plugin is applied
     * @param {Object} options Options passed to the constructor
     */
    function StepProgressBar(element, options) {
        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference  to the source element
        this.$el = $(element);

        // Set a random (and normally unique) id for the object
        this.instanceId = Math.round(new Date().getTime() + (Math.random() * 100));

        // Set the instance options extending the plugin defaults and
        // the options passed by the user
        this.settings = $.extend({}, $.fn[pluginName].defaults, options);
            
        // Initialize the plugin instance
        this.init();
    }
    
    /**
     * Set up your Plugin protptype with desired methods.
     * It is a good practice to implement 'init' and 'destroy' methods.
     */
    StepProgressBar.prototype = {
        
        /**
         * Initialize the plugin instance.
         * Set any other attribtes, store any other element reference, register 
         * listeners, etc
         *
         * When bind listerners remember to name tag it with your plugin's name.
         * Elements can have more than one listener attached to the same event
         * so you need to tag it to unbind the appropriate listener on destroy:
         * 
         * @example
         * this.$someSubElement.on('click.' + pluginName, function() {
         *      // Do something
         * });
         *         
         */
        init: function() {
            this.$el.addClass('step-progressbar-container');
            if(this.settings.rounded)
                this.$el.addClass('step-progressbar-rounded');

            this.topLabelContainer = $('<div>');
            this.topLabelContainer.addClass('step-progressbar-toplabel');
            this.$el.append(this.topLabelContainer);

            this.barContainer = $('<div>');
            this.barContainer.addClass('step-progressbar-bar-wrapper');
            this.$el.append(this.barContainer);
            this.barElm = $('<span>');
            this.barElm.addClass('step-progressbar-bar');
            this.barContainer.append(this.barElm);
            this.progressElm = $('<span>');
            this.progressElm.addClass('step-progressbar-progress');
            this.barElm.append(this.progressElm);

            this.bottomLabelContainer = $('<div>');
            this.bottomLabelContainer.addClass('step-progressbar-bottomlabel');
            this.$el.append(this.bottomLabelContainer);

            this._updateProgress();
        },

        /**
         * The 'destroy' method is were you free the resources used by your plugin:
         * references, unregister listeners, etc.
         *
         * Remember to unbind for your event:
         *
         * @example
         * this.$someSubElement.off('.' + pluginName);
         *
         * Above example will remove any listener from your plugin for on the given
         * element.
         */
        destroy: function() {
            // Remove any attached data from your plugin
        },

        // To call a real private method from those public methods, you need to use 'call' or 'apply': 
        //privateMethod.call(this);

        /**
         * getCurrentValue method
         *
         * @example
         * $('#element').pluginName('getCurrentValue');
         */
        getCurrentValue: function() {
            return this.settings.currentValue;
        },

        /**
         * setCurrentValue method
         *
         * @example
         * $('#element').pluginName('setCurrentValue', value);
         * 
         * @param  {number} value [the value to set for selector]
         */
        setCurrentValue: function(value) {
            this.settings.currentValue = value;
            this._updateProgress();
        },

        // To call a call a pseudo private method: 
        //this._pseudoPrivateMethod();

        /**
         * You can use the name convention functions started with underscore are
         * private. Really calls to functions starting with underscore are 
         * filtered, for example:
         * 
         *  @example
         *  $('#element').jqueryPlugin('_pseudoPrivateMethod');  // Will not work
         */

        //
        _calcProgressValue: function() {
            if(isNullOrUndefined(this.settings.currentValue))
                this.progressValue = 0;
            else if(isNullOrUndefined(this.settings.steps) || (this.settings.steps && this.settings.steps.length <= 0)) {
                this.progressValue = 100;
            } else {
                var minAndMax = this._retreiveMinAndMaxSteps();
                var minStep = minAndMax.minValue;
                var maxStep = minAndMax.maxValue;
                // set progressValue depending on min & max step values
                if(isNullOrUndefined(minStep) && isNullOrUndefined(maxStep))
                    this.progressValue = 100;
                else if(isNullOrUndefined(minStep) && !isNullOrUndefined(maxStep)) {
                    if(this.settings.currentValue < maxStep)
                        this.progressValue = 0;
                    else
                        this.progressValue = 100;
                } else if(isNullOrUndefined(maxStep) && !isNullOrUndefined(minStep)) {
                    if(this.settings.currentValue < minStep)
                        this.progressValue = 0;
                    else
                        this.progressValue = 100;
                } else if(!isNullOrUndefined(minStep) && !isNullOrUndefined(maxStep)) {
                    if(this.settings.currentValue < minStep)
                        this.progressValue = 0;
                    else if(this.settings.currentValue > maxStep)
                        this.progressValue = 100;
                    else
                       this.progressValue = (this.settings.currentValue - minStep) / (maxStep - minStep) * 100;
                }
            }
            return this.progressValue;
        },

        //
        _retreiveMinAndMaxSteps: function() {
            if(isNullOrUndefined(this.settings.steps) || (this.settings.steps && this.settings.steps.length <= 0)) {
                return;
            } else {
                var minValue, maxValue, minStep, maxStep;
                for(var i = 0; i < this.settings.steps.length; i++) {
                    if(isNullOrUndefined(minStep)) {
                        minValue = this.settings.steps[i].value;
                        minStep = this.settings.steps[i];
                    }
                    if(isNullOrUndefined(maxStep)) {
                        maxValue = this.settings.steps[i].value;
                        maxStep = this.settings.steps[i];
                    }
                    if(this.settings.steps[i].value < minValue) {
                        minValue = this.settings.steps[i].value;
                        minStep = this.settings.steps[i];
                    }
                    if(this.settings.steps[i].value > maxValue) {
                        maxValue = this.settings.steps[i].value;
                        maxStep = this.settings.steps[i];
                    }
                }
                return {minValue: minValue, minStep: minStep, maxValue: maxValue, maxStep: maxStep};
            }
        },

        //
        _updateProgress: function() {
            if(this.progressElm)
                this.progressElm.css('width', this._calcProgressValue() + '%');
        }
    };

    /**
     * These are real private methods. A plugin instance has access to them
     * @return {[type]}
     */

    //
    var isNullOrUndefined = function(variable) {
        return (variable === null || variable === undefined);
    };
    
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new StepProgressBar(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length === 0 && $.inArray(options, $.fn[pluginName].getters) !== -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof StepProgressBar && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };
    
    /**
     * Names of the pluguin methods that can act as a getter method.
     * @type {Array}
     */
    $.fn[pluginName].getters = ['getCurrentValue', 'setCurrentValue'];

    /**
     * Default options
     */
    $.fn[pluginName].defaults = {
        currentValue    : 0, /* current progress value (does not have to be in percent) */
        steps           : [], /* all progression steps */
        rounded         : true, /* to switch between classic/rounded bar */
        unit            : '', /* values unit */
        progressLabel   : function(currentValue, maxValue, minValue, percentValue) {
            return (percentValue + '%');
        }, /* in order to customize label that will be displayed on progress bar. */
        progressFill    : undefined /* if we want to fill progress bar with animated gradient for ex. */
    };
 
}(jQuery));
