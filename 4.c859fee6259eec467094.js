(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"0Pt3":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("D57K"),n=r("LoAr"),i=r("IfiR"),s=(r("g8ML"),r("HT5j"),r("JgFM")),a=r("7Ecr"),l=(r("jcUA"),function(){return function(t,e,r,o){this.talent=t,this.type=e,this.value=r,this.costs=o}}());e.IncreaseTalentEvent=l,e.TalentsComponent=function(t){function e(e,r,o,s){var a=t.call(this)||this;return a.dialog=e,a.presets=r,a.cdr=o,a.raiseService=s,a.max=1/0,a.budget=1/0,a.increase=new n.EventEmitter,a.meleeForm=new i.FormArray([]),a.rangeForm=new i.FormArray([]),a.physicalForm=new i.FormArray([]),a.mentalForm=new i.FormArray([]),a.socialForm=new i.FormArray([]),a.giftsForm=new i.FormArray([]),a.form=new i.FormGroup({melee:a.meleeForm,range:a.rangeForm,physical:a.physicalForm,mental:a.mentalForm,social:a.socialForm,gifts:a.giftsForm}),a.mins={melee:[],range:[],physical:[],mental:[],social:[],gifts:[]},a}return o.__extends(e,t),Object.defineProperty(e.prototype,"preset",{set:function(t){this.talents=this.presets.getTalentsForPreset(t),console.log(this.talents)},enumerable:!0,configurable:!0}),e.prototype.writeValue=function(t){this.unregisterSubscriptions();for(var e=0,r=["melee","range","physical","mental","social","gifts"];e<r.length;e++){for(var o=r[e],n=this.form.get(o);n.length;)n.removeAt(0);if(t){this.mins[o]=t[o].map(function(t){return t.value});for(var i=0,s=t[o];i<s.length;i++){var a=s[i];a.name&&this.addTalent(a,o)}}}this.registerSubscription(),this.cdr.markForCheck()},e.prototype.addTalent=function(t,e){this.form.get(e).push(new i.FormGroup({attributes:new i.FormArray([new i.FormControl(t.attributes[0],i.Validators.required),new i.FormControl(t.attributes[1],i.Validators.required)]),gift:new i.FormControl(t.gift),name:new i.FormControl(t.name,i.Validators.required),value:new i.FormControl(t.value||1,i.Validators.required),level:new i.FormControl(t.level,i.Validators.required)}))},e.prototype.openAddDialog=function(){return o.__awaiter(this,void 0,void 0,function(){var t,e,r;return o.__generator(this,function(n){switch(n.label){case 0:return t=this.form.value,e=new Set(t.melee.concat(t.range,t.physical,t.mental,t.social,t.gifts).map(function(t){return t.name})),[4,this.dialog.open(a.AddDialogComponent,{data:{talents:this.talents.filter(function(t){return!e.has(t.name)}),gifts:this.gifts,budget:this.budget}}).afterClosed().toPromise()];case 1:return(r=n.sent())&&(this.addTalent(r,r.category),this.increase.emit(new l(o.__assign({},r),r.category,1,this.getCostsForNext(o.__assign({},r,{value:0})))),this.mins[r.category].push(0),this.cdr.markForCheck()),[2]}})})},e.prototype.add=function(t,e){var r=this.form.get([t,e]);this.increase.emit(new l(o.__assign({},r.value,{value:r.value.value+1}),t,r.value.value+1,this.getCostsForNext(r.value))),r.patchValue({value:r.value.value+1})},e.prototype.remove=function(t,e){var r=this.form.get([t,e,"value"]);r.setValue(r.value-1)},e.prototype.delete=function(t,e){this.form.get(t).removeAt(e),this.mins[t].splice(e,1)},e.prototype.getCostsForNext=function(t){return this.raiseService.getRaiseCosts(t.value+1,t.level)},e}(s.AbstractComponent)},"5TVr":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("LoAr");e.ArmorService=function(){function t(){}return t.prototype.aggregateArmor=function(t){return t.reduce(function(t,e){return t.head+=e.head,t.chest+=e.chest,t.back+=e.back,t.leftArm+=e.leftArm,t.rightArm+=e.rightArm,t.leftLeg+=e.leftLeg,t.rightLeg+=e.rightLeg,t},{head:0,chest:0,back:0,leftArm:0,rightArm:0,leftLeg:0,rightLeg:0})},t.prototype.getTotalArmor=function(t,e){var r=(void 0===e?{}:e).precise,o=2*t.head+5*t.chest+5*t.back+4*t.leftArm+4*t.rightArm+4*t.leftLeg+4*t.rightLeg;return void 0!==r&&r?o/28:Math.round(o/28)},t.ngInjectableDef=o.defineInjectable({factory:function(){return new t},token:t,providedIn:"root"}),t}()},"6glK":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SheetModule=function(){return function(){}}()},"7Ecr":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("D57K"),n=r("IfiR"),i=(r("g8ML"),r("HT5j"),r("YfSF"));r("jcUA"),e.AddDialogComponent=function(){function t(t,e,r){var o=this;this.ref=e,this.raiseService=r,this.filter=new n.FormControl(null),this.isList=this.filter.valueChanges.pipe(i.startWith(""),i.map(function(t){return!t||"custom"!==t.type})),this.isCustomSkillTalent=this.filter.valueChanges.pipe(i.startWith(""),i.map(function(t){return t&&"custom"===t.type&&t.category})),this.isCustomGiftTalent=this.filter.valueChanges.pipe(i.startWith(""),i.map(function(t){return t&&"custom"===t.type&&t.gift})),this.customTalentControl=new n.FormGroup({name:new n.FormControl(null,n.Validators.required),attribute1:new n.FormControl(null,n.Validators.required),attribute2:new n.FormControl(null,n.Validators.required),attribute3:new n.FormControl(null,n.Validators.required),level:new n.FormControl(null,[n.Validators.required,function(t){var e=t.value;return null!=e&&o.getCosts(e)>o.budget?{overbudget:!0}:null}])}),this.customGiftTalentControl=new n.FormGroup({name:new n.FormControl(null,n.Validators.required),attribute1:new n.FormControl(null,n.Validators.required),attribute2:new n.FormControl(null,n.Validators.required),level:new n.FormControl(null,[n.Validators.required,function(t){var e=t.value;return null!=e&&o.getCosts(e)>o.budget?{overbudget:!0}:null}])}),this.filteredTalents=this.filter.valueChanges.pipe(i.startWith(this.filter.value),i.map(function(t){return console.log({value:t,talents:o.talents}),t?o.talents.filter("gift"===t.type?function(e){return e.gift===t.gift}:function(e){return e.category===t.category}):o.talents})),this.talents=t.talents,this.talents.sort(function(t,e){return t.name.localeCompare(e.name)}),this.gifts=t.gifts,this.budget=t.budget}return t.prototype.getCosts=function(t){return this.raiseService.getRaiseCosts(1,t)},t.prototype.submit=function(t){var e=o.__assign({},t,{value:1});this.ref.close(e)},t.prototype.submitCustomSkillTalent=function(){var t=this.customTalentControl.value;this.ref.close({name:t.name,category:this.filter.value.category,attributes:[t.attribute1,t.attribute2,t.attribute3],level:t.level,value:1})},t.prototype.submitCustomGiftTalent=function(){var t=this.customGiftTalentControl.value;this.ref.close({name:t.name,category:"gifts",attributes:[this.filter.value.gift,t.attribute1,t.attribute2],level:t.level,value:1})},t}()},EZnn:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("D57K");o.__exportStar(r("6glK"),e),o.__exportStar(r("g0kr"),e),o.__exportStar(r("Un77"),e),o.__exportStar(r("xdSV"),e),o.__exportStar(r("0Pt3"),e),o.__exportStar(r("QOd8"),e),o.__exportStar(r("gFws"),e),o.__exportStar(r("UAzm"),e),o.__exportStar(r("bw3P"),e),o.__exportStar(r("jcUA"),e)},JgFM:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("LcNk"),n=r("YfSF");e.AbstractComponent=function(){function t(){this.mode="range",this.subscription=o.Subscription.EMPTY,this.pointsSubscription=o.Subscription.EMPTY,this.onChange=function(){}}return t.prototype.registerOnChange=function(t){this.onChange=t,this.unregisterSubscriptions(),this.registerSubscription()},t.prototype.registerOnTouched=function(t){},t.prototype.setDisabledState=function(t){t?this.form.disable():this.form.enable()},t.prototype.unregisterSubscriptions=function(){this.subscription.unsubscribe(),this.pointsSubscription.unsubscribe()},t.prototype.transformValue=function(t){return t},t.prototype.registerSubscription=function(){var t=this;this.subscription=o.combineLatest(this.form.statusChanges,this.form.valueChanges).pipe(n.delay(10)).subscribe(function(e){t.onChange("VALID"===e[0]?t.transformValue(e[1]):null)})},t}()},QOd8:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.FACTOR_ATTRIBUTES=4,e.FACTOR_SKILLS=4,e.FACTOR_ADVANTAGES=1,e.FACTOR_TALENTS=1},Un77:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("D57K"),n=r("LoAr"),i=r("IfiR"),s=r("JgFM"),a=(r("jcUA"),function(){return function(t,e,r){this.attribute=t,this.value=e,this.costs=r}}());e.IncreaseAttributeEvent=a,e.AttributesComponent=function(t){function e(e,r){var o=t.call(this)||this;return o.raiseService=e,o.cdr=r,o.max=1/0,o.budget=1/0,o.increase=new n.EventEmitter,o.form=new i.FormGroup({strength:new i.FormControl(null,i.Validators.required),agility:new i.FormControl(null,i.Validators.required),dexterity:new i.FormControl(null,i.Validators.required),constitution:new i.FormControl(null,i.Validators.required),courage:new i.FormControl(null,i.Validators.required),intelligence:new i.FormControl(null,i.Validators.required),intuition:new i.FormControl(null,i.Validators.required),charisma:new i.FormControl(null,i.Validators.required)}),o.mins={strength:0,agility:0,dexterity:0,constitution:0,courage:0,intelligence:0,intuition:0,charisma:0},o}return o.__extends(e,t),e.prototype.writeValue=function(t){this.unregisterSubscriptions(),t?(this.mins=t,this.form.setValue(t,{emitEvent:!1})):this.form.reset(void 0,{emitEvent:!1}),this.registerSubscription(),this.cdr.markForCheck()},e.prototype.add=function(t){var e=this.form.get(t);this.increase.emit(new a(t,e.value+1,this.getCostsForNext(t))),e.setValue(e.value+1)},e.prototype.remove=function(t){var e=this.form.get(t);e.setValue(e.value-1)},e.prototype.getCostsForNext=function(t){var e=this.form.get(t);return this.raiseService.getRaiseCosts(e.value+1,"F")},e}(s.AbstractComponent)},Vs4z:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),r("LoAr");var o=r("IfiR"),n=(r("jcUA"),r("YfSF"));e.AddDialogComponent=function(){function t(t,e){var r=this;this.raiseService=e,this.filter=new o.FormControl(""),this.isList=this.filter.valueChanges.pipe(n.startWith(""),n.map(function(t){return!t||"custom"!==t})),this.isCustom=this.filter.valueChanges.pipe(n.startWith(""),n.map(function(t){return t&&"custom"===t})),this.customGiftGroup=new o.FormGroup({name:new o.FormControl(null,o.Validators.required),level:new o.FormControl(null,[o.Validators.required,function(t){var e=t.value;return null!=e&&r.getActivationCost(e)>r.budget?{overbudget:{budget:r.budget}}:null}])}),this.budget=t.budget,this.gifts=t.gifts}return t.prototype.ngOnInit=function(){},t.prototype.getActivationCost=function(t){return this.raiseService.getActivationCost(t)},t}()},g0kr:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("IfiR");r("5TVr"),e.SheetComponent=function(){function t(t){var e=this;this.armorService=t,this.form=new o.FormGroup({_id:new o.FormControl((1e6*Math.random()|0).toString(36)),about:new o.FormGroup({name:new o.FormControl(null,o.Validators.required),race:new o.FormControl(null,o.Validators.required),culture:new o.FormControl(null,o.Validators.required),profession:new o.FormControl(null,o.Validators.required),description:new o.FormControl(null,o.Validators.required)}),attributes:new o.FormGroup({strength:new o.FormControl(null,o.Validators.required),agility:new o.FormControl(null,o.Validators.required),dexterity:new o.FormControl(null,o.Validators.required),constitution:new o.FormControl(null,o.Validators.required),courage:new o.FormControl(null,o.Validators.required),intelligence:new o.FormControl(null,o.Validators.required),intuition:new o.FormControl(null,o.Validators.required),charisma:new o.FormControl(null,o.Validators.required)}),skills:new o.FormGroup({melee:new o.FormControl(null,o.Validators.required),range:new o.FormControl(null,o.Validators.required),physical:new o.FormControl(null,o.Validators.required),mental:new o.FormControl(null,o.Validators.required),social:new o.FormControl(null,o.Validators.required)}),gifts:new o.FormArray(Array.from({length:4},function(){return e.createGiftFormControl()})),advantages:new o.FormControl,disadvantages:new o.FormControl,health:new o.FormControl,mana:new o.FormControl,talents:new o.FormGroup({melee:new o.FormArray(Array.from({length:8},function(){return e.createTalentFormControl()})),range:new o.FormArray(Array.from({length:8},function(){return e.createTalentFormControl()})),physical:new o.FormArray(Array.from({length:18},function(){return e.createTalentFormControl()})),mental:new o.FormArray(Array.from({length:18},function(){return e.createTalentFormControl()})),social:new o.FormArray(Array.from({length:10},function(){return e.createTalentFormControl()})),gifts:new o.FormArray(Array.from({length:10},function(){return e.createTalentFormControl()}))}),inventory:new o.FormControl,financials:new o.FormControl,equipment:new o.FormControl,melee:new o.FormArray(Array.from({length:8},function(){return e.createMeleeWeaponControl()})),range:new o.FormArray(Array.from({length:8},function(){return e.createRangeWeaponControl()})),meta:new o.FormGroup({preset:new o.FormControl,budget:new o.FormGroup({attributes:new o.FormControl,skills:new o.FormControl,talents:new o.FormControl}),exp:new o.FormGroup({spend:new o.FormControl,total:new o.FormControl})})}),this.giftsForm=this.form.get("gifts"),this.meleeForm=this.form.get("melee"),this.rangeForm=this.form.get("range"),this.talentsMeleeForm=this.form.get(["talents","melee"]),this.talentsRangeForm=this.form.get(["talents","range"]),this.talentsPhysicalForm=this.form.get(["talents","physical"]),this.talentsMentalForm=this.form.get(["talents","mental"]),this.talentsSocialForm=this.form.get(["talents","social"]),this.talentsGiftsForm=this.form.get(["talents","gifts"]),this.update=this.form.valueChanges}return Object.defineProperty(t.prototype,"armor",{get:function(){return this._character?this.armorService.aggregateArmor(this._character.armor):null},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"armorSummary",{get:function(){return this._character?this.armorService.getTotalArmor(this.armor):null},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"character",{get:function(){return this._character},set:function(t){console.log(t),t&&this.form.patchValue(t,{emitEvent:!1}),this._character=t},enumerable:!0,configurable:!0}),t.prototype.createGiftFormControl=function(){return new o.FormGroup({name:new o.FormControl,level:new o.FormControl,value:new o.FormControl})},t.prototype.createTalentFormControl=function(){return new o.FormGroup({skill:new o.FormControl,name:new o.FormControl,attributes:new o.FormControl([new o.FormControl,new o.FormControl]),gift:new o.FormControl,value:new o.FormControl,level:new o.FormControl})},t.prototype.createMeleeWeaponControl=function(){return new o.FormGroup({name:new o.FormControl,type:new o.FormControl,attribute:new o.FormControl,attackModificator:new o.FormControl,paradeModificator:new o.FormControl,damageModificator:new o.FormControl})},t.prototype.createRangeWeaponControl=function(){return new o.FormGroup({name:new o.FormControl,type:new o.FormControl,attribute:new o.FormControl,range:new o.FormControl,attackModificator:new o.FormControl,damageModificator:new o.FormControl})},t}()},jcUA:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("D57K"),n=r("LoAr"),i=r("LoAr");function s(){return new l(n.inject(e.LINEAR_OFFSETS),n.inject(e.LINEAR_MULTIPLIERS),n.inject(e.ACTIVATION_MULTIPLIER),n.inject(e.BASE))}e.MULTIPLIERS=new n.InjectionToken("MULTIPLIERS",{providedIn:"root",factory:function(){return{"A*":.75,A:1,B:1.5,C:2.25,D:3.25,E:4.5,F:9}}}),e.LINEAR_MULTIPLIERS=new n.InjectionToken("MULTIPLIERS",{providedIn:"root",factory:function(){return{"A*":.75,A:1,B:1.5,C:2.25,D:4,E:6,F:9}}}),e.OFFSETS=new n.InjectionToken("OFFSETS",{providedIn:"root",factory:function(){return{"A*":0,A:0,B:0,C:0,D:0,E:0,F:0}}}),e.LINEAR_OFFSETS=new n.InjectionToken("OFFSETS",{providedIn:"root",factory:function(){return{"A*":0,A:0,B:0,C:0,D:0,E:0,F:0}}}),e.ACTIVATION_MULTIPLIER=new n.InjectionToken("ACTIVATION_MULTIPLIER",{providedIn:"root",factory:function(){return 3}}),e.EXP_BASIS=new n.InjectionToken("EXP_BASIS",{providedIn:"root",factory:function(){return{"A*":1.4,A:1.4,B:1.4,C:1.4,D:1.4,E:1.4,F:1.4}}}),e.BASE=new n.InjectionToken("EXP_BASIS",{providedIn:"root",factory:function(){return{"A*":1.4,A:1.4,B:1.4,C:1.4,D:1.4,E:1.4,F:1.4}}}),e.raiseServiceFactory=s;var a=function(){function t(){}return t.prototype.getAttributesCosts=function(t){var e=this;return Object.keys(t).reduce(function(r,o){return r+e.getRaiseCosts(t[o],"E",{from:0})},0)},t.prototype.getAttributesDiffCosts=function(t,e){var r=this;return Object.keys(t).reduce(function(o,n){return o+r.getRaiseCosts(t[n],"E",{from:e[n]})},0)},t.prototype.getGiftsCosts=function(t){var e=this;return t.reduce(function(t,r){return t+e.getRaiseCosts(r.value,r.level,{from:0})+e.getActivationCost(r.level)},0)},t.prototype.getGiftsCostDiff=function(t,e){var r=this,o=new Map(e.map(function(t){return[t.name,t]}));return t.reduce(function(t,e){return o.has(e.name)?t+r.getRaiseCosts(e.value,e.level,{from:o.get(e.name).value}):t+r.getRaiseCosts(e.value,e.level,{from:0})+r.getActivationCost(e.level)},0)},t.prototype.getAdvantagesCosts=function(t){return t.reduce(function(t,e){return t+e.value},0)},t.prototype.getDisadvantagesCosts=function(t){return t.reduce(function(t,e){return t+e.value},0)},t.prototype.getTalentsCosts=function(t){var e=this;return Object.values(t).reduce(function(t,r){return t+r.reduce(function(t,r){return t+e.getRaiseCosts(r.value,r.level,{from:0})},0)},0)},t.ngInjectableDef=i.defineInjectable({factory:s,token:t,providedIn:"root"}),t}();e.RaiseService=a,e.ExponentialRaiseService=function(t){function e(e,r,o,n){var i=t.call(this)||this;return i.offsets=e,i.multipliers=r,i.activationMultiplier=o,i.basis=n,i.levels=Object.keys(i.multipliers),i}return o.__extends(e,t),e.prototype.getRaiseCosts=function(t,e,r){var o=void 0===r?{}:r,n=o.from,i=void 0===n?t-1:n;o.reduced&&(e=this.levels[this.levels.indexOf(e)-1]);for(var s=0;i++<t;)s+=Math.round(Math.pow(this.basis[e],i)*this.multipliers[e]+this.offsets[e]);return s},e.prototype.getActivationCost=function(t){return Math.round(this.activationMultiplier*this.basis[t]*this.multipliers[t]+this.offsets[t])},e}(a);var l=function(t){function e(e,r,o,n){var i=t.call(this)||this;return i.offsets=e,i.multipliers=r,i.activationMultiplier=o,i.base=n,i.levels=Object.keys(i.multipliers),i}return o.__extends(e,t),e.prototype.getRaiseCosts=function(t,e,r){var o=void 0===r?{}:r,n=o.from,i=void 0===n?t-1:n;o.reduced&&(e=this.levels[this.levels.indexOf(e)-1]);for(var s=0;i++<t;)s+=Math.round(this.getLevelCost(i,e)*this.multipliers[e]+this.offsets[e]);return s},e.prototype.getLevelCost=function(t,e){var r=Math.pow(1.1,t);return t>0?this.getLevelCost(t-1,e)+r:r},e.prototype.getActivationCost=function(t){return Math.round(this.activationMultiplier*this.getLevelCost(0,t)*this.multipliers[t]+this.offsets[t])},e}(a);e.LinearRaiseService=l,e.FibonacciRaiseService=function(t){function e(e,r,o){var n=t.call(this)||this;return n.offsets=e,n.multipliers=r,n.activationMultiplier=o,n.levels=Object.keys(n.multipliers),n}return o.__extends(e,t),e.prototype.getRaiseCosts=function(t,e,r){var o=void 0===r?{}:r,n=o.from,i=void 0===n?t-1:n;o.reduced&&(e=this.levels[this.levels.indexOf(e)-1]);for(var s=0;i++<t;)s+=Math.round(this.getFibonacci(i+1)*this.multipliers[e]+this.offsets[e]);return s},e.prototype.getActivationCost=function(t){return Math.round(this.activationMultiplier*this.multipliers[t]+this.offsets[t])},e.prototype.getFibonacci=function(t){var e=1,r=1;if(t<3)return 1;for(;t-- >=3;){var o=r;r+=e,e=o}return r},e}(a)},xdSV:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("D57K"),n=r("LoAr"),i=r("IfiR"),s=(r("g8ML"),r("HT5j"),r("JgFM")),a=r("Vs4z"),l=(r("jcUA"),function(){return function(t,e,r){this.gift=t,this.value=e,this.costs=r}}());e.IncreaseGiftEvent=l,e.GiftsComponent=function(t){function e(e,r,o,s){var a=t.call(this)||this;return a.dialog=e,a.presets=r,a.cdr=o,a.raiseService=s,a.max=1/0,a.budget=1/0,a.increase=new n.EventEmitter,a.form=new i.FormArray([]),a.mins=[],a}return o.__extends(e,t),Object.defineProperty(e.prototype,"preset",{set:function(t){this.gifts=this.presets.getGiftsForPreset(t)},enumerable:!0,configurable:!0}),e.prototype.writeValue=function(t){for(this.unregisterSubscriptions();this.form.length;)this.form.removeAt(0);if(t){this.mins=t.map(function(t){return t.value});for(var e=0,r=t;e<r.length;e++){var o=r[e];o.name&&this.addGift(o)}}this.registerSubscription(),this.cdr.markForCheck()},e.prototype.addGift=function(t){this.form.push(new i.FormGroup({name:new i.FormControl(t.name,i.Validators.required),value:new i.FormControl(t.value||0,i.Validators.required),level:new i.FormControl(t.level)}))},e.prototype.openAddDialog=function(){return o.__awaiter(this,void 0,void 0,function(){var t,e;return o.__generator(this,function(r){switch(r.label){case 0:return t=this.form.value,[4,this.dialog.open(a.AddDialogComponent,{data:{gifts:this.gifts.filter(function(e){return!t.some(function(t){return t.name===e.name})}),budget:this.budget}}).afterClosed().toPromise()];case 1:return(e=r.sent())&&(this.addGift(o.__assign({},e)),this.increase.emit(new l(e,0,this.raiseService.getActivationCost(e.level))),this.mins.push(1),this.cdr.markForCheck()),[2]}})})},e.prototype.add=function(t){var e=this.form.at(t);this.increase.emit(new l(o.__assign({},e.value,{value:e.value.value+1}),e.value.value+1,this.getCostsForNext(t))),e.patchValue({value:e.value.value+1})},e.prototype.remove=function(t){var e=this.form.at(t).get("value");e.setValue(e.value-1)},e.prototype.delete=function(t){this.form.removeAt(t),this.mins.splice(t,1)},e.prototype.getCostsForNext=function(t){var e=this.form.at(t);return this.raiseService.getRaiseCosts(e.value.value+1,e.value.level)},e}(s.AbstractComponent)}}]);