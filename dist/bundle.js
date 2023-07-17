/*! For license information please see bundle.js.LICENSE.txt */
(()=>{var t={190:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718),r(251),r(852),r(813));else{var n=e.Zdog;n.Anchor=i(n,n.Vector,n.CanvasRenderer,n.SvgRenderer)}}(this,(function(t,e,r,i){var n=t.TAU,o={x:1,y:1,z:1};function s(t){this.create(t||{})}return s.prototype.create=function(r){this.children=[],t.extend(this,this.constructor.defaults),this.setOptions(r),this.translate=new e(r.translate),this.rotate=new e(r.rotate),this.scale=new e(o).multiply(this.scale),this.origin=new e,this.renderOrigin=new e,this.addTo&&this.addTo.addChild(this)},s.defaults={},s.optionKeys=Object.keys(s.defaults).concat(["rotate","translate","scale","addTo"]),s.prototype.setOptions=function(t){var e=this.constructor.optionKeys;for(var r in t)-1!=e.indexOf(r)&&(this[r]=t[r])},s.prototype.addChild=function(t){-1==this.children.indexOf(t)&&(t.remove(),t.addTo=this,this.children.push(t))},s.prototype.removeChild=function(t){var e=this.children.indexOf(t);-1!=e&&this.children.splice(e,1)},s.prototype.remove=function(){this.addTo&&this.addTo.removeChild(this)},s.prototype.update=function(){this.reset(),this.children.forEach((function(t){t.update()})),this.transform(this.translate,this.rotate,this.scale)},s.prototype.reset=function(){this.renderOrigin.set(this.origin)},s.prototype.transform=function(t,e,r){this.renderOrigin.transform(t,e,r),this.children.forEach((function(i){i.transform(t,e,r)}))},s.prototype.updateGraph=function(){this.update(),this.updateFlatGraph(),this.flatGraph.forEach((function(t){t.updateSortValue()})),this.flatGraph.sort(s.shapeSorter)},s.shapeSorter=function(t,e){return t.sortValue-e.sortValue},Object.defineProperty(s.prototype,"flatGraph",{get:function(){return this._flatGraph||this.updateFlatGraph(),this._flatGraph},set:function(t){this._flatGraph=t}}),s.prototype.updateFlatGraph=function(){this.flatGraph=this.getFlatGraph()},s.prototype.getFlatGraph=function(){var t=[this];return this.addChildFlatGraph(t)},s.prototype.addChildFlatGraph=function(t){return this.children.forEach((function(e){var r=e.getFlatGraph();Array.prototype.push.apply(t,r)})),t},s.prototype.updateSortValue=function(){this.sortValue=this.renderOrigin.z},s.prototype.render=function(){},s.prototype.renderGraphCanvas=function(t){if(!t)throw new Error("ctx is "+t+". Canvas context required for render. Check .renderGraphCanvas( ctx ).");this.flatGraph.forEach((function(e){e.render(t,r)}))},s.prototype.renderGraphSvg=function(t){if(!t)throw new Error("svg is "+t+". SVG required for render. Check .renderGraphSvg( svg ).");this.flatGraph.forEach((function(e){e.render(t,i)}))},s.prototype.copy=function(e){var r={};return this.constructor.optionKeys.forEach((function(t){r[t]=this[t]}),this),t.extend(r,e),new(0,this.constructor)(r)},s.prototype.copyGraph=function(t){var e=this.copy(t);return this.children.forEach((function(t){t.copyGraph({addTo:e})})),e},s.prototype.normalizeRotate=function(){this.rotate.x=t.modulo(this.rotate.x,n),this.rotate.y=t.modulo(this.rotate.y,n),this.rotate.z=t.modulo(this.rotate.z,n)},s.subclass=function e(r){return function(i){function n(t){this.create(t||{})}return n.prototype=Object.create(r.prototype),n.prototype.constructor=n,n.defaults=t.extend({},r.defaults),t.extend(n.defaults,i),n.optionKeys=r.optionKeys.slice(0),Object.keys(n.defaults).forEach((function(t){1!=!n.optionKeys.indexOf(t)&&n.optionKeys.push(t)})),n.subclass=e(n),n}}(s),s}))},718:function(t){var e,r;e=this,r=function(){var t={};t.TAU=2*Math.PI,t.extend=function(t,e){for(var r in e)t[r]=e[r];return t},t.lerp=function(t,e,r){return(e-t)*r+t},t.modulo=function(t,e){return(t%e+e)%e};var e={2:function(t){return t*t},3:function(t){return t*t*t},4:function(t){return t*t*t*t},5:function(t){return t*t*t*t*t}};return t.easeInOut=function(t,r){if(1==r)return t;var i=(t=Math.max(0,Math.min(1,t)))<.5,n=i?t:1-t,o=(e[r]||e[2])(n/=.5);return o/=2,i?o:1-o},t},t.exports?t.exports=r():e.Zdog=r()},627:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718),r(190),r(340),r(584));else{var n=e.Zdog;n.Box=i(n,n.Anchor,n.Shape,n.Rect)}}(this,(function(t,e,r,i){var n=i.subclass();n.prototype.copyGraph=function(){};var o=t.TAU,s=["frontFace","rearFace","leftFace","rightFace","topFace","bottomFace"],h=t.extend({},r.defaults);delete h.path,s.forEach((function(t){h[t]=!0})),t.extend(h,{width:1,height:1,depth:1,fill:!0});var a=e.subclass(h);a.prototype.create=function(t){e.prototype.create.call(this,t),this.updatePath(),this.fill=this.fill},a.prototype.updatePath=function(){s.forEach((function(t){this[t]=this[t]}),this)},s.forEach((function(t){var e="_"+t;Object.defineProperty(a.prototype,t,{get:function(){return this[e]},set:function(r){this[e]=r,this.setFace(t,r)}})})),a.prototype.setFace=function(t,e){var r=t+"Rect",i=this[r];if(e){var o=this.getFaceOptions(t);o.color="string"==typeof e?e:this.color,i?i.setOptions(o):i=this[r]=new n(o),i.updatePath(),this.addChild(i)}else this.removeChild(i)},a.prototype.getFaceOptions=function(t){return{frontFace:{width:this.width,height:this.height,translate:{z:this.depth/2}},rearFace:{width:this.width,height:this.height,translate:{z:-this.depth/2},rotate:{y:o/2}},leftFace:{width:this.depth,height:this.height,translate:{x:-this.width/2},rotate:{y:-o/4}},rightFace:{width:this.depth,height:this.height,translate:{x:this.width/2},rotate:{y:o/4}},topFace:{width:this.width,height:this.depth,translate:{y:-this.height/2},rotate:{x:-o/4}},bottomFace:{width:this.width,height:this.depth,translate:{y:this.height/2},rotate:{x:o/4}}}[t]};return["color","stroke","fill","backface","front","visible"].forEach((function(t){var e="_"+t;Object.defineProperty(a.prototype,t,{get:function(){return this[e]},set:function(r){this[e]=r,s.forEach((function(e){var i=this[e+"Rect"],n="string"==typeof this[e];i&&!("color"==t&&n)&&(i[t]=r)}),this)}})})),a}))},852:function(t){var e,r;e=this,r=function(){var t={isCanvas:!0,begin:function(t){t.beginPath()},move:function(t,e,r){t.moveTo(r.x,r.y)},line:function(t,e,r){t.lineTo(r.x,r.y)},bezier:function(t,e,r,i,n){t.bezierCurveTo(r.x,r.y,i.x,i.y,n.x,n.y)},closePath:function(t){t.closePath()},setPath:function(){},renderPath:function(e,r,i,n){this.begin(e,r),i.forEach((function(i){i.render(e,r,t)})),n&&this.closePath(e,r)},stroke:function(t,e,r,i,n){r&&(t.strokeStyle=i,t.lineWidth=n,t.stroke())},fill:function(t,e,r,i){r&&(t.fillStyle=i,t.fill())},end:function(){}};return t},t.exports?t.exports=r():e.Zdog.CanvasRenderer=r()},534:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718),r(251),r(935),r(190),r(789));else{var n=e.Zdog;n.Cone=i(n,n.Vector,n.PathCommand,n.Anchor,n.Ellipse)}}(this,(function(t,e,r,i,n){var o=n.subclass({length:1,fill:!0}),s=t.TAU;o.prototype.create=function(){n.prototype.create.apply(this,arguments),this.apex=new i({addTo:this,translate:{z:this.length}}),this.renderApex=new e,this.renderCentroid=new e,this.tangentA=new e,this.tangentB=new e,this.surfacePathCommands=[new r("move",[{}]),new r("line",[{}]),new r("line",[{}])]},o.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,1/3),this.sortValue=this.renderCentroid.z},o.prototype.render=function(t,e){this.renderConeSurface(t,e),n.prototype.render.apply(this,arguments)},o.prototype.renderConeSurface=function(t,e){if(this.visible){this.renderApex.set(this.apex.renderOrigin).subtract(this.renderOrigin);var r=this.renderNormal.magnitude(),i=this.renderApex.magnitude2d(),n=this.renderNormal.magnitude2d(),o=Math.acos(n/r),h=Math.sin(o),a=this.diameter/2*r;if(a*h<i){var p=Math.atan2(this.renderNormal.y,this.renderNormal.x)+s/2,d=i/h,u=Math.acos(a/d),c=this.tangentA,f=this.tangentB;c.x=Math.cos(u)*a*h,c.y=Math.sin(u)*a,f.set(this.tangentA),f.y*=-1,c.rotateZ(p),f.rotateZ(p),c.add(this.renderOrigin),f.add(this.renderOrigin),this.setSurfaceRenderPoint(0,c),this.setSurfaceRenderPoint(1,this.apex.renderOrigin),this.setSurfaceRenderPoint(2,f);var l=this.getSurfaceRenderElement(t,e);e.renderPath(t,l,this.surfacePathCommands),e.stroke(t,l,this.stroke,this.color,this.getLineWidth()),e.fill(t,l,this.fill,this.color),e.end(t,l)}}};return o.prototype.getSurfaceRenderElement=function(t,e){if(e.isSvg)return this.surfaceSvgElement||(this.surfaceSvgElement=document.createElementNS("http://www.w3.org/2000/svg","path"),this.surfaceSvgElement.setAttribute("stroke-linecap","round"),this.surfaceSvgElement.setAttribute("stroke-linejoin","round")),this.surfaceSvgElement},o.prototype.setSurfaceRenderPoint=function(t,e){this.surfacePathCommands[t].renderPoints[0].set(e)},o}))},401:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718),r(935),r(340),r(671),r(789));else{var n=e.Zdog;n.Cylinder=i(n,n.PathCommand,n.Shape,n.Group,n.Ellipse)}}(this,(function(t,e,r,i,n){function o(){}var s=i.subclass({color:"#333",updateSort:!0});s.prototype.create=function(){i.prototype.create.apply(this,arguments),this.pathCommands=[new e("move",[{}]),new e("line",[{}])]},s.prototype.render=function(t,e){this.renderCylinderSurface(t,e),i.prototype.render.apply(this,arguments)},s.prototype.renderCylinderSurface=function(t,e){if(this.visible){var r=this.getRenderElement(t,e),i=this.frontBase,n=this.rearBase,o=i.renderNormal.magnitude(),s=i.diameter*o+i.getLineWidth();this.pathCommands[0].renderPoints[0].set(i.renderOrigin),this.pathCommands[1].renderPoints[0].set(n.renderOrigin),e.isCanvas&&(t.lineCap="butt"),e.renderPath(t,r,this.pathCommands),e.stroke(t,r,!0,this.color,s),e.end(t,r),e.isCanvas&&(t.lineCap="round")}};s.prototype.getRenderElement=function(t,e){if(e.isSvg)return this.svgElement||(this.svgElement=document.createElementNS("http://www.w3.org/2000/svg","path")),this.svgElement},s.prototype.copyGraph=o,n.subclass().prototype.copyGraph=o;var h=r.subclass({diameter:1,length:1,frontFace:void 0,fill:!0}),a=t.TAU;h.prototype.create=function(){r.prototype.create.apply(this,arguments),this.group=new s({addTo:this,color:this.color,visible:this.visible});var t=this.length/2,e=this.backface||!0;this.frontBase=this.group.frontBase=new n({addTo:this.group,diameter:this.diameter,translate:{z:t},rotate:{y:a/2},color:this.color,stroke:this.stroke,fill:this.fill,backface:this.frontFace||e,visible:this.visible}),this.rearBase=this.group.rearBase=this.frontBase.copy({translate:{z:-t},rotate:{y:0},backface:e})},h.prototype.render=function(){};return["stroke","fill","color","visible"].forEach((function(t){var e="_"+t;Object.defineProperty(h.prototype,t,{get:function(){return this[e]},set:function(r){this[e]=r,this.frontBase&&(this.frontBase[t]=r,this.rearBase[t]=r,this.group[t]=r)}})})),h}))},309:function(t){var e,r;e=this,r=function(){var t="undefined"!=typeof window,e="mousedown",r="mousemove",i="mouseup";function n(){}function o(t){this.create(t||{})}return t&&(window.PointerEvent?(e="pointerdown",r="pointermove",i="pointerup"):"ontouchstart"in window&&(e="touchstart",r="touchmove",i="touchend")),o.prototype.create=function(t){this.onDragStart=t.onDragStart||n,this.onDragMove=t.onDragMove||n,this.onDragEnd=t.onDragEnd||n,this.bindDrag(t.startElement)},o.prototype.bindDrag=function(t){(t=this.getQueryElement(t))&&(t.style.touchAction="none",t.addEventListener(e,this))},o.prototype.getQueryElement=function(t){return"string"==typeof t&&(t=document.querySelector(t)),t},o.prototype.handleEvent=function(t){var e=this["on"+t.type];e&&e.call(this,t)},o.prototype.onmousedown=o.prototype.onpointerdown=function(t){this.dragStart(t,t)},o.prototype.ontouchstart=function(t){this.dragStart(t,t.changedTouches[0])},o.prototype.dragStart=function(e,n){e.preventDefault(),this.dragStartX=n.pageX,this.dragStartY=n.pageY,t&&(window.addEventListener(r,this),window.addEventListener(i,this)),this.onDragStart(n)},o.prototype.ontouchmove=function(t){this.dragMove(t,t.changedTouches[0])},o.prototype.onmousemove=o.prototype.onpointermove=function(t){this.dragMove(t,t)},o.prototype.dragMove=function(t,e){t.preventDefault();var r=e.pageX-this.dragStartX,i=e.pageY-this.dragStartY;this.onDragMove(e,r,i)},o.prototype.onmouseup=o.prototype.onpointerup=o.prototype.ontouchend=o.prototype.dragEnd=function(){window.removeEventListener(r,this),window.removeEventListener(i,this),this.onDragEnd()},o},t.exports?t.exports=r():e.Zdog.Dragger=r()},789:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(340));else{var n=e.Zdog;n.Ellipse=i(n.Shape)}}(this,(function(t){var e=t.subclass({diameter:1,width:void 0,height:void 0,quarters:4,closed:!1});return e.prototype.setPath=function(){var t=(null!=this.width?this.width:this.diameter)/2,e=(null!=this.height?this.height:this.diameter)/2;this.path=[{x:0,y:-e},{arc:[{x:t,y:-e},{x:t,y:0}]}],this.quarters>1&&this.path.push({arc:[{x:t,y:e},{x:0,y:e}]}),this.quarters>2&&this.path.push({arc:[{x:-t,y:e},{x:-t,y:0}]}),this.quarters>3&&this.path.push({arc:[{x:-t,y:-e},{x:0,y:-e}]})},e}))},671:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(190));else{var n=e.Zdog;n.Group=i(n.Anchor)}}(this,(function(t){var e=t.subclass({updateSort:!1,visible:!0});return e.prototype.updateSortValue=function(){var e=0;this.flatGraph.forEach((function(t){t.updateSortValue(),e+=t.sortValue})),this.sortValue=e/this.flatGraph.length,this.updateSort&&this.flatGraph.sort(t.shapeSorter)},e.prototype.render=function(t,e){this.visible&&this.flatGraph.forEach((function(r){r.render(t,e)}))},e.prototype.updateFlatGraph=function(){this.flatGraph=this.addChildFlatGraph([])},e.prototype.getFlatGraph=function(){return[this]},e}))},581:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718),r(251),r(190),r(789));else{var n=e.Zdog;n.Hemisphere=i(n,n.Vector,n.Anchor,n.Ellipse)}}(this,(function(t,e,r,i){var n=i.subclass({fill:!0}),o=t.TAU;n.prototype.create=function(){i.prototype.create.apply(this,arguments),this.apex=new r({addTo:this,translate:{z:this.diameter/2}}),this.renderCentroid=new e},n.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,3/8),this.sortValue=this.renderCentroid.z},n.prototype.render=function(t,e){this.renderDome(t,e),i.prototype.render.apply(this,arguments)},n.prototype.renderDome=function(t,e){if(this.visible){var r=this.getDomeRenderElement(t,e),i=Math.atan2(this.renderNormal.y,this.renderNormal.x),n=this.diameter/2*this.renderNormal.magnitude(),s=this.renderOrigin.x,h=this.renderOrigin.y;if(e.isCanvas){var a=i+o/4,p=i-o/4;t.beginPath(),t.arc(s,h,n,a,p)}else e.isSvg&&(i=(i-o/4)/o*360,this.domeSvgElement.setAttribute("d","M "+-n+",0 A "+n+","+n+" 0 0 1 "+n+",0"),this.domeSvgElement.setAttribute("transform","translate("+s+","+h+" ) rotate("+i+")"));e.stroke(t,r,this.stroke,this.color,this.getLineWidth()),e.fill(t,r,this.fill,this.color),e.end(t,r)}};return n.prototype.getDomeRenderElement=function(t,e){if(e.isSvg)return this.domeSvgElement||(this.domeSvgElement=document.createElementNS("http://www.w3.org/2000/svg","path"),this.domeSvgElement.setAttribute("stroke-linecap","round"),this.domeSvgElement.setAttribute("stroke-linejoin","round")),this.domeSvgElement},n}))},173:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718),r(190),r(309));else{var n=e.Zdog;n.Illustration=i(n,n.Anchor,n.Dragger)}}(this,(function(t,e,r){function i(){}var n=t.TAU,o=e.subclass({element:void 0,centered:!0,zoom:1,dragRotate:!1,resize:!1,onPrerender:i,onDragStart:i,onDragMove:i,onDragEnd:i,onResize:i});return t.extend(o.prototype,r.prototype),o.prototype.create=function(t){e.prototype.create.call(this,t),r.prototype.create.call(this,t),this.setElement(this.element),this.setDragRotate(this.dragRotate),this.setResize(this.resize)},o.prototype.setElement=function(t){if(!(t=this.getQueryElement(t)))throw new Error("Zdog.Illustration element required. Set to "+t);var e=t.nodeName.toLowerCase();"canvas"==e?this.setCanvas(t):"svg"==e&&this.setSvg(t)},o.prototype.setSize=function(t,e){t=Math.round(t),e=Math.round(e),this.isCanvas?this.setSizeCanvas(t,e):this.isSvg&&this.setSizeSvg(t,e)},o.prototype.setResize=function(t){this.resize=t,this.resizeListener||(this.resizeListener=this.onWindowResize.bind(this)),t?(window.addEventListener("resize",this.resizeListener),this.onWindowResize()):window.removeEventListener("resize",this.resizeListener)},o.prototype.onWindowResize=function(){this.setMeasuredSize(),this.onResize(this.width,this.height)},o.prototype.setMeasuredSize=function(){var t,e;if("fullscreen"==this.resize)t=window.innerWidth,e=window.innerHeight;else{var r=this.element.getBoundingClientRect();t=r.width,e=r.height}this.setSize(t,e)},o.prototype.renderGraph=function(t){this.isCanvas?this.renderGraphCanvas(t):this.isSvg&&this.renderGraphSvg(t)},o.prototype.updateRenderGraph=function(t){this.updateGraph(),this.renderGraph(t)},o.prototype.setCanvas=function(t){this.element=t,this.isCanvas=!0,this.ctx=this.element.getContext("2d"),this.setSizeCanvas(t.width,t.height)},o.prototype.setSizeCanvas=function(t,e){this.width=t,this.height=e;var r=this.pixelRatio=window.devicePixelRatio||1;this.element.width=this.canvasWidth=t*r,this.element.height=this.canvasHeight=e*r,r>1&&!this.resize&&(this.element.style.width=t+"px",this.element.style.height=e+"px")},o.prototype.renderGraphCanvas=function(t){t=t||this,this.prerenderCanvas(),e.prototype.renderGraphCanvas.call(t,this.ctx),this.postrenderCanvas()},o.prototype.prerenderCanvas=function(){var t=this.ctx;if(t.lineCap="round",t.lineJoin="round",t.clearRect(0,0,this.canvasWidth,this.canvasHeight),t.save(),this.centered){var e=this.width/2*this.pixelRatio,r=this.height/2*this.pixelRatio;t.translate(e,r)}var i=this.pixelRatio*this.zoom;t.scale(i,i),this.onPrerender(t)},o.prototype.postrenderCanvas=function(){this.ctx.restore()},o.prototype.setSvg=function(t){this.element=t,this.isSvg=!0,this.pixelRatio=1;var e=t.getAttribute("width"),r=t.getAttribute("height");this.setSizeSvg(e,r)},o.prototype.setSizeSvg=function(t,e){this.width=t,this.height=e;var r=t/this.zoom,i=e/this.zoom,n=this.centered?-r/2:0,o=this.centered?-i/2:0;this.element.setAttribute("viewBox",n+" "+o+" "+r+" "+i),this.resize?(this.element.removeAttribute("width"),this.element.removeAttribute("height")):(this.element.setAttribute("width",t),this.element.setAttribute("height",e))},o.prototype.renderGraphSvg=function(t){t=t||this,function(t){for(;t.firstChild;)t.removeChild(t.firstChild)}(this.element),this.onPrerender(this.element),e.prototype.renderGraphSvg.call(t,this.element)},o.prototype.setDragRotate=function(t){t&&(!0===t&&(t=this),this.dragRotate=t,this.bindDrag(this.element))},o.prototype.dragStart=function(){this.dragStartRX=this.dragRotate.rotate.x,this.dragStartRY=this.dragRotate.rotate.y,r.prototype.dragStart.apply(this,arguments)},o.prototype.dragMove=function(t,e){var i=e.pageX-this.dragStartX,o=e.pageY-this.dragStartY,s=Math.min(this.width,this.height),h=i/s*n,a=o/s*n;this.dragRotate.rotate.x=this.dragStartRX-a,this.dragRotate.rotate.y=this.dragStartRY-h,r.prototype.dragMove.apply(this,arguments)},o}))},482:function(t,e,r){var i,n,o,s,h,a,p,d,u,c,f,l,y,g,v,m,x,w,S,b,C,z;s=this,t.exports?t.exports=(h=r(718),a=r(852),p=r(813),d=r(251),u=r(190),c=r(309),f=r(173),l=r(935),y=r(340),g=r(671),v=r(584),m=r(523),x=r(789),w=r(248),S=r(581),b=r(401),C=r(534),z=r(627),h.CanvasRenderer=a,h.SvgRenderer=p,h.Vector=d,h.Anchor=u,h.Dragger=c,h.Illustration=f,h.PathCommand=l,h.Shape=y,h.Group=g,h.Rect=v,h.RoundedRect=m,h.Ellipse=x,h.Polygon=w,h.Hemisphere=S,h.Cylinder=b,h.Cone=C,h.Box=z,h):(n=[],i=s.Zdog,void 0===(o="function"==typeof i?i.apply(e,n):i)||(t.exports=o))},935:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(251));else{var n=e.Zdog;n.PathCommand=i(n.Vector)}}(this,(function(t){function e(e,n,o){this.method=e,this.points=n.map(r),this.renderPoints=n.map(i),this.previousPoint=o,this.endRenderPoint=this.renderPoints[this.renderPoints.length-1],"arc"==e&&(this.controlPoints=[new t,new t])}function r(e){return e instanceof t?e:new t(e)}function i(e){return new t(e)}e.prototype.reset=function(){var t=this.points;this.renderPoints.forEach((function(e,r){var i=t[r];e.set(i)}))},e.prototype.transform=function(t,e,r){this.renderPoints.forEach((function(i){i.transform(t,e,r)}))},e.prototype.render=function(t,e,r){return this[this.method](t,e,r)},e.prototype.move=function(t,e,r){return r.move(t,e,this.renderPoints[0])},e.prototype.line=function(t,e,r){return r.line(t,e,this.renderPoints[0])},e.prototype.bezier=function(t,e,r){var i=this.renderPoints[0],n=this.renderPoints[1],o=this.renderPoints[2];return r.bezier(t,e,i,n,o)};var n=9/16;return e.prototype.arc=function(t,e,r){var i=this.previousPoint,o=this.renderPoints[0],s=this.renderPoints[1],h=this.controlPoints[0],a=this.controlPoints[1];return h.set(i).lerp(o,n),a.set(s).lerp(o,n),r.bezier(t,e,h,a,s)},e}))},248:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718),r(340));else{var n=e.Zdog;n.Polygon=i(n,n.Shape)}}(this,(function(t,e){var r=e.subclass({sides:3,radius:.5}),i=t.TAU;return r.prototype.setPath=function(){this.path=[];for(var t=0;t<this.sides;t++){var e=t/this.sides*i-i/4,r=Math.cos(e)*this.radius,n=Math.sin(e)*this.radius;this.path.push({x:r,y:n})}},r}))},584:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(340));else{var n=e.Zdog;n.Rect=i(n.Shape)}}(this,(function(t){var e=t.subclass({width:1,height:1});return e.prototype.setPath=function(){var t=this.width/2,e=this.height/2;this.path=[{x:-t,y:-e},{x:t,y:-e},{x:t,y:e},{x:-t,y:e}]},e}))},523:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(340));else{var n=e.Zdog;n.RoundedRect=i(n.Shape)}}(this,(function(t){var e=t.subclass({width:1,height:1,cornerRadius:.25,closed:!1});return e.prototype.setPath=function(){var t=this.width/2,e=this.height/2,r=Math.min(t,e),i=Math.min(this.cornerRadius,r),n=t-i,o=e-i,s=[{x:n,y:-e},{arc:[{x:t,y:-e},{x:t,y:-o}]}];o&&s.push({x:t,y:o}),s.push({arc:[{x:t,y:e},{x:n,y:e}]}),n&&s.push({x:-n,y:e}),s.push({arc:[{x:-t,y:e},{x:-t,y:o}]}),o&&s.push({x:-t,y:-o}),s.push({arc:[{x:-t,y:-e},{x:-n,y:-e}]}),n&&s.push({x:n,y:-e}),this.path=s},e}))},340:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718),r(251),r(935),r(190));else{var n=e.Zdog;n.Shape=i(n,n.Vector,n.PathCommand,n.Anchor)}}(this,(function(t,e,r,i){var n=i.subclass({stroke:1,fill:!1,color:"#333",closed:!0,visible:!0,path:[{}],front:{z:1},backface:!0});n.prototype.create=function(t){i.prototype.create.call(this,t),this.updatePath(),this.front=new e(t.front||this.front),this.renderFront=new e(this.front),this.renderNormal=new e};var o=["move","line","bezier","arc"];n.prototype.updatePath=function(){this.setPath(),this.updatePathCommands()},n.prototype.setPath=function(){},n.prototype.updatePathCommands=function(){var t;this.pathCommands=this.path.map((function(e,i){var n=Object.keys(e),s=n[0],h=e[s];1==n.length&&-1!=o.indexOf(s)||(s="line",h=e);var a="line"==s||"move"==s,p=Array.isArray(h);a&&!p&&(h=[h]);var d=new r(s=0===i?"move":s,h,t);return t=d.endRenderPoint,d}))},n.prototype.reset=function(){this.renderOrigin.set(this.origin),this.renderFront.set(this.front),this.pathCommands.forEach((function(t){t.reset()}))},n.prototype.transform=function(t,e,r){this.renderOrigin.transform(t,e,r),this.renderFront.transform(t,e,r),this.renderNormal.set(this.renderOrigin).subtract(this.renderFront),this.pathCommands.forEach((function(i){i.transform(t,e,r)})),this.children.forEach((function(i){i.transform(t,e,r)}))},n.prototype.updateSortValue=function(){var t=this.pathCommands.length,e=this.pathCommands[0].endRenderPoint,r=this.pathCommands[t-1].endRenderPoint;t>2&&e.isSame(r)&&(t-=1);for(var i=0,n=0;n<t;n++)i+=this.pathCommands[n].endRenderPoint.z;this.sortValue=i/t},n.prototype.render=function(t,e){var r=this.pathCommands.length;if(this.visible&&r&&(this.isFacingBack=this.renderNormal.z>0,this.backface||!this.isFacingBack)){if(!e)throw new Error("Zdog renderer required. Set to "+e);var i=1==r;e.isCanvas&&i?this.renderCanvasDot(t,e):this.renderPath(t,e)}};var s=t.TAU;n.prototype.renderCanvasDot=function(t){var e=this.getLineWidth();if(e){t.fillStyle=this.getRenderColor();var r=this.pathCommands[0].endRenderPoint;t.beginPath();var i=e/2;t.arc(r.x,r.y,i,0,s),t.fill()}},n.prototype.getLineWidth=function(){return this.stroke?1==this.stroke?1:this.stroke:0},n.prototype.getRenderColor=function(){return"string"==typeof this.backface&&this.isFacingBack?this.backface:this.color},n.prototype.renderPath=function(t,e){var r=this.getRenderElement(t,e),i=!(2==this.pathCommands.length&&"line"==this.pathCommands[1].method)&&this.closed,n=this.getRenderColor();e.renderPath(t,r,this.pathCommands,i),e.stroke(t,r,this.stroke,n,this.getLineWidth()),e.fill(t,r,this.fill,n),e.end(t,r)};return n.prototype.getRenderElement=function(t,e){if(e.isSvg)return this.svgElement||(this.svgElement=document.createElementNS("http://www.w3.org/2000/svg","path"),this.svgElement.setAttribute("stroke-linecap","round"),this.svgElement.setAttribute("stroke-linejoin","round")),this.svgElement},n}))},813:function(t){var e,r;e=this,r=function(){var t={isSvg:!0},e=t.round=function(t){return Math.round(1e3*t)/1e3};function r(t){return e(t.x)+","+e(t.y)+" "}return t.begin=function(){},t.move=function(t,e,i){return"M"+r(i)},t.line=function(t,e,i){return"L"+r(i)},t.bezier=function(t,e,i,n,o){return"C"+r(i)+r(n)+r(o)},t.closePath=function(){return"Z"},t.setPath=function(t,e,r){e.setAttribute("d",r)},t.renderPath=function(e,r,i,n){var o="";i.forEach((function(i){o+=i.render(e,r,t)})),n&&(o+=this.closePath(e,r)),this.setPath(e,r,o)},t.stroke=function(t,e,r,i,n){r&&(e.setAttribute("stroke",i),e.setAttribute("stroke-width",n))},t.fill=function(t,e,r,i){var n=r?i:"none";e.setAttribute("fill",n)},t.end=function(t,e){t.appendChild(e)},t},t.exports?t.exports=r():e.Zdog.SvgRenderer=r()},251:function(t,e,r){!function(e,i){if(t.exports)t.exports=i(r(718));else{var n=e.Zdog;n.Vector=i(n)}}(this,(function(t){function e(t){this.set(t)}var r=t.TAU;function i(t,e,i,n){if(e&&e%r!=0){var o=Math.cos(e),s=Math.sin(e),h=t[i],a=t[n];t[i]=h*o-a*s,t[n]=a*o+h*s}}function n(t){return Math.abs(t-1)<1e-8?1:Math.sqrt(t)}return e.prototype.set=function(t){return this.x=t&&t.x||0,this.y=t&&t.y||0,this.z=t&&t.z||0,this},e.prototype.write=function(t){return t?(this.x=null!=t.x?t.x:this.x,this.y=null!=t.y?t.y:this.y,this.z=null!=t.z?t.z:this.z,this):this},e.prototype.rotate=function(t){if(t)return this.rotateZ(t.z),this.rotateY(t.y),this.rotateX(t.x),this},e.prototype.rotateZ=function(t){i(this,t,"x","y")},e.prototype.rotateX=function(t){i(this,t,"y","z")},e.prototype.rotateY=function(t){i(this,t,"x","z")},e.prototype.isSame=function(t){return!!t&&(this.x===t.x&&this.y===t.y&&this.z===t.z)},e.prototype.add=function(t){return t?(this.x+=t.x||0,this.y+=t.y||0,this.z+=t.z||0,this):this},e.prototype.subtract=function(t){return t?(this.x-=t.x||0,this.y-=t.y||0,this.z-=t.z||0,this):this},e.prototype.multiply=function(t){return null==t||("number"==typeof t?(this.x*=t,this.y*=t,this.z*=t):(this.x*=null!=t.x?t.x:1,this.y*=null!=t.y?t.y:1,this.z*=null!=t.z?t.z:1)),this},e.prototype.transform=function(t,e,r){return this.multiply(r),this.rotate(e),this.add(t),this},e.prototype.lerp=function(e,r){return this.x=t.lerp(this.x,e.x||0,r),this.y=t.lerp(this.y,e.y||0,r),this.z=t.lerp(this.z,e.z||0,r),this},e.prototype.magnitude=function(){return n(this.x*this.x+this.y*this.y+this.z*this.z)},e.prototype.magnitude2d=function(){return n(this.x*this.x+this.y*this.y)},e.prototype.copy=function(){return new e(this)},e}))}},e={};function r(i){var n=e[i];if(void 0!==n)return n.exports;var o=e[i]={exports:{}};return t[i].call(o.exports,o,o.exports,r),o.exports}r.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return r.d(e,{a:e}),e},r.d=(t,e)=>{for(var i in e)r.o(e,i)&&!r.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";var t=r(482);let e=document.querySelector("#sqordinal"),i=window.innerWidth,n=window.innerHeight;e.width=i,e.height=n;let o=new t.Illustration({element:e,dragRotate:!0,zoom:3,width:i,height:n,rotate:{x:-.42,y:-.4},translate:{y:10}});const s=[],h=[];for(let e=0;e<10;e++){let r=36*e,i="hsl("+r+", 100%, 50%)",n=new t.Box({addTo:o,width:100,height:3,depth:100,stroke:!1,color:i,translate:{y:5*-e}});n.rotate.x=.1*Math.random(),n.rotate.y=.1*Math.random(),n.rotate.z=.1*Math.random(),s.push({box:n,hue:r})}let a=new t.Box({addTo:o,width:33.333333333333336,height:33.333333333333336,depth:33.333333333333336,stroke:10,color:"#fff",leftFace:"#fff",rightFace:"#fff",topFace:"#fff",bottomFace:"#fff",translate:{y:-30}}),p=new t.Box({addTo:o,width:12.5,height:12.5,depth:12.5,stroke:!1,color:"#fff",leftFace:"#fff",rightFace:"#fff",topFace:"#fff",bottomFace:"#fff",translate:{y:-30}});new t.Shape({addTo:a,stroke:10/1.2,color:"white",translate:{x:-10,z:22}}),new t.Shape({addTo:a,stroke:10/1.2,color:"white",translate:{x:10,z:22}});for(let e=0;e<6;e++){let r=36*e,i=new t.Cylinder({addTo:o,diameter:33.333333333333336,length:5,stroke:!1,color:"#fff",rotate:{x:t.TAU/4},translate:{y:5*e}});h.push({cylinder:i,hue:r})}e.addEventListener("wheel",(function(t){let e=-.01*t.deltaY;o.zoom+=e,t.preventDefault()}),{passive:!1});let d=0;e.addEventListener("touchmove",(function(t){if(2===t.touches.length){let e=t.touches[0],r=t.touches[1],i=r.pageX-e.pageX,n=r.pageY-e.pageY,s=Math.sqrt(i*i+n*n);if(d>0){let t=s-d;o.zoom+=.01*t}d=s}else d=0;t.preventDefault()}));const u=(t,e,r,i)=>{let n,o,s;if(0===e)n=o=s=r;else{let i=function(t,e,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?t+6*(e-t)*r:r<.5?e:r<2/3?t+(e-t)*(2/3-r)*6:t},h=r<.5?r*(1+e):r+e-r*e,a=2*r-h;n=i(a,h,t+1/3),o=i(a,h,t),s=i(a,h,t-1/3)}return`rgba(${Math.round(255*n)}, ${Math.round(255*o)}, ${Math.round(255*s)}, ${i})`};let c;!function t(){for(let t of s){t.hue=(t.hue+1)%360;let e=u(t.hue/360,1,.5,.8),r=u(t.hue/360,1,.5,0);t.box.color=e,t.box.leftFace=r,t.box.rightFace=r,t.box.topFace=r,t.box.bottomFace=r;let i=.01*Math.random(),n=.01*Math.random(),o=.01*Math.random();t.box.rotate.x+=i,t.box.rotate.y+=n,t.box.rotate.z+=o}for(let t of h){t.hue=(t.hue+1)%360;let e=u(t.hue/360,1,.5,.5);t.cylinder.color=e,c=e}a.color=c,a.leftFace=c,a.rightFace=c,a.topFace=c,a.bottomFace=c,p.rotate.x+=.01,p.rotate.y+=.01,p.rotate.z+=.01,o.updateRenderGraph(),requestAnimationFrame(t)}()})()})();