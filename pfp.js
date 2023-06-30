import { Scene } from './three.js/src/scenes/Scene.js';
import { PerspectiveCamera } from './three.js/src/cameras/PerspectiveCamera.js';
// import { WebGLRenderer } from './three.js/src/renderers/WebGLRenderer.js';
// import { AmbientLight } from './three.js/src/lights/AmbientLight.js';
// import { MeshBasicMaterial } from './three.js/src/materials/MeshBasicMaterial.js';
import { Group } from './three.js/src/objects/Group.js';
// import { BoxGeometry } from './three.js/src/geometries/BoxGeometry.js';
// import { Mesh } from './three.js/src/objects/Mesh.js';
// import { CylinderGeometry } from './three.js/src/geometries/CylinderGeometry.js';
// import { SphereGeometry } from './three.js/src/geometries/SphereGeometry.js';
// import { Box3 } from './three.js/src/math/Box3.js';
import { Vector3 } from './three.js/src/math/Vector3.js';
import { Matrix4 } from './three.js/src/math/Matrix4.js';
import { Object3D } from './three.js/src/core/Object3D.js';
import { Quaternion } from './three.js/src/math/Quaternion.js';

const _position = new Vector3();
const _quaternion = new Quaternion();
const _scale = new Vector3();

class CSS3DObject extends Object3D {

	constructor( element = document.createElement( 'div' ) ) {

		super();

		this.isCSS3DObject = true;

		this.element = element;
		this.element.style.position = 'absolute';
		this.element.style.pointerEvents = 'auto';
		this.element.style.userSelect = 'none';

		this.element.setAttribute( 'draggable', false );

		this.addEventListener( 'removed', function () {

			this.traverse( function ( object ) {

				if ( object.element instanceof Element && object.element.parentNode !== null ) {

					object.element.parentNode.removeChild( object.element );

				}

			} );

		} );

	}

	copy( source, recursive ) {

		super.copy( source, recursive );

		this.element = source.element.cloneNode( true );

		return this;

	}

}

//

const _matrix = new Matrix4();
const _matrix2 = new Matrix4();

class CSS3DRenderer {

	constructor( parameters = {} ) {

		const _this = this;

		let _width, _height;
		let _widthHalf, _heightHalf;

		const cache = {
			camera: { fov: 0, style: '' },
			objects: new WeakMap()
		};

		const domElement = parameters.element !== undefined ? parameters.element : document.createElement( 'div' );

		domElement.style.overflow = 'hidden';

		this.domElement = domElement;

		const viewElement = document.createElement( 'div' );
		viewElement.style.transformOrigin = '0 0';
		viewElement.style.pointerEvents = 'none';
		domElement.appendChild( viewElement );

		const cameraElement = document.createElement( 'div' );

		cameraElement.style.transformStyle = 'preserve-3d';

		viewElement.appendChild( cameraElement );

		this.getSize = function () {

			return {
				width: _width,
				height: _height
			};

		};

		this.render = function ( scene, camera ) {

			const fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf;

			if ( cache.camera.fov !== fov ) {

				viewElement.style.perspective = camera.isPerspectiveCamera ? fov + 'px' : '';
				cache.camera.fov = fov;

			}

			if ( camera.view && camera.view.enabled ) {

				// view offset
				viewElement.style.transform = `translate( ${ - camera.view.offsetX * ( _width / camera.view.width ) }px, ${ - camera.view.offsetY * ( _height / camera.view.height ) }px )`;

				// view fullWidth and fullHeight, view width and height
				viewElement.style.transform += `scale( ${ camera.view.fullWidth / camera.view.width }, ${ camera.view.fullHeight / camera.view.height } )`;

			} else {

				viewElement.style.transform = '';

			}

			if ( scene.matrixWorldAutoUpdate === true ) scene.updateMatrixWorld();
			if ( camera.parent === null && camera.matrixWorldAutoUpdate === true ) camera.updateMatrixWorld();

			let tx, ty;

			if ( camera.isOrthographicCamera ) {

				tx = - ( camera.right + camera.left ) / 2;
				ty = ( camera.top + camera.bottom ) / 2;

			}

			const scaleByViewOffset = camera.view && camera.view.enabled ? camera.view.height / camera.view.fullHeight : 1;
			const cameraCSSMatrix = camera.isOrthographicCamera ?
				`scale( ${ scaleByViewOffset } )` + 'scale(' + fov + ')' + 'translate(' + epsilon( tx ) + 'px,' + epsilon( ty ) + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse ) :
				`scale( ${ scaleByViewOffset } )` + 'translateZ(' + fov + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse );

			const style = cameraCSSMatrix +
				'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

			if ( cache.camera.style !== style ) {

				cameraElement.style.transform = style;

				cache.camera.style = style;

			}

			renderObject( scene, scene, camera, cameraCSSMatrix );

		};

		this.setSize = function ( width, height ) {

			_width = width;
			_height = height;
			_widthHalf = _width / 2;
			_heightHalf = _height / 2;

			domElement.style.width = width + 'px';
			domElement.style.height = height + 'px';

			viewElement.style.width = width + 'px';
			viewElement.style.height = height + 'px';

			cameraElement.style.width = width + 'px';
			cameraElement.style.height = height + 'px';

		};

		function epsilon( value ) {

			return Math.abs( value ) < 1e-10 ? 0 : value;

		}

		function getCameraCSSMatrix( matrix ) {

			const elements = matrix.elements;

			return 'matrix3d(' +
				epsilon( elements[ 0 ] ) + ',' +
				epsilon( - elements[ 1 ] ) + ',' +
				epsilon( elements[ 2 ] ) + ',' +
				epsilon( elements[ 3 ] ) + ',' +
				epsilon( elements[ 4 ] ) + ',' +
				epsilon( - elements[ 5 ] ) + ',' +
				epsilon( elements[ 6 ] ) + ',' +
				epsilon( elements[ 7 ] ) + ',' +
				epsilon( elements[ 8 ] ) + ',' +
				epsilon( - elements[ 9 ] ) + ',' +
				epsilon( elements[ 10 ] ) + ',' +
				epsilon( elements[ 11 ] ) + ',' +
				epsilon( elements[ 12 ] ) + ',' +
				epsilon( - elements[ 13 ] ) + ',' +
				epsilon( elements[ 14 ] ) + ',' +
				epsilon( elements[ 15 ] ) +
			')';

		}

		function getObjectCSSMatrix( matrix ) {

			const elements = matrix.elements;
			const matrix3d = 'matrix3d(' +
				epsilon( elements[ 0 ] ) + ',' +
				epsilon( elements[ 1 ] ) + ',' +
				epsilon( elements[ 2 ] ) + ',' +
				epsilon( elements[ 3 ] ) + ',' +
				epsilon( - elements[ 4 ] ) + ',' +
				epsilon( - elements[ 5 ] ) + ',' +
				epsilon( - elements[ 6 ] ) + ',' +
				epsilon( - elements[ 7 ] ) + ',' +
				epsilon( elements[ 8 ] ) + ',' +
				epsilon( elements[ 9 ] ) + ',' +
				epsilon( elements[ 10 ] ) + ',' +
				epsilon( elements[ 11 ] ) + ',' +
				epsilon( elements[ 12 ] ) + ',' +
				epsilon( elements[ 13 ] ) + ',' +
				epsilon( elements[ 14 ] ) + ',' +
				epsilon( elements[ 15 ] ) +
			')';

			return 'translate(-50%,-50%)' + matrix3d;

		}

		function renderObject( object, scene, camera, cameraCSSMatrix ) {

			if ( object.isCSS3DObject ) {

				const visible = ( object.visible === true ) && ( object.layers.test( camera.layers ) === true );
				object.element.style.display = ( visible === true ) ? '' : 'none';

				if ( visible === true ) {

					object.onBeforeRender( _this, scene, camera );

					let style;

					if ( object.isCSS3DSprite ) {

						// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

						_matrix.copy( camera.matrixWorldInverse );
						_matrix.transpose();

						if ( object.rotation2D !== 0 ) _matrix.multiply( _matrix2.makeRotationZ( object.rotation2D ) );

						object.matrixWorld.decompose( _position, _quaternion, _scale );
						_matrix.setPosition( _position );
						_matrix.scale( _scale );

						_matrix.elements[ 3 ] = 0;
						_matrix.elements[ 7 ] = 0;
						_matrix.elements[ 11 ] = 0;
						_matrix.elements[ 15 ] = 1;

						style = getObjectCSSMatrix( _matrix );

					} else {

						style = getObjectCSSMatrix( object.matrixWorld );

					}

					const element = object.element;
					const cachedObject = cache.objects.get( object );

					if ( cachedObject === undefined || cachedObject.style !== style ) {

						element.style.transform = style;

						const objectData = { style: style };
						cache.objects.set( object, objectData );

					}

					if ( element.parentNode !== cameraElement ) {

						cameraElement.appendChild( element );

					}

					object.onAfterRender( _this, scene, camera );

				}

			}

			for ( let i = 0, l = object.children.length; i < l; i ++ ) {

				renderObject( object.children[ i ], scene, camera, cameraCSSMatrix );

			}

		}

	}

}


    // Create a scene
    let scene = new Scene();
    var camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


    // let camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    // camera.position.z = 1.9;
    // camera.position.y = 0.65;

    var renderer = new CSS3DRenderer();

    // Set size and append to document
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // var cube = new Group();

    // var element, material, mesh;
    // var translations = [
    //     [0, 50, 0], //top
    //     [0, -50, 0], //bottom
    //     [0, 0, 50], //front
    //     [0, 0, -50], //back
    //     [50, 0, 0], //right
    //     [-50, 0, 0], //left
    // ];
    // var rotations = [
    //     [Math.PI / 2, 0, 0],
    //     [-Math.PI / 2, 0, 0],
    //     [0, 0, 0],
    //     [0, Math.PI, 0],
    //     [0, -Math.PI / 2, 0],
    //     [0, Math.PI / 2, 0],
    // ];

    // for (var i = 0; i < 6; i++) {
    //     element = document.createElement('div');
    //     element.className = 'face';
    //     material = new CSS3DObject(element);
    //     material.position.fromArray(translations[i]);
    //     material.rotation.fromArray(rotations[i]);
    //     cube.add(material);
    // }

    // scene.add(cube);

    var sphere = new Group();

    var steps = 50; // Increase for higher resolution sphere
    var size = 100; // Radius of sphere

    for (var lat = 0; lat <= steps; lat++) {
        var theta = lat * Math.PI / steps;
        var sinTheta = Math.sin(theta);
        var cosTheta = -Math.cos(theta);

        for (var lon = 0; lon <= steps; lon++) {
            var phi = lon * 2 * Math.PI / steps;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            var dot = document.createElement('div');
            dot.className = 'dot';
            var dotObject = new CSS3DObject(dot);
            dotObject.position.set(size * x, size * y, size * z);

            sphere.add(dotObject);
        }
    }

    scene.add(sphere);

    // Position camera
    camera.position.z = 500;

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        // Rotate cube
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;

        // Render
        renderer.render(scene, camera);
    }

    animate();


    // let renderer = new WebGLRenderer();
    // renderer.setSize(500, 500);
    // document.body.appendChild(renderer.domElement);

    // const ambientLight = new AmbientLight(0xffffff, 1);
    // scene.add(ambientLight);

    // const outerCubes = [];
    // const innerCubes = [];
    // const cylinders = [];

    // let group = new Group();

    // for (var i = 0; i < 10; i++) {
    //     const material = new MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.4, side: DoubleSide});

    //     var geometry = new BoxGeometry(1, 0.1, 1);
    //     var box = new Mesh(geometry, material);
    //     box.position.y = i * 0.1;
    //     box.rotation.y = Math.PI / 4;
    //     // box.rotation.y += Math.PI / 36;
    //     box.rotation.x = 12 * (Math.PI / 180);
    //     box.colorValue = Math.random() * 360; // start color
    //     box.colorIncrement = Math.random(); // color change speed
    //     box.position.z = Math.random() * 1
    //     outerCubes.push(box);
    //     group.add(box);
    // }

    // const cylinderHeight = 0.6;
    // const cylinderCount = 12;
    // const cylinderRadius = 0.35;
    // const gapSize = 0;
    // let color = 0;

    // // Create the smaller boxes
    // for (var i = 0; i < 8; i++) {
    //     const material = new MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8});

    //     var geometry = new BoxGeometry(0.8, 0.1, 0.8);
    //     var box = new Mesh(geometry, material);
    //     box.position.y = (i * 0.1) + 0.1; // Start a bit higher to be inside the larger boxes
    //     box.rotation.y = Math.PI / 4;
    //     // box.rotation.y += Math.PI / 36;
    //     box.rotation.x = 12 * (Math.PI / 180);
    //     box.colorValue = Math.random() * 360; // start color
    //     box.colorIncrement = Math.random(); // color change speed

    //     innerCubes.push(box);
    //     group.add(box);
    // }

    // for (let i = 0; i < cylinderCount; i++) {
    //   let cylinderGeometry = new CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight / cylinderCount, 32);

    //   const cylinderMaterial = new MeshBasicMaterial({
    //     color: 0xffffff, transparent: true, opacity: i % 2 === 0 ? 0 : 0.8 });

    //   const cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
    //   cylinder.position.y = (i * (cylinderHeight / cylinderCount + gapSize) - cylinderHeight / 2) - 0.4;
    //   cylinder.colorValue = Math.random() * 360; // start color
    //   cylinder.colorIncrement = Math.random(); // color change speed

    //   cylinders.push(cylinder);
    //   group.add(cylinder);
    // }

    // const eyeRadius = 0.12; // Adjust the size of the eye spheres as desired
    // const eyeGeometry = new SphereGeometry(eyeRadius, 32, 32);
    // const eyeMaterial = new MeshBasicMaterial({ color: 0x000000 });
    // const leftEye = new Mesh(eyeGeometry, eyeMaterial);
    // const rightEye = new Mesh(eyeGeometry, eyeMaterial);
    // leftEye.position.set(-0.25, 0, 0.4); // Adjust the positions of the eye spheres
    // rightEye.position.set(0.2, 0, 0.4);

    // // Add the eye spheres to the desired cubes
    // innerCubes[4].add(leftEye);
    // innerCubes[4].add(rightEye);
  
    // let g = new BoxGeometry(2, 2, 2);
    // let m = new MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.02 });
    // let largeCube = newMesh(g, m);
    // largeCube.rotation.y = Math.PI / 4;

    // group.add(largeCube)

    // // Calculate the bounding box and get its center
    // let bound = new Box3().setFromObject( group );
    // let center = bound.getCenter( new Vector3() );

    // // Adjust group position
    // group.position.x = center.x;
    // group.position.y = center.y;
    // group.position.z = center.z;

    // // Adjust positions of all children
    // group.children.forEach((child) => {
    //   child.position.x -= center.x;
    //   child.position.y -= center.y;
    //   child.position.z -= center.z;
    // });

    // scene.add(group);

    // let time = 0;


    //   // Animation loop
    // function animate() {
    //   requestAnimationFrame(animate);

    //   largeCube.rotation.y -= 0.001
    //   largeCube.rotation.x += 0.001

    //   leftEye.material.color.setHSL(Math.floor(color) / 360, 1, 0.5);
    //   leftEye.material.needsUpdate = true;

    //   for (const cube of outerCubes) {
    //     cube.material.color.setHSL(Math.floor(cube.colorValue) / 360, 1, 0.5);
    //     cube.material.needsUpdate = true;
    //     cube.rotation.y += cube.colorIncrement / 100;
        
    //     // Increment this cube's color by its unique increment
    //     cube.colorValue += cube.colorIncrement;
    //     if (cube.colorValue >= 360) cube.colorValue -= 360; // Wrap color value
    //   }

    //   for (const cube of innerCubes) {
    //     let hue = ((Math.sin(time + cube.position.y + (color / 360)) + 1) / 2);
    //     cube.material.color.setHSL(hue, 1, 0.5);
    //     cube.material.needsUpdate = true;
        
    //     color += 0.05;
    //   }

    //   for (const cube of cylinders) {
    //     let hue = ((Math.sin(time + cube.position.y + (color / 360)) + 1) / 2);
    //     cube.material.color.setHSL(hue, 1, 0.5);
    //     cube.material.needsUpdate = true;
        
    //     color += 0.05;
    //   }

    //   innerCubes[1].rotation.y -= 0.005;
    //   innerCubes[1].material.color.setHSL(Math.floor(color) / 360, 1, 0.5);
    //   innerCubes[1].material.needsUpdate = true;

    //   renderer.render(scene, camera);
    // }

    // animate();
