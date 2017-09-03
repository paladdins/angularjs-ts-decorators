(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('angular'), require('tslib'), require('reflect-metadata')) :
	typeof define === 'function' && define.amd ? define(['exports', 'angular', 'tslib', 'reflect-metadata'], factory) :
	(factory((global['angular-ts-decorators'] = global['angular-ts-decorators'] || {}),global.angular,global.tslib));
}(this, (function (exports,angular,tslib_1) { 'use strict';

var platformBrowserDynamic = function () { return PlatformRef; };
var PlatformRef = {
    bootstrapModule: function (moduleType, compilerOptions) {
        var strictDi = true;
        if (compilerOptions)
            strictDi = compilerOptions.strictDi;
        angular.element(document).ready(function () {
            angular.bootstrap(document, [moduleType.module.name], { strictDi: strictDi });
        });
    }
};

/** @internal */
var Declarations;
(function (Declarations) {
    Declarations[Declarations["component"] = 0] = "component";
    Declarations[Declarations["directive"] = 1] = "directive";
    Declarations[Declarations["pipe"] = 2] = "pipe";
})(Declarations || (Declarations = {}));
/** @internal */
var metadataKeys = {
    declaration: 'custom:declaration',
    name: 'custom:name',
    bindings: 'custom:bindings',
    options: 'custom:options',
    listeners: 'custom:listeners',
};
/** @internal */
function annotate(func) {
    return angular.injector().annotate(func);
}
/** @internal */
function kebabToCamel(input) {
    return input.replace(/(-\w)/g, function (m) { return m[1].toUpperCase(); });
}
/** @internal */
function getAttributeName(selector) {
    return selector.substr(1, selector.length - 2);
}
/** @internal */
function isAttributeSelector(selector) {
    return /^[\[].*[\]]$/g.test(selector);
}
/** @internal */
function getMetadata(metadataKey, target) {
    return Reflect.getMetadata(metadataKey, target);
}
/** @internal */
function defineMetadata(metadataKey, metadataValue, target) {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
}

/**
 * @internal
 * @desc Mapping between angular and angularjs LifecycleHooks
 */
var ngLifecycleHooksMap = {
    ngOnInit: '$onInit',
    ngOnDestroy: '$onDestroy',
    ngDoCheck: '$doCheck',
    ngOnChanges: '$onChanges',
    ngAfterViewInit: '$postLink'
};
/**
 * Represents a basic change from a previous to a new value.
 * @stable
 */
var SimpleChange = (function () {
    function SimpleChange(previousValue, currentValue, firstChange) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
        this.firstChange = firstChange;
    }
    /**
     * Check whether the new value is the first value assigned.
     */
    SimpleChange.prototype.isFirstChange = function () { return this.firstChange; };
    return SimpleChange;
}());

function Component(_a) {
    var selector = _a.selector, options = tslib_1.__rest(_a, ["selector"]);
    return function (ctrl) {
        options.controller = ctrl;
        var isAttrSelector = isAttributeSelector(selector);
        var bindings = getMetadata(metadataKeys.bindings, ctrl);
        if (bindings) {
            if (isAttrSelector) {
                options['bindToController'] = bindings;
                options['controllerAs'] = options['controllerAs'] || '$ctrl';
            }
            else
                options['bindings'] = bindings;
        }
        if (isAttrSelector) {
            options.restrict = 'A';
        }
        replaceLifecycleHooks(ctrl);
        var selectorName = isAttrSelector ? getAttributeName(selector) : selector;
        defineMetadata(metadataKeys.name, kebabToCamel(selectorName), ctrl);
        defineMetadata(metadataKeys.declaration, isAttrSelector ? Declarations.directive : Declarations.component, ctrl);
        defineMetadata(metadataKeys.options, options, ctrl);
    };
}
/** @internal */
function registerComponent(module, component) {
    var name = getMetadata(metadataKeys.name, component);
    var options = getMetadata(metadataKeys.options, component);
    var listeners = getMetadata(metadataKeys.listeners, options.controller);
    if (listeners) {
        options.controller = extendWithHostListeners(options.controller, listeners);
    }
    component.$inject = component.$inject || annotate(component);
    module.component(name, options);
}
/** @internal */
function extendWithHostListeners(ctrl, listeners) {
    var handlers = Object.keys(listeners);
    var NewCtrl = (function (_super) {
        tslib_1.__extends(NewCtrl, _super);
        function NewCtrl($element) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this.$element = $element;
            return _this;
        }
        NewCtrl.prototype.$postLink = function () {
            var _this = this;
            if (_super.prototype.$postLink) {
                _super.prototype.$postLink.call(this);
            }
            handlers.forEach(function (handler) {
                var eventName = listeners[handler].eventName;
                _this.$element.on(eventName, _this[handler].bind(_this));
            });
        };
        NewCtrl.prototype.$onDestroy = function () {
            var _this = this;
            if (_super.prototype.$onDestroy) {
                _super.prototype.$onDestroy.call(this);
            }
            handlers.forEach(function (handler) {
                var eventName = listeners[handler].eventName;
                _this.$element.off(eventName, _this[handler]);
            });
        };
        return NewCtrl;
    }(ctrl));
    NewCtrl.$inject = ['$element'].concat(ctrl.$inject || []);
    return NewCtrl;
}
/** @internal */
function replaceLifecycleHooks(ctrl) {
    var ctrlClass = ctrl.prototype;
    var ngHooksFound = getHooksOnCtrlClass(ctrlClass);
    ngHooksFound.forEach(function (ngHook) {
        var angularJsHook = ngLifecycleHooksMap[ngHook];
        ctrlClass[angularJsHook] = ctrlClass[ngHook];
        delete ctrlClass[ngHook];
    });
}
/** @internal */
function getHooksOnCtrlClass(ctrlClass) {
    return Object.keys(ngLifecycleHooksMap)
        .filter(function (hook) { return angular.isFunction(ctrlClass[hook]); });
}

function Directive(_a) {
    var selector = _a.selector, options = tslib_1.__rest(_a, ["selector"]);
    return function (ctrl) {
        var bindings = getMetadata(metadataKeys.bindings, ctrl);
        if (bindings) {
            options.bindToController = bindings;
        }
        options.restrict = options.restrict || 'A';
        if (options.restrict !== 'A') {
            console.warn("Consider removing restrict option from " + selector + " directive and using it only as\n       attribute directive.");
        }
        if (options.link || options.compile) {
            console.warn("Consider refactoring " + selector + " directive using controller class.");
        }
        var selectorName = isAttributeSelector(selector) ? getAttributeName(selector) : selector;
        defineMetadata(metadataKeys.name, kebabToCamel(selectorName), ctrl);
        defineMetadata(metadataKeys.declaration, Declarations.directive, ctrl);
        defineMetadata(metadataKeys.options, options, ctrl);
    };
}
/** @internal */
function registerDirective(module, ctrl) {
    var directiveFunc;
    var name = getMetadata(metadataKeys.name, ctrl);
    var options = getMetadata(metadataKeys.options, ctrl);
    var _a = ctrl.prototype, compile = _a.compile, link = _a.link;
    var legacy = compile && typeof compile === 'function' || link && typeof link === 'function';
    if (legacy) {
        directiveFunc = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var injector$$1 = args[0]; // reference to $injector
            var instance = injector$$1.instantiate(ctrl);
            if (compile) {
                options.compile = compile.bind(instance);
            }
            else if (link) {
                options.link = link.bind(instance);
            }
            return options;
        };
        directiveFunc.$inject = ['$injector'].concat((ctrl.$inject || annotate(ctrl)));
    }
    else {
        ctrl.$inject = ctrl.$inject || annotate(ctrl);
        replaceLifecycleHooks(ctrl);
        var listeners = getMetadata(metadataKeys.listeners, ctrl);
        options.controller = listeners ? extendWithHostListeners$1(ctrl, listeners) : ctrl;
        directiveFunc = function () { return options; };
    }
    module.directive(name, directiveFunc);
}
/** @internal */
function extendWithHostListeners$1(ctrl, listeners) {
    var handlers = Object.keys(listeners);
    var NewCtrl = (function (_super) {
        tslib_1.__extends(NewCtrl, _super);
        function NewCtrl($element) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this.$element = $element;
            return _this;
        }
        NewCtrl.prototype.$postLink = function () {
            var _this = this;
            if (_super.prototype.$postLink) {
                _super.prototype.$postLink.call(this);
            }
            handlers.forEach(function (handler) {
                var eventName = listeners[handler].eventName;
                _this.$element.on(eventName, _this[handler].bind(_this));
            });
        };
        NewCtrl.prototype.$onDestroy = function () {
            var _this = this;
            if (_super.prototype.$onDestroy) {
                _super.prototype.$onDestroy.call(this);
            }
            handlers.forEach(function (handler) {
                var eventName = listeners[handler].eventName;
                _this.$element.off(eventName, _this[handler]);
            });
        };
        return NewCtrl;
    }(ctrl));
    NewCtrl.$inject = ['$element'].concat(ctrl.$inject || []);
    return NewCtrl;
}

function Injectable(name) {
    return function (Class) {
        if (!name) {
            console.warn('You are not providing explicit service name, ' +
                'be careful this code might not work as expected when uglified with mangling enabled.');
            name = Class.name;
        }
        defineMetadata(metadataKeys.name, name, Class);
    };
}
/** @internal */
function registerProviders(module, providers) {
    providers.forEach(function (provider) {
        // providers registered using { provide, useClass/useFactory/useValue } syntax
        if (provider.provide) {
            var name_1 = provider.provide;
            if (provider.useClass && provider.useClass instanceof Function) {
                provider.useClass.$inject = provider.useClass.$inject || annotate(provider.useClass);
                if (provider.useClass.prototype.$get) {
                    module.provider(name_1, provider.useClass);
                }
                else {
                    module.service(name_1, provider.useClass);
                }
            }
            else if (provider.useFactory && provider.useFactory instanceof Function) {
                provider.useFactory.$inject = provider.useFactory.$inject || annotate(provider.useFactory);
                module.factory(name_1, provider.useFactory);
            }
            else if (provider.useValue) {
                module.constant(name_1, provider.useValue);
            }
        }
        else {
            var name_2 = getMetadata(metadataKeys.name, provider);
            provider.$inject = provider.$inject || annotate(provider);
            if (provider.prototype.$get) {
                module.provider(name_2, provider);
            }
            else {
                module.service(name_2, provider);
            }
        }
    });
}

function Pipe(options) {
    return function (Class) {
        defineMetadata(metadataKeys.name, options.name, Class);
        defineMetadata(metadataKeys.declaration, Declarations.pipe, Class);
    };
}
/** @internal */
function registerPipe(module, filter) {
    var name = getMetadata(metadataKeys.name, filter);
    var filterFactory = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var injector$$1 = args[0]; // reference to $injector
        var instance = injector$$1.instantiate(filter);
        return instance.transform.bind(instance);
    };
    filterFactory.$inject = ['$injector'].concat((filter.$inject || annotate(filter)));
    module.filter(name, filterFactory);
}

function Input(alias) {
    return function (target, key) { return addBindingToMetadata(target, key, '<', alias); };
}
function Output(alias) {
    return function (target, key) { return addBindingToMetadata(target, key, '&', alias); };
}
/** @internal */
function addBindingToMetadata(target, key, direction, alias) {
    var targetConstructor = target.constructor;
    var bindings = getMetadata(metadataKeys.bindings, targetConstructor) || {};
    bindings[key] = alias || direction;
    defineMetadata(metadataKeys.bindings, bindings, targetConstructor);
}

function NgModule(_a) {
    var id = _a.id, name = _a.name, _b = _a.declarations, declarations = _b === void 0 ? [] : _b, _c = _a.imports, imports = _c === void 0 ? [] : _c, _d = _a.providers, providers = _d === void 0 ? [] : _d;
    return function (Class) {
        // module registration
        var deps = imports.map(function (mod) { return typeof mod === 'string' ? mod : mod.module.name; });
        if (name) {
            console.warn('"name" property in @NgModule is deprecated, please use "id" to align to angular 2+ syntax.');
            id = name;
        }
        if (!id) {
            console.warn('You are not providing ngModule id, be careful this code won\'t work when uglified.');
            id = Class.name;
        }
        var module = angular.module(id, deps);
        // components, directives and filters registration
        declarations.forEach(function (declaration) {
            var declarationType = getMetadata(metadataKeys.declaration, declaration);
            switch (declarationType) {
                case Declarations.component:
                    registerComponent(module, declaration);
                    break;
                case Declarations.directive:
                    registerDirective(module, declaration);
                    break;
                case Declarations.pipe:
                    registerPipe(module, declaration);
                    break;
                default:
                    console.error("Can't find type metadata on " + declaration.name + " declaration, did you forget to decorate it?\n            Decorate your declarations using @Component, @Directive or @Pipe decorator.");
            }
        });
        // services registration
        if (providers) {
            registerProviders(module, providers);
        }
        // config and run blocks registration
        var config = Class.config, run = Class.run;
        if (config) {
            config.$inject = annotate(config);
            module.config(config);
        }
        if (run) {
            run.$inject = annotate(run);
            module.run(run);
        }
        // expose angular module as static property
        Class.module = module;
    };
}

function HostListener(eventName, args) {
    return function (target, propertyKey, descriptor) {
        var listener = descriptor.value;
        if (typeof listener !== 'function') {
            throw new Error("@HostListener decorator can only be applied to methods not: " + typeof listener);
        }
        var targetConstructor = target.constructor;
        /**
         * listeners = { onMouseEnter: { eventName: 'mouseenter mouseover', args: [] } }
         */
        var listeners = getMetadata(metadataKeys.listeners, targetConstructor) || {};
        listeners[propertyKey] = { eventName: eventName, args: args };
        defineMetadata(metadataKeys.listeners, listeners, targetConstructor);
    };
}

exports.platformBrowserDynamic = platformBrowserDynamic;
exports.Component = Component;
exports.Directive = Directive;
exports.Injectable = Injectable;
exports.Pipe = Pipe;
exports.Input = Input;
exports.Output = Output;
exports.NgModule = NgModule;
exports.NgModuleDecorated = NgModule;
exports.HostListener = HostListener;
exports.ngLifecycleHooksMap = ngLifecycleHooksMap;
exports.SimpleChange = SimpleChange;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-ts-decorators.umd.js.map
